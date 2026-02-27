
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { generateObject } from 'ai';
import { z } from 'zod';
import { google } from '@ai-sdk/google';
import { exit } from 'process';

// Load environment variables
dotenv.config();

// Interfaces
interface ModelLimit {
  name: string;
  rpm?: number | string;
  rpd?: number | string;
  tpm?: number | string;
  tpd?: number | string;
  // We treat number | string because sometimes strict number parsing fails or we want to allow "Unlimited" etc, 
  // but the Schema will try to coerce to number/string. 
  // For consistency with existing data, we target numbers where possible.
}

interface Provider {
  id: string; // e.g. "google-ai-studio"
  name: string;
  url: string; // The documentation URL
  type: "Free" | "Trial" | "Paid" | "Other";
  limits?: string; // Summary info
  models: any[]; // schema-flexible models list
  lastUpdated?: string;
}

// Configuration: Providers and their specific Docs URLs
const PROVIDERS_CONFIG = [
  {
    name: "Groq",
    url: "https://console.groq.com/docs/rate-limits",
    id: "groq"
  },
  {
    name: "Google AI Studio",
    url: "https://ai.google.dev/pricing", // User specified this, though rate-limits page is also good. Sticking to user request.
    id: "google-ai-studio"
  },
  {
    name: "Cerebras",
    url: "https://cerebras.ai/pricing",
    id: "cerebras"
  },
  {
    name: "OpenRouter",
    url: "https://openrouter.ai/docs/limits",
    id: "openrouter"
  },
  {
    name: "Mistral AI",
    url: "https://mistral.ai/technology/#pricing",
    id: "mistral-ai"
  }
];

const OUTPUT_FILE = path.join(process.cwd(), 'src', 'data', 'providers.json');

const TMP_DIR = path.join(process.cwd(), 'tmp');
if (!fs.existsSync(TMP_DIR)) {
  fs.mkdirSync(TMP_DIR, { recursive: true });
}

// --- Helper Functions ---

// Fetch content using Jina.ai for cleaner markdown
async function fetchWithJina(url: string): Promise<string> {
  const jinaUrl = `https://r.jina.ai/${url}`;
  try {
    console.log(`  Fetching ${jinaUrl}...`);
    const options: RequestInit = {};

    if (process.env.JINA_API_KEY) {
      options.headers = {
        'Authorization': `Bearer ${process.env.JINA_API_KEY}`,
        'X-With-Generated-Alt': 'false'
      };
    }

    const response = await fetch(jinaUrl, options);
    if (!response.ok) {
      console.error(`  Failed to fetch ${jinaUrl}: ${response.status} ${response.statusText}`);
      return "";
    }
    const text = await response.text();
    return text;
  } catch (error) {
    console.error(`  Error fetching ${jinaUrl}:`, error);
    return "";
  }
}

// Zod Schema for Extraction
const ExtractedModelLimitSchema = z.object({
  model_id: z.string().describe("The exact model identifier if available, or name"),
  limits: z.object({
    RPM: z.string().or(z.number()).optional().describe("Requests per minute"),
    RPD: z.string().or(z.number()).optional().describe("Requests per day"),
    TPM: z.string().or(z.number()).optional().describe("Tokens per minute"),
    TPD: z.string().or(z.number()).optional().describe("Tokens per day"),
    context_window: z.string().optional().describe("Context window size (e.g. 128k)"),
  }).optional()
});

const ExtractedProviderSchema = z.object({
  name: z.string(),
  summary_limits: z.string().describe("A short summary of the free tier limits"),
  models: z.array(ExtractedModelLimitSchema),
});

