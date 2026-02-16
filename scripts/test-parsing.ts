import fs from 'fs';
import path from 'path';

// Mock Provider interface for testing
interface Provider {
    name: string;
    limits: string;
    tpm?: number;
    rpm?: number;
    rpd?: number;
}

function testParsing() {
    const readmePath = path.join(process.cwd(), 'README_source.md');
    const markdown = fs.readFileSync(readmePath, 'utf-8');

    const providers: Provider[] = [];
    const lines = markdown.split('\n');

    let currentProvider: Partial<Provider> | null = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Provider Header: ### [Name](Url)
        const providerMatch = line.match(/^### \[(.+?)\]\((.+?)\)/);
        if (providerMatch) {
            if (currentProvider) {
                providers.push(currentProvider as Provider);
            }
            currentProvider = {
                name: providerMatch[1],
                limits: '',
            };
            continue;
        }

        if (!currentProvider) continue;

        // Limits detection (Text based)
        // Example: **Limits:** ...
        // or just the next lines
        if (line.toLowerCase().includes('**limits')) {
            let limitText = line.replace(/\*\*Limits.*?\*\*[:\s]*/i, '').trim();
            if (!limitText && lines[i + 2]) limitText = lines[i + 2].trim();
            if (limitText) {
                currentProvider.limits = (currentProvider.limits || "") + " " + limitText;
            }
        }

        // Table detection (for limits inside tables)
        if (line.includes('<tr><td>')) {
            // Extract all cell content
            const cells = line.match(/<td>(.*?)<\/td>/g);
            if (cells && cells.length >= 2) {
                const limitCol = cells[1].replace(/<\/?td>/g, '').replace(/<br>/g, ' ');
                // Append to limits for parsing
                currentProvider.limits = (currentProvider.limits || "") + " " + limitCol;
            }
        }
    }
    if (currentProvider) providers.push(currentProvider as Provider);

    // Now process extracted limits for TPM/RPM/RPD
    console.log("--- Extraction Results ---");
    for (const p of providers) {
        const text = p.limits || "";

        // Helper to find MAX value in text
        const findMax = (regex: RegExp): number | undefined => {
            let maxVal = -1;
            let match;
            // Global search to find all occurrences
            const globalRegex = new RegExp(regex.source, 'gi');
            while ((match = globalRegex.exec(text)) !== null) {
                const val = parseInt(match[1].replace(/,/g, ''), 10);
                if (val > maxVal) maxVal = val;
            }
            return maxVal > -1 ? maxVal : undefined;
        };

        // TPM: tokens/minute
        p.tpm = findMax(/([\d,]+)\s*tokens?\/minute/);

        // RPM: requests/minute
        p.rpm = findMax(/([\d,]+)\s*requests?\/minute/);

        // RPD: requests/day
        p.rpd = findMax(/([\d,]+)\s*requests?\/day/);

        // Special case for "audio-seconds/minute" maybe? no user asked for tpm/rpm/rpd

        if (p.tpm || p.rpm || p.rpd) {
            console.log(`Provider: ${p.name}`);
            if (p.tpm) console.log(`  TPM: ${p.tpm}`);
            if (p.rpm) console.log(`  RPM: ${p.rpm}`);
            if (p.rpd) console.log(`  RPD: ${p.rpd}`);
            console.log("-");
        }
    }
}

testParsing();
