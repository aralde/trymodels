
import { NextResponse } from 'next/server';
import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

// Define schemas for structured output
const ModelSchema = z.object({
    name: z.string(),
    rpm: z.number().optional().describe('Requests per minute limit'),
    rpd: z.number().optional().describe('Requests per day limit'),
    tpm: z.number().optional().describe('Tokens per minute limit'),
    tpd: z.number().optional().describe('Tokens per day limit'),
});

const ProviderSchema = z.object({
    name: z.string(),
    url: z.string(),
    limits: z.string().describe('Text description of the limits'),
    models: z.array(ModelSchema),
});

const ProvidersListSchema = z.object({
    providers: z.array(ProviderSchema),
});

// Helper to convert string to kebab-case id
function toId(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export async function GET(request: Request) {
    // Check for cron header verification
    const authHeader = request.headers.get('authorization');
    // Vercel sends `Bearer ${process.env.CRON_SECRET}` 
    // However, for local testing we might want to bypass or mock it.
    // In production, CRON_SECRET is automatically injected by Vercel.
    if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', { status: 401 });
    }

    try {
        // 1. Fetch README
        const readmeResponse = await fetch('https://raw.githubusercontent.com/cheahjs/free-llm-api-resources/main/README.md');
        if (!readmeResponse.ok) throw new Error('Failed to fetch README');
        const readmeText = await readmeResponse.text();

        console.log('Fetched README, length:', readmeText.length);

        // 2. Parse Markdown using Gemini LLM
        const { object } = await generateObject({
            model: google('gemini-2.5-flash-lite'), // Efficient model for text processing
            schema: ProvidersListSchema,
            prompt: `Extract all LLM providers and their models from the following README content. 
      For each provider, capture the name, website url, a brief description of the limits, and the list of models.
      If specific numeric limits (RPM, RPD, TPM, TPD) are mentioned for a model, extract them.
      
      README CONTENT:
      ${readmeText}`,
        });

        const newProviders = object.providers.map(p => ({
            ...p,
            id: toId(p.name),
            type: "Free"
        }));

        // 3. Update File via GitHub API
        const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
        const REPO_OWNER = 'arieldeibe';
        const REPO_NAME = 'free-llm-curate-list';
        const FILE_PATH = 'src/data/providers.json';

        if (!GITHUB_TOKEN) {
            console.warn('GITHUB_TOKEN not found. Skipping file update, returning parsed data.');
            return NextResponse.json({ success: true, parsed: newProviders, message: 'Dry run: No Token' });
        }

        // Fetch existing file to get SHA and content
        let existingProviders: any[] = [];
        let fileSha: string | undefined;

        const fileResponse = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
            headers: { Authorization: `Bearer ${GITHUB_TOKEN}` }
        });

        if (fileResponse.ok) {
            const fileData = await fileResponse.json();
            fileSha = fileData.sha;
            const existingContent = Buffer.from(fileData.content, 'base64').toString('utf-8');
            try {
                existingProviders = JSON.parse(existingContent);
                if (!Array.isArray(existingProviders)) existingProviders = [];
            } catch (e) {
                console.warn('Failed to parse existing providers.json, starting with empty array.');
                existingProviders = [];
            }
        } else if (fileResponse.status === 404) {
            console.log('providers.json not found, creating new file.');
            existingProviders = [];
        } else {
            throw new Error(`Failed to fetch existing file: ${fileResponse.statusText}`);
        }

        // Merge Logic
        // User requested Merge.
        // Let's iterate newProviders and merge into existingProviders list (or append)

        const mergedProviders = [...existingProviders];

        for (const newP of newProviders) {
            const existingIndex = mergedProviders.findIndex(p => p.id === newP.id);

            if (existingIndex >= 0) {
                // Update generic info
                const existing = mergedProviders[existingIndex];
                existing.url = newP.url; // URL might have changed
                existing.limits = newP.limits && newP.limits.length > 5 ? newP.limits : existing.limits;

                // Merge models
                // Existing models have stats (rpm etc). New models MIGHT have stats from LLM.
                // We want to update stats if new ones are found, otherwise keep existing.
                const mergedModels = [...existing.models];

                for (const newM of newP.models) {
                    const existingModelIndex = mergedModels.findIndex((m: any) => m.name === newM.name);
                    if (existingModelIndex === -1) {
                        // New model found! Add it.
                        mergedModels.push(newM);
                    } else {
                        // Update existing model with new stats if available
                        const existingM = mergedModels[existingModelIndex];
                        if (newM.rpm) existingM.rpm = newM.rpm;
                        if (newM.rpd) existingM.rpd = newM.rpd;
                        if (newM.tpm) existingM.tpm = newM.tpm;
                        if (newM.tpd) existingM.tpd = newM.tpd;
                        mergedModels[existingModelIndex] = existingM;
                    }
                }

                existing.models = mergedModels;
                mergedProviders[existingIndex] = existing;

            } else {
                // New provider! Add it.
                mergedProviders.push(newP);
            }
        }

        // Prepare content for update
        const newContent = JSON.stringify(mergedProviders, null, 2);
        const newContentBase64 = Buffer.from(newContent).toString('base64');

        // Update file
        const updateResponse = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${GITHUB_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: 'chore: update providers.json via cron (Gemini parsed)',
                content: newContentBase64,
                sha: fileSha, // Undefined if creating new file
                branch: 'master' // Target branch
            }),
        });

        if (!updateResponse.ok) {
            throw new Error(`Failed to update file: ${updateResponse.statusText}`);
        }

        return NextResponse.json({ success: true, message: 'Providers updated successfully' });

    } catch (error: any) {
        console.error('Error updating providers:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
