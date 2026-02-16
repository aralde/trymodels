
# Free Models Contracts & Limits

This document tracks the official free tier limits, rate limits, and contract details for various AI model providers.

| Provider | Free Tier / Trial Details | Rate Limits (Free/Trial) | Official Documentation |
| :--- | :--- | :--- | :--- |
| **GitHub Models** | Prototyping access to various models (GPT-4o, Claude 3.5, etc.) via GitHub Marketplace. Copilot Free: 2k completions/mo. | Rate limits vary by model and user tier. Copilot Free: 2000 completions/month, 50 premium requests/month. | [GitHub Models Docs](https://docs.github.com/en/github-models/prototyping-with-ai-models#rate-limits) |
| **Cloudflare Workers AI** | Free daily allocation for serverless inference. Resets daily. | **Text Gen:** 10k tokens/day<br>**Embeddings:** 10k tokens/day<br>**Image Gen:** 250 steps/day<br>**Speech:** 10 min/day | [Cloudflare Pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/#limits) |
| **Google Vertex AI** | $300 free credits for new customers (90 days). Vertex AI Search: 10k queries/mo free. | No perpetual free tier for Gemini API on Vertex (use AI Studio for that). Limits depend on quota approval. | [Vertex AI Pricing](https://cloud.google.com/vertex-ai/pricing) |
| **Cohere** | Trial key for development/testing. | **Chat:** 20 RPM<br>**Embed:** 5-100 RPM<br>**Total Cap:** 1,000 calls/month | [Cohere Trial Limits](https://docs.cohere.com/docs/rate-limits) |
| **Groq** | Free tier for supported models (Llama 3, Mixtral, etc.). | **Llama Models:** ~30 RPM, 14.4k RPD<br>**Mixtral/Other:** ~30 RPM, 1k-2k RPD<br>Hard limits, returns 429. | [Groq Rate Limits](https://console.groq.com/docs/rate-limits) |
| **Cerebras** | Free tier for high-speed inference. | **Inference:** 30 RPM, 60k TPM<br>**Daily Cap:** 1M tokens/day | [Cerebras Pricing](https://cerebras.ai/pricing) |
| **Vercel AI SDK** | SDK is free. Vercel Hobby tier hosting limits apply. | **Edge Requests:** 1M/mo (Hobby)<br>**Duration:** 10s-60s limits<br>**AI Gateway:** $5/mo credit | [Vercel Limits](https://vercel.com/docs/limits/usage) |
| **Hugging Face** | Serverless Inference API (Free Tier). | **Unauthenticated:** ~10 requests/hr<br>**Authenticated (Free):** ~1k requests/day (variable)<br>Rate limits are dynamic. | [HF Inference Docs](https://huggingface.co/docs/api-inference/index#rate-limits) |
| **Mistral AI** | "La Plateforme" Free Tier & Le Chat. | **Le Chat:** ~20-25 msg/day<br>**API:** Requires strict limits, typically ~1 RPS for experimentation. | [Mistral Pricing](https://mistral.ai/technology/#pricing) |
| **Google AI Studio** | Generous free tier for Gemini models (Flash, Pro). | **Gemini 2.0 Flash:** 15 RPM, 1M TPM, 1,500 RPD<br>**Gemini 1.5 Pro:** 2 RPM, 32k TPM, 50 RPD | [Gemini API Pricing](https://ai.google.dev/pricing) |
| **Nvidia NIM** | 1,000 free credits (90 days). | **Inference:** ~40 requests/min (Trial) | [Nvidia NIM](https://build.nvidia.com/explore) |
| **OpenRouter** | "Free" models category. | **Free Models:** 20 RPM<br>**Daily Cap:** 50 req/day (if balance <$10), 1k req/day (if balance >$10) | [OpenRouter Limits](https://openrouter.ai/docs/limits) |

> **Note:** Limits are subject to change by providers at any time. "RPM" = Requests Per Minute, "RPD" = Requests Per Day, "TPM" = Tokens Per Minute.
