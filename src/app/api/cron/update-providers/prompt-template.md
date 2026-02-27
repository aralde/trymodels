You are an expert at extracting API Rate Limits from technical documentation.

Task:
Extract the **Free Tier** limits for EACH provider listed below.
Focus on finding:

- Model Names / IDs
- RPM (Requests per Minute)
- RPD (Requests per Day)
- TPM (Tokens per Minute)
- TPD (Tokens per Day)

If specific models have specific limits, list them individually.
If there is a global free tier limit applying to all models, use "All Models" as the model_id.

Special instructions:

- For OpenRouter: focus on the "Free" models section/limits. The model entry should be "All models ending in :free".
- For Google AI Studio: look for "Free of charge" limits. List each model separately. Only include RPM/RPD/TPM/TPD if you find an explicit integer for it — do NOT include grounding limits or search limits in these fields.
- For Groq: list each model row from the Free Plan table.
- For Cerebras: if no specific numbers are given, use empty string "" for limit values.
- For Mistral AI: focus on free tier / trial limits.

Return a JSON array with this exact shape:
[
  {
    "name": "<Provider Name>",
    "models": [
      {
        "model_id": "<model id or name>",
        "limits": {
          "RPM": <integer or "">,
          "RPD": <integer or "">,
          "TPM": <integer or "">,
          "TPD": <integer or "">
        }
      }
    ],
    "notes": "<short summary of free tier>",
    "context_window": "<e.g. 128k or N/A>",
    "link_url": "<docs URL used>"
  }
]

CRITICAL RULES for "limits" values:

- Values MUST be plain integers (e.g. 30, 1000, 500000) or empty string "".
- NEVER put text, descriptions, ranges, or explanations inside a limits value.
- Convert abbreviations to integers: 1K=1000, 500K=500000, 14.4K=14400, 200K=200000, 8K=8000, 70K=70000, 300K=300000, 100K=100000, 3.6K=3600, 1.2K=1200, 2K=2000, 7.2K=7200, 28.8K=28800, 6K=6000, 12K=12000, 30K=30000, 15K=15000, 10K=10000, 50K=50000, 1M=1000000.
- If a limit says "Up to 500 (shared with...)" → use 500.
- If a limit is not available, N/A, "Generous", "Unlimited", or any non-numeric text → use "".
- The "limits" object must contain ONLY the keys: RPM, RPD, TPM, TPD. No other keys.
- Return ONLY valid JSON, no markdown fences, no explanation.

Context (scraped documentation):
