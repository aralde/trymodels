import fs from 'fs';
import path from 'path';

// Define the interface here as well to avoid import issues in script execution context if ts-node is not set up smoothly for mixed imports
interface Provider {
    id: string;
    name: string;
    url: string;
    type: "Free" | "Trial";
    limits: string;
    // Granular limits parsed from text
    tpm?: number; // Tokens per minute
    rpm?: number; // Requests per minute
    rpd?: number; // Requests per day
    models: string[];
}

const README_URL = 'https://raw.githubusercontent.com/cheahjs/free-llm-api-resources/main/README.md';

async function fetchReadme(): Promise<string> {
    const response = await fetch(README_URL);
    if (!response.ok) {
        throw new Error(`Failed to fetch README: ${response.statusText}`);
    }
    return response.text();
}

function parseProviders(markdown: string): Provider[] {
    const providers: Provider[] = [];
    const lines = markdown.split('\n');

    let currentProvider: Partial<Provider> | null = null;
    let currentSection: 'Free' | 'Trial' | null = null;
    let isCollectingModels = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Section detection
        if (line.includes('## Free Providers')) {
            currentSection = 'Free';
            continue;
        } else if (line.includes('## Providers with trial credits')) {
            currentSection = 'Trial';
            continue;
        }

        // Provider Header: ### [Name](Url)
        const providerMatch = line.match(/^### \[(.+?)\]\((.+?)\)/);
        if (providerMatch) {
            if (currentProvider) {
                providers.push(currentProvider as Provider);
            }
            currentProvider = {
                id: providerMatch[1].toLowerCase().replace(/\s+/g, '-'),
                name: providerMatch[1],
                url: providerMatch[2],
                type: currentSection || 'Free', // Default to Free if section not found
                limits: '',
                models: []
            };
            isCollectingModels = false;
            continue;
        }

        if (!currentProvider) continue;

        // Limits detection
        // Usually defined as **Limits:** ... or inside a table
        if (line.toLowerCase().includes('**limits')) {
            // Extract text after Limits: or from next lines if empty
            let limitText = line.replace(/\*\*Limits.*?\*\*[:\s]*/i, '').trim();
            if (!limitText && lines[i + 2]) {
                // Check if next line is a link or text
                limitText = lines[i + 2].trim();
            }
            if (limitText) {
                // Clean up Markdown links in limits
                limitText = limitText.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
                currentProvider.limits = (currentProvider.limits || "") + " " + limitText;
            }
        }

        // Table detection for limits (e.g. Google AI Studio)
        if (line.includes('<table>')) {
            // Simple extraction: just say "See table in description" or try to parse generic info
            // For now, let's mark it as structured data available
            if (!currentProvider.limits) {
                currentProvider.limits = "Complex limits (see table)";
            }
        }

        // Table detection with rows (e.g. for extracting limits from table cells)
        if (line.includes('<tr><td>')) {
            // Extract all cell content
            const cells = line.match(/<td>(.*?)<\/td>/g);
            if (cells && cells.length >= 2) {
                const limitCol = cells[1].replace(/<\/?td>/g, '').replace(/<br>/g, ' ');
                // Append to limits for parsing and display if it looks like limit info
                if (limitCol.match(/tokens?\/|requests?\//)) {
                    currentProvider.limits = (currentProvider.limits || "") + " " + limitCol;
                }
            }
        }

        // Models detection
        // Usually a list - [Model Name](Link) or - Model Name
        if (line.match(/^- \[.+\]/)) {
            const modelMatch = line.match(/^- \[(.+?)\]/);
            if (modelMatch) {
                currentProvider.models?.push(modelMatch[1]);
            }
        } else if (line.match(/^- .+/)) {
            // Check if it is a model list item
            // Some providers have "Models:" header
            if (line.startsWith('- ')) {
                const modelName = line.substring(2).trim();
                // Avoid adding "Various open models" as a specific model if we can
                currentProvider.models?.push(modelName);
            }
        }

        // HTML table row parsing for models (e.g. Groq) where first col is Model Name
        if (line.includes('<tr><td>')) {
            const rowMatch = line.match(/<tr><td>(.*?)<\/td><td>(.*?)<\/td><\/tr>/);
            if (rowMatch) {
                let modelName = rowMatch[1].replace(/<[^>]*>/g, ''); // strip html tags
                if (modelName !== 'Model Name') { // Skip header
                    currentProvider.models?.push(modelName);
                }
            }
        }
    }

    // Push the last one
    if (currentProvider) {
        providers.push(currentProvider as Provider);
    }

    // Parse structured limits (TPM/RPM/RPD)
    for (const p of providers) {
        if (!p.limits) continue;

        const text = p.limits;
        const findMax = (regex: RegExp): number | undefined => {
            let maxVal = -1;
            let match;
            const globalRegex = new RegExp(regex.source, 'gi');
            while ((match = globalRegex.exec(text)) !== null) {
                const val = parseInt(match[1].replace(/,/g, ''), 10);
                if (val > maxVal) maxVal = val;
            }
            return maxVal > -1 ? maxVal : undefined;
        };

        p.tpm = findMax(/([\d,]+)\s*tokens?\/minute/);
        p.rpm = findMax(/([\d,]+)\s*requests?\/minute/);
        p.rpd = findMax(/([\d,]+)\s*requests?\/day/);
    }

    return providers;
}

async function main() {
    try {
        const markdown = await fetchReadme();
        const providers = parseProviders(markdown);

        // Ensure dir exists
        const dataDir = path.join(process.cwd(), 'src', 'data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        const outputPath = path.join(dataDir, 'providers.json');
        fs.writeFileSync(outputPath, JSON.stringify(providers, null, 2));
        console.log(`Successfully scraped ${providers.length} providers to ${outputPath}`);
    } catch (error) {
        console.error('Error updating data:', error);
        process.exit(1);
    }
}

main();
