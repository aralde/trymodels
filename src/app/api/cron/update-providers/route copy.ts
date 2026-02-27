
import { NextResponse } from 'next/server';
import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
import { exit } from 'process';

// Interfaces for internal logic (aligning with script)
interface ProviderConfig {
    name: string;
    url: string;
    id: string;
}

const PROVIDERS_CONFIG: ProviderConfig[] = [
    {
        name: "Groq",
        url: "https://console.groq.com/docs/rate-limits",
        id: "groq"
    },
    {
        name: "Google AI Studio",
        url: "https://ai.google.dev/pricing",
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

// Zod Schemas for LLM Extraction
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

// Helper Functions
async function fetchWithJina(url: string): Promise<string> {
    const jinaUrl = `https://r.jina.ai/${url}`;
    try {
        console.log(`[Cron] Fetching ${jinaUrl}...`);
        const response = await fetch(jinaUrl);
        if (!response.ok) {
            console.error(`[Cron] Failed to fetch ${jinaUrl}: ${response.statusText}`);
            return "";
        }
        return await response.text();
    } catch (error) {
        console.error(`[Cron] Error fetching ${jinaUrl}:`, error);
        return "";
    }
}

async function processProvider(config: ProviderConfig) {
    console.log(`[Cron] Processing ${config.name}...`);

    // 1. Scrape
    let scrapedContent = await fetchWithJina(config.url);
    if (!scrapedContent || scrapedContent.length < 100) {
        console.warn(`[Cron] Warning: Scraped content for ${config.name} seems empty. Skipping.`);
        return null;
    }

    // Strip markdown image syntax: [![alt](img_url)](link_url) and ![alt](url)
    scrapedContent = scrapedContent.replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1');
    // Strip markdown link syntax: [text](url)
    scrapedContent = scrapedContent.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');
    // Strip absolute URLs (http:// or https://)
    scrapedContent = scrapedContent.replace(/https?:\/\/\S+/g, '');
    // Strip bare domain links like console.groq.com/docs/... or le.groq.com/path
    scrapedContent = scrapedContent.replace(/\b[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\/\S*/g, '');

    // 2. Extract with LLM
    try {

        const prompt = `
You are an expert at extracting API Rate Limits from technical documentation.

Task:
Extract the **Free Tier** limits for this provider.
Focus on finding:
- Model Names / IDs
- RPM (Requests per Minute)
- RPD (Requests per Day)
- TPM (Tokens per Minute)
- TPD (Tokens per Day)

If specific models have specific limits, list them.
If there is a global free tier limit applying to all models, list "All Models" or the specific model names if stated.

For OpenRouter, focus on the "Free" models section/limits.
For Google AI Studio, look for "Free of charge" limits.

Context (Markdown from Jina):
<START_OF_CONTEXT>
Docs URL: ${config.url}
Provider: ${config.name}

${scrapedContent}

<END_OF_CONTEXT>
            `

        const fs = require('fs');
        fs.writeFileSync(`./scripts/data/prompt.md`, prompt, { encoding: 'utf-8', flag: 'a' });
        // exit(1)
        return ''
        const { object } = await generateObject({
            model: google('gemini-2.5-flash-lite'),
            schema: ExtractedProviderSchema,
            prompt: `
            You are an expert at extracting API Rate Limits from technical documentation.
            
            Docs URL: ${config.url}
            Provider: ${config.name}
            
            Task:
            Extract the **Free Tier** limits for this provider.
            Focus on finding:
            - Model Names / IDs
            - RPM (Requests per Minute)
            - RPD (Requests per Day)
            - TPM (Tokens per Minute)
            - TPD (Tokens per Day)
            
            If specific models have specific limits, list them.
            If there is a global free tier limit applying to all models, list "All Models" or the specific model names if stated.
            
            For OpenRouter, focus on the "Free" models section/limits.
            For Google AI Studio, look for "Free of charge" limits.
            
            Context (Markdown from Jina):
            ${scrapedContent.slice(0, 50000)}
            `
        });

        return object;

    } catch (error) {
        console.error(`[Cron] LLM Extraction failed for ${config.name}:`, error);
        return null;
    }
}

export async function GET(request: Request) {
    // Check for cron header verification
    const authHeader = request.headers.get('authorization');
    if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', { status: 401 });
    }

    const { GITHUB_TOKEN } = process.env;
    const REPO_OWNER = 'arieldeibe';
    const REPO_NAME = 'free-llm-curate-list';
    const FILE_PATH = 'src/data/providers.json';

    if (!GITHUB_TOKEN) {
        return NextResponse.json({ success: false, error: 'GITHUB_TOKEN not configured' }, { status: 500 });
    }

    try {
        // 1. Fetch current file from GitHub
        let existingProviders: any[] = [];
        let fileSha: string | undefined;

        console.log('[Cron] Fetching existing providers.json from GitHub...');
        const fileResponse = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
            headers: { Authorization: `Bearer ${GITHUB_TOKEN}` }
        });

        if (fileResponse.ok) {
            const fileData = await fileResponse.json();
            fileSha = fileData.sha;
            const content = Buffer.from(fileData.content, 'base64').toString('utf-8');
            try {
                existingProviders = JSON.parse(content);
            } catch (e) {
                console.warn('[Cron] Failed to parse existing JSON, starting fresh.');
            }
        } else if (fileResponse.status === 404) {
            console.log('[Cron] providers.json not found, creating new.');
        } else {
            throw new Error(`Failed to fetch file from GitHub: ${fileResponse.statusText}`);
        }

        // 2. Iterate and Scrape
        let updatesCount = 0;

        const fs = require('fs');
        fs.writeFileSync(`./scripts/data/prompt.md`, "", { encoding: 'utf-8' });

        // We modify existingProviders in place or push new
        for (const config of PROVIDERS_CONFIG) {
            const result = await processProvider(config);
            // if (result) {
            //     const index = existingProviders.findIndex((p: any) =>
            //         p.id === config.id || p.name.toLowerCase() === config.name.toLowerCase()
            //     );

            //     const newEntry = {
            //         id: config.id,
            //         name: config.name,
            //         url: config.url,
            //         type: "Free",
            //         notes: result.summary_limits,
            //         limits: result.summary_limits,
            //         models: result.models.map(m => ({
            //             model_id: m.model_id,
            //             limits: m.limits
            //         })),
            //         lastUpdated: new Date().toISOString()
            //     };

            //     if (index !== -1) {
            //         existingProviders[index] = { ...existingProviders[index], ...newEntry };
            //     } else {
            //         existingProviders.push(newEntry);
            //     }
            //     updatesCount++;
            // }
        }
        exit(1)

        if (updatesCount === 0) {
            return NextResponse.json({ success: true, message: 'No updates found or all extractions failed.' });
        }

        // 3. Save back to GitHub
        console.log(`[Cron] Updating GitHub with ${updatesCount} updated providers...`);
        const newContent = JSON.stringify(existingProviders, null, 2);
        const newContentBase64 = Buffer.from(newContent).toString('base64');

        const updateResponse = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${GITHUB_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: 'chore: update providers.json via cron (Jina+Gemini)',
                content: newContentBase64,
                sha: fileSha,
                branch: 'master'
            }),
        });

        if (!updateResponse.ok) {
            const errText = await updateResponse.text();
            throw new Error(`Failed to update GitHub file: ${updateResponse.status} ${errText}`);
        }

        return NextResponse.json({
            success: true,
            message: `Successfully updated ${updatesCount} providers.`,
            updated: updatesCount
        });

    } catch (error: any) {
        console.error('[Cron] Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
