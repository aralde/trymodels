import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { generateObject } from 'ai';
import { z } from 'zod';
import { google } from '@ai-sdk/google';

// Load environment variables
dotenv.config();

// Define the interfaces for the provider data
interface ModelLimit {
    name: string;
    rpm?: number;
    rpd?: number;
    tpm?: number;
    tpd?: number;
    ash?: number;
    asd?: number;
}

interface Provider {
    id: string;
    name: string;
    url: string;
    type: "Free" | "Trial";
    limits: string;
    tpm?: number;
    rpm?: number;
    rpd?: number;
    tpd?: number;
    models: (string | ModelLimit)[];
}

const MARKDOWN_FILE = path.join(process.cwd(), 'src', 'data', 'document_free_models_contracts.md');
const OUTPUT_FILE = path.join(process.cwd(), 'src', 'data', 'providers.json');

// Helper to strip HTML tags and reduce noise
function simplifyHtml(html: string): string {
    let text = html.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "");
    text = text.replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gim, "");
    text = text.replace(/<[^>]*>/g, " ");
    text = text.replace(/\s+/g, " ").trim();
    return text;
}

// Helper to extract providers from the markdown file
function extractProvidersFromMarkdown(): { name: string; url: string }[] {
    const content = fs.readFileSync(MARKDOWN_FILE, 'utf-8');
    const lines = content.split('\n');
    const providers: { name: string; url: string }[] = [];

    const rowRegex = /\|\s*\*\*(.+?)\*\*\s*\|.*?\|.*?\|\s*\[.*?\]\((.+?)\)\s*\|/;

    for (const line of lines) {
        const match = line.match(rowRegex);
        if (match) {
            providers.push({
                name: match[1].trim(),
                url: match[2].trim()
            });
        }
    }
    // High priority: Groq, Google AI Studio, OpenRouter
    return providers.sort((a, b) => {
        const priorities = ['Groq', 'Google AI Studio', 'OpenRouter'];
        const aIndex = priorities.indexOf(a.name);
        const bIndex = priorities.indexOf(b.name);
        if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
        if (aIndex !== -1) return -1;
        if (bIndex !== -1) return 1;
        return 0;
    });
}

// Helper to fetch page content
async function fetchPageContent(url: string, retryWithSlash = true): Promise<string> {
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
            },
            redirect: 'follow'
        });

        if (!response.ok) {
            console.error(`  Fetch failed for ${url}: ${response.status}`);
            return "";
        }
        return await response.text();
    } catch (error: any) {
        const errorMessage = error.message || "";
        const causeMessage = error.cause?.message || "";

        if (retryWithSlash && (errorMessage.includes('redirect') || causeMessage.includes('redirect')) && !url.endsWith('/')) {
            console.log(`  Redirect loop detected for ${url}. Retrying with trailing slash...`);
            return fetchPageContent(url + '/', false);
        }
        console.error(`  Fetch error for ${url}:`, errorMessage, causeMessage ? `(Cause: ${causeMessage})` : "");
        return "";
    }
}

// Zod schemas for structured output
const ModelLimitSchema = z.object({
    name: z.string().describe("The name or ID of the model"),
    rpm: z.number().optional().describe("Requests per minute (RPM)"),
    rpd: z.number().optional().describe("Requests per day (RPD)"),
    tpm: z.number().optional().describe("Tokens per minute (TPM)"),
    tpd: z.number().optional().describe("Tokens per day (TPD)"),
    ash: z.number().optional().describe("Audio seconds per hour (ASH)"),
    asd: z.number().optional().describe("Audio seconds per day (ASD)"),
});

const ProviderSchema = z.object({
    type: z.enum(["Free", "Trial"]).describe("Is it a permanently free tier or a temporary trial?"),
    summaryLimits: z.string().describe("A concise summary of the overall limits for this provider if applicable"),
    models: z.array(ModelLimitSchema).describe("Detailed list of individual models and their specific limits"),
});

async function processProvider(provider: { name: string; url: string }): Promise<Provider | null> {
    console.log(`Processing ${provider.name}...`);

    const htmlContent = await fetchPageContent(provider.url);
    if (!htmlContent) return null;

    const cleanText = simplifyHtml(htmlContent);
    console.log(`  Cleaned text: ${cleanText.length} chars.`);

    const relevantContent = cleanText.substring(0, 15000);

    try {
        console.log(`  Asking Gemini 2.0 Flash for granular limits...`);
        const { object } = await generateObject({
            model: google('gemini-2.5-flash-lite'),
            schema: ProviderSchema,
            prompt: `
            Analyze the documentation for "${provider.name}" and extract free tier model limits.
            
            EXTRACT FOR EACH MODEL:
            - Name: Model identifier
            - RPM, RPD, TPM, TPD: Numeric limits
            - ASH, ASD: Audio limits (if present)

            Return a structured list of models. If multiple models share the same limits, list them individually.

            Documentation Text:
            ${relevantContent}
            `,
        });

        console.log(`  Successfully extracted ${object.models.length} models for ${provider.name}.`);

        return {
            id: provider.name.toLowerCase().replace(/\s+/g, '-'),
            name: provider.name,
            url: provider.url,
            type: object.type,
            limits: object.summaryLimits,
            models: object.models
        };

    } catch (error: any) {
        if (error?.data?.error?.code === 429 || error?.message?.includes("quota")) {
            throw error; // Rethrow to be caught by main for aborting
        }
        console.error(`  LLM Error for ${provider.name}:`, error);
        return null;
    }
}

async function main() {
    try {
        if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
            console.error("Error: GOOGLE_GENERATIVE_AI_API_KEY not found in .env file.");
            process.exit(1);
        }

        const providersToFetch = extractProvidersFromMarkdown();

        // Load existing data if available
        let existingData: Provider[] = [];
        if (fs.existsSync(OUTPUT_FILE)) {
            try {
                existingData = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf-8'));
                console.log(`Loaded ${existingData.length} existing providers from ${OUTPUT_FILE}`);
            } catch (e) {
                console.error(`Warning: Could not parse existing ${OUTPUT_FILE}. Starting with empty data.`);
            }
        }

        // Use a map for easier updates while preserving others
        const providersMap = new Map<string, Provider>();
        existingData.forEach(p => providersMap.set(p.id, p));

        console.log(`Found ${providersToFetch.length} providers in markdown. Processing...`);

        for (const p of providersToFetch) {
            const id = p.name.toLowerCase().replace(/\s+/g, '-');
            try {
                const data = await processProvider(p);
                if (data) {
                    providersMap.set(id, data);
                    // Save incrementally - now writing the full map contents to preserve others
                    const currentResults = Array.from(providersMap.values());
                    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(currentResults, null, 2));
                    console.log(`  [Saved Progress: ${id}]`);
                } else {
                    console.log(`  [Skipped ${p.name}] No data retrieved, preserving existing info if any.`);
                }
            } catch (err: any) {
                if (err?.data?.error?.code === 429 || err?.message?.includes("quota")) {
                    console.error("\n[ABORTING] Quota exceeded. Preserving existing data for the rest of the providers.");
                    break; // stop the loop
                }
                console.error(`  Error processing ${p.name}:`, err);
            }
            // Delay for stability
            await new Promise(resolve => setTimeout(resolve, 5000));
        }

        console.log(`Update process finished. Current state of ${OUTPUT_FILE} contains ${providersMap.size} providers.`);
    } catch (globalErr) {
        console.error("Global Error in main:", globalErr);
    }
}

main();
