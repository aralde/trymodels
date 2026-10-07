
import { NextResponse } from 'next/server';
import { generateText, generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import * as fs from 'fs';
import * as path from 'path';

// ─── Retry helper for LLM text calls ─────────────────────────────────────────

async function retryGenerateText(
    prompt: string,
    maxAttempts = 3,
    delayMs = 15000
): Promise<string> {
    let lastError: unknown;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            const { text } = await generateText({
                model: google('gemini-2.5-flash-lite'),
                prompt,
            });
            return text;
        } catch (err) {
            lastError = err;
            console.warn(`[Cron] generateText attempt ${attempt}/${maxAttempts} failed:`, err);
            if (attempt < maxAttempts) {
                await new Promise(res => setTimeout(res, delayMs * attempt));
            }
        }
    }
    throw new Error(`Failed after ${maxAttempts} attempts. Last error: ${lastError}`);
}

// ─── Provider Configuration ───────────────────────────────────────────────────

interface ProviderConfig {
    name: string;
    url: string;
    id: string;
}

const PROVIDERS_CONFIG: ProviderConfig[] = [
    { name: "Groq", url: "https://console.groq.com/docs/rate-limits", id: "groq" },
    { name: "Google AI Studio", url: "https://ai.google.dev/pricing", id: "google-ai-studio" },
    { name: "Cerebras", url: "https://cerebras.ai/pricing", id: "cerebras" },
    { name: "OpenRouter", url: "https://openrouter.ai/docs/limits", id: "openrouter" },
    { name: "Mistral AI", url: "https://mistral.ai/technology/#pricing", id: "mistral-ai" },
];

// ─── Prompt Template ──────────────────────────────────────────────────────────

function loadPromptTemplate(): string {
    try {
        const templatePath = path.join(process.cwd(), 'src', 'app', 'api', 'cron', 'update-providers', 'prompt-template.md');
        return fs.readFileSync(templatePath, 'utf-8');
    } catch {
        // Fallback inline template
        return `You are an expert at extracting API Rate Limits from technical documentation.

Extract the Free Tier limits for EACH provider listed below.
Return a JSON array. Each entry: { name, models: [{ model_id, limits: { RPM, RPD, TPM, TPD } }], notes, context_window, link_url }.
limits values must be numbers or "". Convert abbreviations: 1K=1000, 500K=500000, 14.4K=14400, etc.
Return ONLY valid JSON, no markdown fences.

Context (scraped documentation):
`;
    }
}

// ─── Helper: Fetch via Jina ───────────────────────────────────────────────────

async function fetchWithJina(url: string): Promise<string> {
    const jinaUrl = `https://r.jina.ai/${url}`;
    try {
        console.log(`[Cron] Fetching ${jinaUrl}...`);
        const response = await fetch(jinaUrl, { signal: AbortSignal.timeout(30_000) });
        if (!response.ok) {
            console.error(`[Cron] Failed to fetch ${jinaUrl}: ${response.statusText}`);
            return '';
        }
        return await response.text();
    } catch (error) {
        console.error(`[Cron] Error fetching ${jinaUrl}:`, error);
        return '';
    }
}