async function processProvider(config: typeof PROVIDERS_CONFIG[0]) {
  console.log(`Processing ${config.name}...`);

  // 1. Scrape
  let scrapedContent = await fetchWithJina(config.url);
  if (!scrapedContent || scrapedContent.length < 100) {
    console.warn(`  Warning: Scraped content for ${config.name} seems empty or too short. Skipping.`);
    return null;
  }

  fs.writeFileSync(path.join(TMP_DIR, `${config.id}-raw.txt`), scrapedContent);

  console.log(`  Got ${scrapedContent.length} chars of content.`);
  //             ${scrapedContent.slice(0, 50000)} 

  // Strip markdown image syntax: [![alt](img_url)](link_url) and ![alt](url)
  scrapedContent = scrapedContent.replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1');
  // Strip markdown link syntax: [text](url)
  scrapedContent = scrapedContent.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');
  // Strip absolute URLs (http:// or https://)
  scrapedContent = scrapedContent.replace(/https?:\/\/\S+/g, '');
  // Strip bare domain links like console.groq.com/docs/... or le.groq.com/path
  scrapedContent = scrapedContent.replace(/\b[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\/\S*/g, '');

  fs.writeFileSync(path.join(TMP_DIR, `${config.id}-cleaned.txt`), scrapedContent);

  // const prompt = `
  //           You are an expert at extracting API Rate Limits from technical documentation.

  //           Docs URL: ${config.url}
  //           Provider: ${config.name}

  //           Task:
  //           Extract the **Free Tier** limits for this provider.
  //           Focus on finding:
  //           - Model Names / IDs
  //           - RPM (Requests per Minute)
  //           - RPD (Requests per Day)
  //           - TPM (Tokens per Minute)
  //           - TPD (Tokens per Day)

  //           If specific models have specific limits, list them.
  //           If there is a global free tier limit applying to all models, list "All Models" or the specific model names if stated.

  //           For OpenRouter, focus on the "Free" models section/limits.
  //           For Google AI Studio, look for "Free of charge" limits.

  //           Context (Markdown from Jina):
  //           ${scrapedContent} 
  //           // Truncating to 50k chars to be safe, though Flash handles huge context.
  //           `
  const prompt = `
======================================================
Docs URL: ${config.url}
Provider: ${config.name}

Actúa como un extractor de datos técnicos experto en APIs de IA. Tu tarea es analizar el texto proporcionado y extraer exclusivamente la información correspondiente al "Free Tier" (Nivel Gratuito) para generar un objeto JSON siguiendo estrictamente el esquema que te daré.

REGLAS DE EXTRACCIÓN:
1. Identifica el nombre del servicio (ej. Groq, Cerebras, Google AI Studio).
2. Extrae todos los modelos disponibles en el nivel gratuito.
3. Para los límites (RPM, TPM, RPD, TPD), asegúrate de que el valor sea un número ENTERO. Si el dato no está disponible o es "ilimitado", usa 0.
4. Para "context_window", busca el tamaño máximo de contexto del modelo (ej. "128k", "1M"). Si no se especifica, usa "N/A".
5. Si el texto no menciona explícitamente un límite diario (RPD/TPD) pero sí uno por minuto (RPM/TPM), mantén los diarios en 0.

ESTRUCTURA JSON REQUERIDA:
{
  "name": "Nombre del Servicio",
  "models": [
    {
      "model_id": "nombre-del-modelo",
      "limits": {
        "RPM": 0,
        "TPM": 0,
        "RPD": 0,
        "TPD": 0,
        "context_window": "valor"
      }
    }
  ]
}

RESPUESTA:
Genera únicamente el código JSON, sin explicaciones, sin bloques de texto adicionales y sin Markdown de bloque (no incluyas '''json).

CONTENIDO A ANALIZAR:
${scrapedContent} 
======================================================
`

  // 2. Extract with LLM
  fs.writeFileSync(path.join(TMP_DIR, `${config.id}-prompt.txt`), prompt);

  try {
    const { object } = await generateObject({
      model: google('gemini-2.5-flash-lite'), // Using a stable model
      schema: ExtractedProviderSchema,
      prompt: prompt
    });

    console.log(`  Extracted ${object.models.length} models for ${config.name}.`);
    return object;

  } catch (error) {
    console.error(`  LLM Extraction failed for ${config.name}:`, error);
    return null;
  }
}

async function main() {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    console.error("Error: GOOGLE_GENERATIVE_AI_API_KEY is not set.");
    process.exit(1);
  }

  // 1. Load existing providers
  let existingProviders: any[] = [];
  if (fs.existsSync(OUTPUT_FILE)) {
    try {
      existingProviders = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf-8'));
      console.log(`Loaded ${existingProviders.length} existing providers.`);
    } catch (e) {
      console.error("Could not parse existing providers file. Starting fresh.");
    }
  }

  // 2. Iterate and Update
  for (const config of PROVIDERS_CONFIG) {
    const result = await processProvider(config);
    if (result) {
      // Find existing entry index
      const index = existingProviders.findIndex(p =>
        p.id === config.id ||
        p.name.toLowerCase() === config.name.toLowerCase()
      );

      const newEntry = {
        id: config.id,
        name: config.name,
        url: config.url,
        type: "Free", // Assuming we are targeting free tier
        notes: result.summary_limits,
        limits: result.summary_limits, // Mapping to legacy field if needed
        models: result.models.map(m => ({
          model_id: m.model_id,
          limits: m.limits
        })),
        lastUpdated: new Date().toISOString()
      };

      if (index !== -1) {
        console.log(`  Updating existing entry for ${config.name}.`);
        // Merge/Overwrite
        existingProviders[index] = {
          ...existingProviders[index],
          ...newEntry
        };
      } else {
        console.log(`  Adding new entry for ${config.name}.`);
        existingProviders.push(newEntry);
      }

      // Save immediately after each success (handling the "update the file" part robustly)
      fs.writeFileSync(OUTPUT_FILE, JSON.stringify(existingProviders, null, 2));
      console.log(`  Saved updates for ${config.name}.`);
    }

    // Wait a bit to be nice to rate limits
    await new Promise(res => setTimeout(res, 2000));
  }

  console.log("Done.");
}

main();