function stripUrls(content: string): string {
    // Strip markdown image syntax: [![alt](img_url)](link_url) and ![alt](url)
    content = content.replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1');
    // Strip markdown link syntax: [text](url)
    content = content.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');
    // Strip absolute URLs (http:// or https://)
    content = content.replace(/https?:\/\/\S+/g, '');
    // Strip bare domain links like console.groq.com/docs/...
    content = content.replace(/\b[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\/\S*/g, '');
    return content;
}

// ─── Deterministic limit normalizer (code-level backstop) ────────────────────
// Converts any value to integer or '' — runs after LLM to guarantee clean output.

function normalizeLimitValue(val: unknown): number | '' {
    if (val === null || val === undefined || val === '') return '';
    if (typeof val === 'number') {
        // 0 is never a valid rate limit — treat as unavailable
        if (!Number.isFinite(val) || val === 0) return '';
        return Math.round(val);
    }

    const s = String(val).trim();
    if (!s || s === 'N/A' || s === 'n/a') return '';

    // "Up to 500 (anything)" or "up to 500" → 500
    const upToMatch = s.match(/^up\s+to\s+([\d.,]+)\s*([KkMm]?)/i);
    if (upToMatch) {
        return parseAbbrev(upToMatch[1], upToMatch[2]);
    }

    // Pure number with optional K/M suffix: "1K", "14.4K", "500K", "1M", "30"
    const abbrevMatch = s.match(/^([\d.,]+)\s*([KkMm]?)$/);
    if (abbrevMatch) {
        return parseAbbrev(abbrevMatch[1], abbrevMatch[2]);
    }

    // Anything else (text descriptions, ranges, etc.) → ''
    return '';
}

function parseAbbrev(numStr: string, suffix: string): number | '' {
    const n = parseFloat(numStr.replace(/,/g, ''));
    if (!Number.isFinite(n)) return '';
    const multiplier = /k/i.test(suffix) ? 1000 : /m/i.test(suffix) ? 1_000_000 : 1;
    return Math.round(n * multiplier);
}


// ─── Helper: Fetch OpenRouter :free models ────────────────────────────────────

type LimitValue = number | '';

interface CronModel {
    model_id: string;
    limits: { RPM: LimitValue; RPD: LimitValue; TPM: LimitValue; TPD: LimitValue };
    context_window?: string;
    notes?: string;
}

interface CronProvider {
    id?: string;
    name: string;
    models: CronModel[];
    notes?: string;
    context_window?: string;
    link_url?: string;
}

// Hardcoded fallback limits for Google models (as of Feb 2026)
// These are not in the public docs but are known free tier baselines.
const GOOGLE_LIMITS_FALLBACK: Record<'PRO' | 'FLASH', CronModel['limits'] & { contextQuery: string }> = {
    PRO: { RPM: 2, RPD: 50, TPM: 32000, TPD: '', contextQuery: '1,000,000' },
    FLASH: { RPM: 15, RPD: 1500, TPM: 1000000, TPD: '', contextQuery: '1,000,000' },
};

function enrichGoogleLimits(models: CronModel[]): CronModel[] {
    return models.map((m) => {
        // If limits are already populated, keep them
        if (m.limits.RPM !== '' && m.limits.RPD !== '') return m;

        const id = m.model_id.toLowerCase();
        let fallback = null;

        if (id.includes('flash')) {
            fallback = GOOGLE_LIMITS_FALLBACK.FLASH;
        } else if (id.includes('pro')) {
            fallback = GOOGLE_LIMITS_FALLBACK.PRO;
        }

        if (fallback) {
            // Only overwrite if currently empty
            return {
                ...m,
                limits: {
                    RPM: m.limits.RPM === '' ? fallback.RPM : m.limits.RPM,
                    RPD: m.limits.RPD === '' ? fallback.RPD : m.limits.RPD,
                    TPM: m.limits.TPM === '' ? fallback.TPM : m.limits.TPM,
                    TPD: m.limits.TPD === '' ? fallback.TPD : m.limits.TPD,
                },
                // Add context window if missing
                context_window: (!m.context_window || m.context_window === 'N/A') ? fallback.contextQuery : m.context_window,
                notes: (m.notes || '') + ' (Limits estimated from Free Tier baselines)',
            };
        }
        return m;
    });
}

interface OpenRouterModel {
    id: string;
    name?: string;
    context_length?: number;
    [key: string]: unknown;
}

async function fetchOpenRouterFreeModels(): Promise<CronModel[]> {
    try {
        console.log('[Cron] Fetching OpenRouter free models from API...');
        const response = await fetch('https://openrouter.ai/api/v1/models', {
            headers: { 'Accept': 'application/json' },
            signal: AbortSignal.timeout(30_000),
        });
        if (!response.ok) {
            console.error(`[Cron] OpenRouter API error: ${response.statusText}`);
            return [];
        }
        const data = await response.json() as { data: OpenRouterModel[] };
        const freeModels = (data.data || []).filter((m) => m.id.endsWith(':free'));
        console.log(`[Cron] Found ${freeModels.length} OpenRouter :free models.`);
        return freeModels.map((m) => ({
            model_id: m.id,
            limits: { RPM: 20, RPD: '', TPM: '', TPD: '' },
        }));
    } catch (error) {
        console.error('[Cron] Error fetching OpenRouter models:', error);
        return [];
    }
}

// ─── Main GET Handler ─────────────────────────────────────────────────────────

export async function GET(request: Request) {
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
        // ── Step 1: Fetch existing file SHA from GitHub ──────────────────────
        let fileSha: string | undefined;
        console.log('[Cron] Fetching existing providers.json SHA from GitHub...');
        const fileResponse = await fetch(
            `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
            { headers: { Authorization: `Bearer ${GITHUB_TOKEN}` } }
        );
        if (fileResponse.ok) {
            const fileData = await fileResponse.json();
            fileSha = fileData.sha;
        } else if (fileResponse.status !== 404) {
            throw new Error(`Failed to fetch file from GitHub: ${fileResponse.statusText}`);
        }

        // ── Step 2: Scrape all provider URLs in parallel ─────────────────────
        console.log('[Cron] Scraping all provider URLs in parallel...');
        const scrapedResults = await Promise.all(
            PROVIDERS_CONFIG.map(async (config) => {
                let content = await fetchWithJina(config.url);
                if (!content || content.length < 100) {
                    console.warn(`[Cron] Warning: empty content for ${config.name}`);
                    content = '(no content available)';
                }
                content = stripUrls(content);
                // Truncate per-provider to avoid exceeding context limits
                content = content//.slice(0, 40_000);
                return { config, content };
            })
        );

        // ── Step 3: Build combined context ───────────────────────────────────
        const combinedContext = scrapedResults
            .map(({ config, content }) =>
                `<PROVIDER name="${config.name}" url="${config.url}">\n${content}\n</PROVIDER>`
            )
            .join('\n\n');

        // ── Step 4: LLM Call 1 — Extract raw provider data ───────────────────
        const promptTemplate = loadPromptTemplate();
        const extractionPrompt = `${promptTemplate}\n\n${combinedContext}`;

        console.log('[Cron] LLM Call 1: Extracting provider data...');
        const rawExtraction = await retryGenerateText(extractionPrompt);

        // ── Step 5: LLM Call 2 — Normalize limits to numeric only ────────────
        const normalizationPrompt = `You are a strict JSON data normalizer.

Given the following JSON array of provider data, process EVERY "limits" object in EVERY model entry:

RULES (apply in order):
1. Keep only these 4 keys in each "limits" object: RPM, RPD, TPM, TPD. Remove any other keys (e.g. "context_window", "Grounding with Google Maps RPD", "notes", etc.).
2. For each of RPM, RPD, TPM, TPD:
   a. If the value is already a plain positive integer → keep it as-is.
   b. If the value is a string like "1K", "500K", "14.4K" → convert to integer (1000, 500000, 14400, etc.).
   c. If the value matches "Up to N" or "Up to N (anything)" → extract N and convert to integer. Example: "Up to 500 (shared with Flash-Lite RPD for Google Search grounding)" → 500.
   d. If the value is missing, null, 0, "", "N/A", "Generous", "Unlimited", "Not available", or any other non-numeric text → use null.
3. Do NOT change any other fields (name, model_id, notes, context_window, link_url, etc.).
4. Every "limits" object must have exactly these 4 keys: RPM, RPD, TPM, TPD — no more, no less.
5. Return ONLY valid JSON array, no markdown fences, no explanation.

Conversion table: 1K=1000, 1.2K=1200, 2K=2000, 3.6K=3600, 6K=6000, 7.2K=7200, 8K=8000, 10K=10000, 12K=12000, 14.4K=14400, 15K=15000, 28.8K=28800, 30K=30000, 50K=50000, 70K=70000, 100K=100000, 200K=200000, 300K=300000, 500K=500000, 1M=1000000.

Input data:
${rawExtraction}`;

        // ── Step 6: generateObject (Call 2) — structured output, guaranteed valid JSON ──
        // Gemini API doesn't support z.literal('') in schemas (empty enum not allowed).
        // Use nullable integers instead; post-process null → '' after parsing.
        const LimitValue = z.number().int().nullable();
        const ProviderSchema = z.object({
            name: z.string(),
            models: z.array(z.object({
                model_id: z.string(),
                limits: z.object({
                    RPM: LimitValue,
                    RPD: LimitValue,
                    TPM: LimitValue,
                    TPD: LimitValue,
                }),
            })),
            notes: z.string().optional(),
            context_window: z.string().optional(),
            link_url: z.string().optional(),
        });

        console.log('[Cron] LLM Call 2: Normalizing limits (structured output)...');
        const { object: normalized } = await generateObject({
            model: google('gemini-2.5-flash-lite'),
            schema: z.object({ providers: z.array(ProviderSchema) }),
            prompt: normalizationPrompt,
        });

        // Apply deterministic normalization as guaranteed backstop:
        // handles null (from schema coercion), '3.6K', 'Up to 500 (shared...)', 'N/A', etc.
        const providers: CronProvider[] = normalized.providers.map((p) => ({
            ...p,
            models: p.models.map((m) => ({
                ...m,
                limits: {
                    RPM: normalizeLimitValue(m.limits.RPM),
                    RPD: normalizeLimitValue(m.limits.RPD),
                    TPM: normalizeLimitValue(m.limits.TPM),
                    TPD: normalizeLimitValue(m.limits.TPD),
                },
            })),
        }));

        // ── Step 6.5: Enrich Google AI Studio limits (fallback for missing docs) ──
        const googleIndex = providers.findIndex(
            (p) => p.name?.toLowerCase().includes('google') || p.id === 'google-ai-studio'
        );
        if (googleIndex !== -1) {
            console.log('[Cron] Enriching Google AI Studio models with known free tier limits...');
            providers[googleIndex].models = enrichGoogleLimits(providers[googleIndex].models);
        }

        // ── Step 7: Enrich OpenRouter with live :free models ─────────────────
        const openRouterFreeModels = await fetchOpenRouterFreeModels();
        if (openRouterFreeModels.length > 0) {
            const orIndex = providers.findIndex(
                (p) => p.name?.toLowerCase().includes('openrouter') || p.id === 'openrouter'
            );
            if (orIndex !== -1) {
                console.log(`[Cron] Replacing OpenRouter models with ${openRouterFreeModels.length} :free models from API.`);
                providers[orIndex].models = openRouterFreeModels;
                providers[orIndex].notes = `Free tier: ${openRouterFreeModels.length} models available with :free suffix. RPM: 20. RPD varies by credits.`;
            } else {
                // Push a new OpenRouter entry if not found
                providers.push({
                    name: 'OpenRouter',
                    models: openRouterFreeModels,
                    notes: `Free tier: ${openRouterFreeModels.length} models available with :free suffix. RPM: 20. RPD varies by credits.`,
                    context_window: 'N/A (Varies by model)',
                    link_url: 'https://openrouter.ai/',
                });
            }
        }

        // ── Step 8: Save to GitHub ────────────────────────────────────────────
        const newContent = JSON.stringify(providers, null, 2);
        const newContentBase64 = Buffer.from(newContent).toString('base64');

        // In dev mode, also write locally for immediate verification
        if (process.env.NODE_ENV !== 'production') {
            const localPath = path.join(process.cwd(), 'src', 'data', 'providers.json');
            fs.writeFileSync(localPath, newContent, 'utf-8');
            console.log('[Cron] Dev mode: wrote providers.json locally.');
        }

        console.log(`[Cron] Saving ${providers.length} providers to GitHub...`);
        const updateResponse = await fetch(
            `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
            {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${GITHUB_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: 'chore: update providers.json via cron (Jina+Gemini)',
                    content: newContentBase64,
                    sha: fileSha,
                    branch: 'master',
                }),
            }
        );

        if (!updateResponse.ok) {
            const errText = await updateResponse.text();
            throw new Error(`Failed to update GitHub file: ${updateResponse.status} ${errText}`);
        }

        return NextResponse.json({
            success: true,
            message: `Successfully updated ${providers.length} providers.`,
            providers: providers.length,
            openRouterFreeModels: openRouterFreeModels.length,
        });

    } catch (error) {
        console.error('[Cron] Error:', error);
        const message = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
}
