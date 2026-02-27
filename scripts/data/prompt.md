
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
Docs URL: https://console.groq.com/docs/rate-limits
Provider: Groq

Title: Rate Limits - GroqDocs

URL Source: 

Markdown Content:
Rate Limits - GroqDocs
===============

Image 1: Groq

DocsLogin

Playground

API Keys

Dashboard

Docs



Log In

Documentation
-------------

DocsAPI Reference

Search

Docs
----

### Getting Started

OverviewQuickstartModelsOpenAI CompatibilityResponses APIRate LimitsTemplatesAPI Reference
### Core Features

Text GenerationSpeech to TextText to SpeechOrpheusOCR and Image RecognitionReasoningContent ModerationStructured OutputsPrompt Caching
### Tools & Integrations

Tool UseOverviewGroq Built-In ToolsWeb SearchVisit WebsiteBrowser AutomationCode ExecutionWolfram AlphaBrowser Search (GPT OSS Models)Remote Tools and MCPConnectorsLocal Tool CallingIntegrations CatalogCoding with GroqFactory DroidOpenCodeKilo CodeRoo CodeCline
### Compound (Agentic AI)

OverviewBuilt-In ToolsSystemsUse Cases
### Guides

Prompting GuideBasicsPatternsModel MigrationAssistant Message Prefilling
### Service Tiers

Service TiersPerformance TierFlex ProcessingBatch Processing
### Advanced

LoRA Inference
### Production Readiness

Production ChecklistOptimizing LatencySecurity OnboardingPrometheus Metrics
### Account and Console

Spend LimitsProjectsModel PermissionsBilling FAQsYour Data
### Developer Resources

SDK LibrariesGroq BadgeDeveloper CommunityOpenBenchError CodesChangelog
### Legal

Policies & Notices

Search

DocsAPI Reference

### Getting Started

Overview

Quickstart

Models

OpenAI Compatibility

Responses API

Rate Limits

Templates

API Reference

### Core Features

Text Generation

Speech to Text

Text to Speech

Orpheus

OCR and Image Recognition

Reasoning

Content Moderation

Structured Outputs

Prompt Caching

### Tools & Integrations

Tool Use

Overview

Groq Built-In Tools

Web Search

Visit Website

Browser Automation

Code Execution

Wolfram Alpha

Browser Search (GPT OSS Models)

Remote Tools and MCP

Connectors

Local Tool Calling

Integrations Catalog

Coding with Groq

Factory Droid

OpenCode

Kilo Code

Roo Code

Cline

### Compound (Agentic AI)

Overview

Built-In Tools

Systems

Use Cases

### Guides

Prompting Guide

Basics

Patterns

Model Migration

Assistant Message Prefilling

### Service Tiers

Service Tiers

Performance Tier

Flex Processing

Batch Processing

### Advanced

LoRA Inference

### Production Readiness

Production Checklist

Optimizing Latency

Security Onboarding

Prometheus Metrics

### Account and Console

Spend Limits

Projects

Model Permissions

Billing FAQs

Your Data

### Developer Resources

SDK Libraries

Groq Badge

Developer Community

OpenBench

Error Codes

Changelog

### Legal

Policies & Notices

Rate Limits
===========

Copy page

Rate limits act as control measures to regulate how frequently users and applications can access our API within specified timeframes. These limits help ensure service stability, fair access, and protection against misuse so that we can serve reliable and fast inference for all.

Understanding Rate Limits
------------------------------------------------------------------------------------------------

Rate limits are measured in:

*   **RPM:** Requests per minute
*   **RPD:** Requests per day
*   **TPM:** Tokens per minute
*   **TPD:** Tokens per day
*   **ASH:** Audio seconds per hour
*   **ASD:** Audio seconds per day

Cached tokens do not count towards your rate limits.

Rate limits apply at the organization level, not individual users. You can hit any limit type depending on which threshold you reach first.

**Example:** Let's say your RPM = 50 and your TPM = 200K. If you were to send 50 requests with only 100 tokens within a minute, you would reach your limit even though you did not send 200K tokens within those 50 requests.

Rate Limits
--------------------------------------------------------------------

The following is a high level summary and there may be exceptions to these limits. You can view the current, exact rate limits for your organization on the limits page in your account settings.

**Need higher rate limits?**Upgrade to Developer plan to access higher limits, Batch andFlex processing, and more. Note that the limits shown below are the base limits for the Developer plan, and higher limits are available for select workloads and enterprise use cases.

| * Free Plan Limits * Developer Plan Limits |  |
| --- | --- |
| MODEL ID | RPM | RPD | TPM | TPD | ASH | ASD |

allam-2-7b 30 7K 6K 500K--
canopylabs/orpheus-arabic-saudi 10 100 1.2K 3.6K--
canopylabs/orpheus-v1-english 10 100 1.2K 3.6K--
groq/compound 30 250 70K---
groq/compound-mini 30 250 70K---
llama-3.1-8b-instant 30 14.4K 6K 500K--
llama-3.3-70b-versatile 30 1K 12K 100K--
meta-llama/llama-4-maverick-17b-128e-instruct 30 1K 6K 500K--
meta-llama/llama-4-scout-17b-16e-instruct 30 1K 30K 500K--
meta-llama/llama-guard-4-12b 30 14.4K 15K 500K--
meta-llama/llama-prompt-guard-2-22m 30 14.4K 15K 500K--
meta-llama/llama-prompt-guard-2-86m 30 14.4K 15K 500K--
moonshotai/kimi-k2-instruct 60 1K 10K 300K--
moonshotai/kimi-k2-instruct-0905 60 1K 10K 300K--
openai/gpt-oss-120b 30 1K 8K 200K--
openai/gpt-oss-20b 30 1K 8K 200K--
openai/gpt-oss-safeguard-20b 30 1K 8K 200K--
qwen/qwen3-32b 60 1K 6K 500K--
whisper-large-v3 20 2K--7.2K 28.8K
whisper-large-v3-turbo 20 2K--7.2K 28.8K

Rate Limit Headers
----------------------------------------------------------------------------------

In addition to viewing your limits on your account's limits page, you can also view rate limit information such as remaining requests and tokens in HTTP response headers as follows:

The following headers are set (values are illustrative):

| Header | Value | Notes |
| --- | --- | --- |
| retry-after | 2 | In seconds |
| x-ratelimit-limit-requests | 14400 | Always refers to Requests Per Day (RPD) |
| x-ratelimit-limit-tokens | 18000 | Always refers to Tokens Per Minute (TPM) |
| x-ratelimit-remaining-requests | 14370 | Always refers to Requests Per Day (RPD) |
| x-ratelimit-remaining-tokens | 17997 | Always refers to Tokens Per Minute (TPM) |
| x-ratelimit-reset-requests | 2m59.56s | Always refers to Requests Per Day (RPD) |
| x-ratelimit-reset-tokens | 7.66s | Always refers to Tokens Per Minute (TPM) |

Handling Rate Limits
--------------------------------------------------------------------------------------

When you exceed rate limits, our API returns a `429 Too Many Requests` HTTP status code.

**Note**: `retry-after` is only set if you hit the rate limit and status code 429 is returned. The other headers are always included.

### Was this page helpful?

Yes No Suggest Edits

#### On this page

*    
*    
*


<END_OF_CONTEXT>
            
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
Docs URL: https://ai.google.dev/pricing
Provider: Google AI Studio

Title: Gemini Developer API pricing

URL Source: 

Published Time: Mon, 02 Feb 2026 16:48:23 GMT

Markdown Content:
Skip to main content

*   Gemini API
    *   Docs
    *   API reference

*   Get API key
*   Cookbook
*   Community

*   Get started

*   Overview
*   Quickstart
*   API keys
*   Libraries
*   Interactions API
*   Models

*   Gemini
*   Gemini 3
*   Nano Banana
*   Veo
*   Lyria
*   Imagen
*   Embeddings
*   Robotics
*   Text-to-speech
*   Pricing
*   Rate limits
*   Core capabilities

*   Text

*   Documents

*   Structured outputs
*   Function calling
*   Long context
*   Tools and agents

*   Overview
*   Deep Research
*   Google Search
*   Google Maps
*   Code execution
*   URL context
*   Computer Use
*   File Search
*   Live API

*   Get started
*   Capabilities
*   Tool use
*   Session management
*   Ephemeral tokens
*   Guides

*   Batch API

*   Context caching
*   OpenAI compatibility
*   Media resolution
*   Token counting
*   Prompt engineering

*   Resources

*   Migrate to Gen AI SDK
*   Release notes
*   Deprecations
*   API troubleshooting
*   Billing info
*   Partner and library integrations

*   Policies

*   Terms of service
*   Available regions
*   Abuse monitoring
*   Feedback information

*   On this page
*   Gemini 3 Pro Preview
*   Gemini 3 Flash Preview
*   Gemini 3 Pro Image Preview 🍌
*   Gemini 2.5 Pro
*   Gemini 2.5 Flash
*   Gemini 2.5 Flash Preview
*   Gemini 2.5 Flash-Lite
*   Gemini 2.5 Flash-Lite Preview
*   Gemini 2.5 Flash Native Audio (Live API)
*   Gemini 2.5 Flash Image 🍌
*   Gemini 2.5 Flash Preview TTS
*   Gemini 2.5 Pro Preview TTS
*   Gemini 2.0 Flash
*   Gemini 2.0 Flash-Lite
*   Imagen 4
*   Veo 3.1
*   Veo 3
*   Veo 2
*   Gemini Embedding
*   Gemini Robotics-ER 1.5 Preview
*   Gemini 2.5 Computer Use Preview
*   Gemma 3
*   Gemma 3n
*   Pricing for tools
*   Pricing for agents

Start building free of charge with generous limits, then scale up with pay-as-you-go pricing for your production ready applications.

### Free

For developers and small projects getting started with the Gemini API.

*   check_circle Limited access to certain models
*   check_circle Free input & output tokens
*   check_circle Google AI Studio access
*   check_circle Content used to improve our products*

Get started for Free

### Paid

For production applications that require higher volumes and advanced features.

*   check_circle Higher rate limits for production deployments
*   check_circle Access to Context caching
*   check_circle Batch API (50% cost reduction)
*   check_circle Access to Google's most advanced models
*   check_circle Content **not** used to improve our products*

Upgrade to Paid

### Enterprise

For large-scale deployments with custom needs for security, support, and compliance, powered by Vertex AI.

*   check_circle All features in Paid, plus optional access to:
*   check_circle Dedicated support channels
*   check_circle Advanced security & compliance
*   check_circle Provisioned throughput
*   check_circle Volume-based discounts (based on usage)
*   check_circle ML ops, model garden and more

Contact Sales

The best model in the world for multimodal understanding, and our most powerful agentic and vibe-coding model yet.

|  | Free Tier | Paid Tier, per 1M tokens in USD |
| --- | --- | --- |
| Input price | Not available | $2.00, prompts <= 200k tokens $4.00, prompts > 200k tokens |
| Output price (including thinking tokens) | Not available | $12.00, prompts <= 200k tokens $18.00, prompts > 200k |
| Context caching price | Not available | $0.20, prompts <= 200k tokens $0.40, prompts > 200k $4.50 / 1,000,000 tokens per hour (storage price) |
| Grounding with Google Search* | Not available | 5,000 prompts per month (free), then $14 / 1,000 search queries |
| Grounding with Google Maps | Not available | Not available |
| Used to improve our products | Yes | No |

|  | Free Tier | Paid Tier, per 1M tokens in USD |
| --- | --- | --- |
| Input price | Not available | $1.00, prompts <= 200k tokens $2.00, prompts > 200k tokens |
| Output price (including thinking tokens) | Not available | $6.00, prompts <= 200k tokens $9.00, prompts > 200k |
| Context caching price | Not available | $0.20, prompts <= 200k tokens $0.40, prompts > 200k $4.50 / 1,000,000 tokens per hour (storage price) |
| Grounding with Google Search* | Not available | 1,500 RPD (free), then $14 / 1,000 search queries |
| Grounding with Google Maps | Not available | Not available |
| Used to improve our products | Yes | No |

* A customer-submitted request to Gemini may result in one or more queries to Google Search. You will be charged for each individual search query performed.

Our most intelligent model built for speed, combining frontier intelligence with superior search and grounding.

|  | Free Tier | Paid Tier, per 1M tokens in USD |
| --- | --- | --- |
| Input price | Free of charge | $0.50 (text / image / video) $1.00 (audio) |
| Output price (including thinking tokens) | Free of charge | $3.00 |
| Context caching price | Free of charge | $0.05 (text / image / video) $0.10 (audio) $1.00 / 1,000,000 tokens per hour (storage price) |
| Grounding with Google Search* | Not available | 5,000 prompts per month (free), then $14 / 1,000 search queries |
| Grounding with Google Maps | Not available | Not available |
| Used to improve our products | Yes | No |

|  | Free Tier | Paid Tier, per 1M tokens in USD |
| --- | --- | --- |
| Input price | Not available | $0.25 (text / image / video) $0.50 (audio) |
| Output price (including thinking tokens) | Not available | $1.50 |
| Context caching price | Not available | _Same as Standard, Batch pricing not yet implemented_ $0.05 (text / image / video) $0.10 (audio) $1.00 / 1,000,000 tokens per hour (storage price) |
| Grounding with Google Search* | Not available | 1,500 RPD (free), then $14 / 1,000 search queries |
| Grounding with Google Maps | Not available | Not available |
| Used to improve our products | Yes | No |

* A customer-submitted request to Gemini may result in one or more queries to Google Search. You will be charged for each individual search query performed.

Our native image generation model, optimized for speed, flexibility, and contextual understanding. **Text input and output** is priced the same as Gemini 3 Pro.

Preview models may change before becoming stable and have more restrictive rate limits.

|  | Free Tier | Paid Tier, per 1M tokens in USD |
| --- | --- | --- |
| Input price | Not available | $2.00 (text/image), equivalent to $0.0011 per image* |
| Output price | Not available | $12.00 (text and thinking) $120.00 (images) equivalent to $0.134 per 1K/2K image** and $0.24 per 4K image** |
| Used to improve our products | Yes | No |

|  | Free Tier | Paid Tier, per 1M tokens in USD |
| --- | --- | --- |
| Input price | Not available | $1.00 (text), $0.0006 (image)* |
| Output price | Not available | $6.00 (text and thinking) $0.067 per 1K/2K image** $0.12 per 4K image** |
| Used to improve our products | Yes | No |

* Image input is set at 560 tokens or $0.0011 per image.

** Image output is priced at $120 per 1,000,000 tokens. Output images from 1024x1024px (1K) and up to 2048x2048px (2K) consume 1120 tokens and are equivalent to $0.134 per image. Output images up to 4096x4096px (4K) consume 2000 tokens and are equivalent to $0.24 per image.

Our state-of-the-art multipurpose model, which excels at coding and complex reasoning tasks.

|  | Free Tier | Paid Tier, per 1M tokens in USD |
| --- | --- | --- |
| Input price | Free of charge | $1.25, prompts <= 200k tokens $2.50, prompts > 200k tokens |
| Output price (including thinking tokens) | Free of charge | $10.00, prompts <= 200k tokens $15.00, prompts > 200k |
| Context caching price | Not available | $0.125, prompts <= 200k tokens $0.25, prompts > 200k $4.50 / 1,000,000 tokens per hour (storage price) |
| Grounding with Google Search | Not available | 1,500 RPD (free), then $35 / 1,000 grounded prompts |
| Grounding with Google Maps | Not available | 10,000 RPD (free), then $25 / 1,000 grounded prompts |
| Used to improve our products | Yes | No |

|  | Free Tier | Paid Tier, per 1M tokens in USD |
| --- | --- | --- |
| Input price | Not available | $0.625, prompts <= 200k tokens $1.25, prompts > 200k tokens |
| Output price (including thinking tokens) | Not available | $5.00, prompts <= 200k tokens $7.50, prompts > 200k |
| Context caching price | Not available | $0.125, prompts <= 200k tokens $0.25, prompts > 200k $4.50 / 1,000,000 tokens per hour (storage price) |
| Grounding with Google Search | Not available | 1,500 RPD (free), then $35 / 1,000 grounded prompts |
| Grounding with Google Maps | Not available | Not available |
| Used to improve our products | Yes | No |

Our first hybrid reasoning model which supports a 1M token context window and has thinking budgets.

|  | Free Tier | Paid Tier, per 1M tokens in USD |
| --- | --- | --- |
| Input price | Free of charge | $0.30 (text / image / video) $1.00 (audio) |
| Output price (including thinking tokens) | Free of charge | $2.50 |
| Context caching price | Not available | $0.03 (text / image / video) $0.1 (audio) $1.00 / 1,000,000 tokens per hour (storage price) |
| Grounding with Google Search | Free of charge, up to 500 RPD (limit shared with Flash-Lite RPD) | 1,500 RPD (free, limit shared with Flash-Lite RPD), then $35 / 1,000 grounded prompts |
| Grounding with Google Maps | 500 RPD | 1,500 RPD (free), then $25 / 1,000 grounded prompts |
| Used to improve our products | Yes | No |

|  | Free Tier | Paid Tier, per 1M tokens in USD |
| --- | --- | --- |
| Input price | Not available | $0.15 (text / image / video) $0.50 (audio) |
| Output price (including thinking tokens) | Not available | $1.25 |
| Context caching price | Not available | $0.03 (text / image / video) $0.1 (audio) $1.00 / 1,000,000 tokens per hour (storage price) |
| Grounding with Google Search | Not available | 1,500 RPD (free, limit shared with Flash-Lite RPD), then $35 / 1,000 grounded prompts |
| Grounding with Google Maps | Not available | Not available |
| Used to improve our products | Yes | No |

The latest model based on the 2.5 Flash model. 2.5 Flash Preview is best for large scale processing, low-latency, high volume tasks that require thinking, and agentic use cases.

|  | Free Tier | Paid Tier, per 1M tokens in USD |
| --- | --- | --- |
| Input price | Free of charge | $0.30 (text / image / video) $1.00 (audio) |
| Output price (including thinking tokens) | Free of charge | $2.50 |
| Context caching price | Not available | $0.03 (text / image / video) $0.1 (audio) $1.00 / 1,000,000 tokens per hour (storage price) |
| Grounding with Google Search | Free of charge, up to 500 RPD (limit shared with Flash-Lite RPD) | 1,500 RPD (free, limit shared with Flash-Lite RPD), then $35 / 1,000 grounded prompts |
| Used to improve our products | Yes | No |

|  | Free Tier | Paid Tier, per 1M tokens in USD |
| --- | --- | --- |
| Input price | Not available | $0.15 (text / image / video) $0.50 (audio) |
| Output price (including thinking tokens) | Not available | $1.25 |
| Context caching price | Not available | $0.03 (text / image / video) $0.1 (audio) $1.00 / 1,000,000 tokens per hour (storage price) |
| Grounding with Google Search | Not available | 1,500 RPD (free, limit shared with Flash-Lite RPD), then $35 / 1,000 grounded prompts |
| Used to improve our products | Yes | No |

Our smallest and most cost effective model, built for at scale usage.

|  | Free Tier | Paid Tier, per 1M tokens in USD |
| --- | --- | --- |
| Input price (text, image, video) | Free of charge | $0.10 (text / image / video) $0.30 (audio) |
| Output price (including thinking tokens) | Free of charge | $0.40 |
| Context caching price | Not available | $0.01 (text / image / video) $0.03 (audio) $1.00 / 1,000,000 tokens per hour (storage price) |
| Grounding with Google Search | Free of charge, up to 500 RPD (limit shared with Flash RPD) | 1,500 RPD (free, limit shared with Flash RPD), then $35 / 1,000 grounded prompts |
| Grounding with Google Maps | 500 RPD | 1,500 RPD (free), then $25 / 1,000 grounded prompts |
| Used to improve our products | Yes | No |

|  | Free Tier | Paid Tier, per 1M tokens in USD |
| --- | --- | --- |
| Input price (text, image, video) | Not available | $0.05 (text / image / video) $0.15 (audio) |
| Output price (including thinking tokens) | Not available | $0.20 |
| Context caching price | Not available | $0.01 (text / image / video) $0.03 (audio) $1.00 / 1,000,000 tokens per hour (storage price) |
| Grounding with Google Search | Not available | 1,500 RPD (free, limit shared with Flash RPD), then $35 / 1,000 grounded prompts |
| Grounding with Google Maps | Not available | Not available |
| Used to improve our products | Yes | No |

The latest model based on Gemini 2.5 Flash lite optimized for cost-efficiency, high throughput and high quality.

|  | Free Tier | Paid Tier, per 1M tokens in USD |
| --- | --- | --- |
| Input price (text, image, video) | Free of charge | $0.10 (text / image / video) $0.30 (audio) |
| Output price (including thinking tokens) | Free of charge | $0.40 |
| Context caching price | Not available | $0.01 (text / image / video) $0.03 (audio) $1.00 / 1,000,000 tokens per hour (storage price) |
| Grounding with Google Search | Free of charge, up to 500 RPD (limit shared with Flash RPD) | 1,500 RPD (free, limit shared with Flash RPD), then $35 / 1,000 grounded prompts |
| Used to improve our products | Yes | No |

|  | Free Tier | Paid Tier, per 1M tokens in USD |
| --- | --- | --- |
| Input price (text, image, video) | Not available | $0.05 (text / image / video) $0.15 (audio) |
| Output price (including thinking tokens) | Not available | $0.20 |
| Context caching price | Not available | $0.01 (text / image / video) $0.03 (audio) $1.00 / 1,000,000 tokens per hour (storage price) |
| Grounding with Google Search | Not available | 1,500 RPD (free, limit shared with Flash RPD), then $35 / 1,000 grounded prompts |
| Used to improve our products | Yes | No |

Our Live API native audio models optimized for higher quality audio outputs with better pacing, voice naturalness, verbosity, and mood.

Preview models may change before becoming stable and have more restrictive rate limits.

|  | Free Tier | Paid Tier, per 1M tokens in USD |
| --- | --- | --- |
| Input price | Free of charge | $0.50 (text) $3.00 (audio / video) |
| Output price (including thinking tokens) | Free of charge | $2.00 (text) $12.00 (audio) |
| Used to improve our products | Yes | No |

Our native image generation model, optimized for speed, flexibility, and contextual understanding. Text input and output is priced the same as 2.5 Flash.

Preview models may change before becoming stable and have more restrictive rate limits.

|  | Free Tier | Paid Tier, per 1M tokens in USD |
| --- | --- | --- |
| Input price | Not available | $0.30 (text / image) |
| Output price | Not available | $0.039 per image* |
| Used to improve our products | Yes | No |

|  | Free Tier | Paid Tier, per 1M tokens in USD |
| --- | --- | --- |
| Input price | Not available | $0.15 (text / image) |
| Output price | Not available | $0.0195 per image* |
| Used to improve our products | Yes | No |

[*] Image output is priced at $30 per 1,000,000 tokens. Output images up to 1024x1024px consume 1290 tokens and are equivalent to $0.039 per image.

Our 2.5 Flash text-to-speech audio model optimized for price-performant, low-latency, controllable speech generation.

Preview models may change before becoming stable and have more restrictive rate limits.

|  | Free Tier | Paid Tier, per 1M tokens in USD |
| --- | --- | --- |
| Input price | Free of charge | $0.50 (text) |
| Output price | Free of charge | $10.00 (audio) |
| Used to improve our products | Yes | No |

|  | Free Tier | Paid Tier, per 1M tokens in USD |
| --- | --- | --- |
| Input price | Not available | $0.25 (text) |
| Output price | Not available | $5.00 (audio) |
| Used to improve our products | Yes | No |

Our 2.5 Pro text-to-speech audio model optimized for powerful, low-latency speech generation for more natural outputs and easier to steer prompts.

Preview models may change before becoming stable and have more restrictive rate limits.

|  | Free Tier | Paid Tier, per 1M tokens in USD |
| --- | --- | --- |
| Input price | Not available | $1.00 (text) |
| Output price | Not available | $20.00 (audio) |
| Used to improve our products | Yes | No |

|  | Free Tier | Paid Tier, per 1M tokens in USD |
| --- | --- | --- |
| Input price | Not available | $0.50 (text) |
| Output price | Not available | $10.00 (audio) |
| Used to improve our products | Yes | No |

Our most balanced multimodal model with great performance across all tasks, with a 1 million token context window, and built for the era of Agents.

|  | Free Tier | Paid Tier, per 1M tokens in USD |
| --- | --- | --- |
| Input price | Free of charge | $0.10 (text / image / video) $0.70 (audio) |
| Output price | Free of charge | $0.40 |
| Context caching price | Free of charge | $0.025 / 1,000,000 tokens (text/image/video) $0.175 / 1,000,000 tokens (audio) |
| Context caching (storage) | Not available | $1.00 / 1,000,000 tokens per hour |
| Image generation pricing | Free of charge | $0.039 per image* |
| Tuning price | Not available | Not available |
| Grounding with Google Search | Free of charge, up to 500 RPD | 1,500 RPD (free), then $35 / 1,000 grounded prompts |
| Grounding with Google Maps | 500 RPD | 1,500 RPD (free), then $25 / 1,000 grounded prompts |
| Used to improve our products | Yes | No |

|  | Free Tier | Paid Tier, per 1M tokens in USD |
| --- | --- | --- |
| Input price | Not available | $0.05 (text / image / video) $0.35 (audio) |
| Output price | Not available | $0.20 |
| Context caching price | Not available | $0.025 / 1,000,000 tokens (text/image/video) $0.175 / 1,000,000 tokens (audio) |
| Context caching (storage) | Not available | $1.00 / 1,000,000 tokens per hour |
| Image generation pricing | Not available | $0.0195 per image* |
| Tuning price | Not available | Not available |
| Grounding with Google Search | Not available | 1,500 RPD (free), then $35 / 1,000 grounded prompts |
| Grounding with Google Maps | Not available | Not available |
| Used to improve our products | Yes | No |

[*] Image output is priced at $30 per 1,000,000 tokens. Output images up to 1024x1024px consume 1290 tokens and are equivalent to $0.039 per image.

Our smallest and most cost effective model, built for at scale usage.

|  | Free Tier | Paid Tier, per 1M tokens in USD |
| --- | --- | --- |
| Input price | Free of charge | $0.075 |
| Output price | Free of charge | $0.30 |
| Context caching price | Not available | Not available |
| Context caching (storage) | Not available | Not available |
| Tuning price | Not available | Not available |
| Grounding with Google Search | Not available | Not available |
| Used to improve our products | Yes | No |

|  | Free Tier | Paid Tier, per 1M tokens in USD |
| --- | --- | --- |
| Input price | Not available | $0.0375 |
| Output price | Not available | $0.15 |
| Context caching price | Not available | Not available |
| Context caching (storage) | Not available | Not available |
| Tuning price | Not available | Not available |
| Grounding with Google Search | Not available | Not available |
| Used to improve our products | Yes | No |

Our latest image generation model, with significantly better text rendering and better overall image quality.

Preview models may change before becoming stable and have more restrictive rate limits.

|  | Free Tier | Paid Tier, per Image in USD |
| --- | --- | --- |
| Imagen 4 Fast image price | Not available | $0.02 |
| Imagen 4 Standard image price | Not available | $0.04 |
| Imagen 4 Ultra image price | Not available | $0.06 |
| Used to improve our products | Yes | No |

Veo 3.1
-------

_`veo-3.1-generate-preview`, `veo-3.1-fast-generate-preview`_

Try Veo 3.1

Our latest video generation model, available to developers on the paid tier of the Gemini API.

Preview models may change before becoming stable and have more restrictive rate limits.

|  | Free Tier | Paid Tier, per second in USD |
| --- | --- | --- |
| Veo 3.1 Standard video with audio price (default) | Not available | $0.40 (720p and 1080p) $0.60 (4k) |
| Veo 3.1 Fast video with audio price (default) | Not available | $0.15 (720p and 1080p) $0.35 (4k) |
| Used to improve our products | Yes | No |

Veo 3
-----

_`veo-3.0-generate-001`, `veo-3.0-fast-generate-001`_

Try Veo 3

Our stable video generation model, available to developers on the paid tier of the Gemini API.

|  | Free Tier | Paid Tier, per second in USD |
| --- | --- | --- |
| Veo 3 Standard video with audio price (default) | Not available | $0.40 |
| Veo 3 Fast video with audio price (default) | Not available | $0.15 |
| Used to improve our products | Yes | No |

Our state-of-the-art video generation model, available to developers on the paid tier of the Gemini API.

|  | Free Tier | Paid Tier, per second in USD |
| --- | --- | --- |
| Video price | Not available | $0.35 |
| Used to improve our products | Yes | No |

Our newest embeddings model, more stable and with higher rate limits than previous versions, available to developers on the free and paid tiers of the Gemini API.

|  | Free Tier | Paid Tier, per 1M tokens in USD |
| --- | --- | --- |
| Input price | Free of charge | $0.15 |
| Used to improve our products | Yes | No |

|  | Free Tier | Paid Tier, per 1M tokens in USD |
| --- | --- | --- |
| Input price | Not available | $0.075 |
| Used to improve our products | Yes | No |

Gemini Robotics-ER, short for Gemini Robotics-Embodied Reasoning, is a thinking model that enhances robots' abilities to understand and interact with the physical world.

|  | Free Tier | Paid Tier, per 1M tokens in USD |
| --- | --- | --- |
| Input price | Free of charge | $0.30 (text / image / video) $1.00 (audio) |
| Output price (including thinking tokens) | Free of charge | $2.50 |
| Grounding with Google Search | Free of charge, up to 500 RPD (limit shared with Flash-Lite RPD) | 1,500 RPD (free, limit shared with Flash-Lite RPD), then $35 / 1,000 grounded prompts |
| Used to improve our products | Yes | No |

|  | Free Tier | Paid Tier, per 1M tokens in USD |
| --- | --- | --- |
| Input price | Not available | Not available |
| Output price (including thinking tokens) | Not available | Not available |
| Grounding with Google Search | Not available | Not available |
| Used to improve our products | Yes | No |

Gemini 2.5 Computer Use Preview
-------------------------------

_`gemini-2.5-computer-use-preview-10-2025`_

Our Computer Use model optimized for building browser control agents that automate tasks.

|  | Free Tier | Paid Tier, per 1M tokens in USD |
| --- | --- | --- |
| Input price | Not available | $1.25, prompts <= 200k tokens $2.50, prompts > 200k token |
| Output price | Not available | $10.00, prompts <= 200k tokens $15.00, prompts > 200k |
| Used to improve our products | Yes | No |

Gemma 3
-------

Our lightweight, state-of the art, open model built from the same technology that powers our Gemini models.

|  | Free Tier | Paid Tier, per 1M tokens in USD |
| --- | --- | --- |
| Input price | Free of charge | Not available |
| Output price | Free of charge | Not available |
| Context caching price | Free of charge | Not available |
| Context caching (storage) | Free of charge | Not available |
| Tuning price | Not available | Not available |
| Grounding with Google Search | Not available | Not available |
| Used to improve our products | Yes | No |

Gemma 3n
--------

Our open model built for efficient performance on everyday devices like mobile phones, laptops, and tablets.

|  | Free Tier | Paid Tier, per 1M tokens in USD |
| --- | --- | --- |
| Input price | Free of charge | Not available |
| Output price | Free of charge | Not available |
| Context caching price | Free of charge | Not available |
| Context caching (storage) | Free of charge | Not available |
| Tuning price | Not available | Not available |
| Grounding with Google Search | Not available | Not available |
| Used to improve our products | Yes | No |

Pricing for tools
-----------------

Tools are priced at their own rates, applied to the model using them. Check the Models page for which tools are available to each model.

|  | Free Tier | Paid Tier, per 1M tokens in USD |
| --- | --- | --- |
| Google Search | 500 RPD free (limit shared for Flash and Flash-Lite). Not available for Pro. | 1,500 RPD free (limit shared for Flash and Flash-Lite). Then $35 / 1,000 grounded prompts See the Gemini 3 Pro Preview pricing section for Gemini 3 specific Search pricing. |
| Google Maps | 500 RPD Not available for Pro. | 1,500 RPD free (limit shared for Flash and Flash-Lite) 10,000 RPD free for Pro. Then $25 / 1,000 grounded prompts |
| Code execution | Free of charge | Code execution is billed at the standard token rates for the selected model. Costs are determined solely by the tool's usage, no charges are accrued for the session runtime. The generated code and execution results are billed as **Output tokens** when created, and as **Input tokens** when the model uses them as part of its iterative reasoning process. |
| URL context | Free of charge | Charged as input tokens per model pricing. |
| Computer use | Not available | See Gemini 2.5 Computer Use Preview pricing table. |
| File search | Free of charge | Charged for embeddings at $0.15 / 1M tokens. Retrieved document tokens charged as regular tokens per model pricing. |

[*] Google AI Studio usage is free of charge in all available regions. See Billing FAQs for details.

[**] Prices may differ from the prices listed here and the prices offered on Vertex AI. For Vertex prices, see the Vertex AI pricing page.

[***] If you are using dynamic retrieval to optimize costs, only requests that contain at least one grounding support URL from the web in their response are charged for Grounding with Google Search. Costs for Gemini always apply. Rate limits are subject to change.

Pricing for agents
------------------

Agent usage costs are calculated based on the underlying token consumption and usage of the tools.

|  | Model | Tools |
| --- | --- | --- |
| Gemini Deep Research Agent | All model inference is charged at standard Gemini 3 Pro list rates, including input, output, and intermediate input / reasoning tokens generated during agentic loops. | Tool usage fees apply per existing pricing structure, maintaining standard distinctions for Search Grounding (retrieved tokens excluded) versus Url_context / File Search (retrieved tokens included in all other tools). |

Except as otherwise noted, the content of this page is licensed under the Creative Commons Attribution 4.0 License, and code samples are licensed under the Apache 2.0 License. For details, see the Google Developers Site Policies. Java is a registered trademark of Oracle and/or its affiliates.

Last updated 2026-02-02 UTC.


<END_OF_CONTEXT>
            
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
Docs URL: https://cerebras.ai/pricing
Provider: Cerebras

Title: Cerebras

URL Source: 

Markdown Content:
Skip to main content

Image 1

Pricing
-------

Inference API access
--------------------

### Free

The easiest way to get started with Cerebras

*   Access to all Cerebras powered models
*   The world’s fastest inference – 20x faster than OpenAI and Anthropic
*   Community support via Discord

get api key

### Developer

Generous rate limits for power users

Everything in Free

*   Self-serve payment starting at just $10
*   10x higher rate limits than free tier
*   Higher priority processing

get api key

### Enterprise

Highest throughput, custom weights, and guaranteed uptime

Everything in Developer, plus:

*   Highest rate limits for production workloads
*   Lowest latency with dedicated queue priority
*   Support for custom model weights
*   Model fine-tuning and training services
*   Dedicated support team with response time guarantees

contact sales

Cerebras Code
-------------

### Pro

$50/month

*   Top open source model access with fast, high-context completions.
*   Send up to 24 million tokens/day ($48/day worth of value)
*   Ideal for indie devs, simple agentic workflows, and weekend projects.

sign up

### Max

$200/month

*   Top open source model for heavy coding workflows.
*   Send up to 120m tokens/day ($240/day worth of value)
*   Ideal for full-time development, IDE integrations, code refactoring, and multi-agent systems.

sign up

Developer tier Pricing
----------------------

Model Speed Input Output
Image 2: ZAIZAI GLM 4.7*~1000 tokens/s$2.25/M tokens$2.75/M tokens
Image 3: OPENAIGPT OSS 120B~3000 tokens/s$0.35/M tokens$0.75/M tokens
Image 4: METALlama 3.1 8B~2200 tokens/s$0.10/M tokens$0.10/M tokens
Image 5: QWENQwen 3 235B Instruct*~1400 tokens/s$0.60/M tokens$1.20/M tokens

*Preview models are intended for evaluation purposes only, and are not intended for use in production environments. They may be discontinued at short notice.

Partners
--------

Get access to Cerebras Inference through our partner APIs


<END_OF_CONTEXT>
            
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
Docs URL: https://openrouter.ai/docs/limits
Provider: OpenRouter

Title: API Rate Limits - Manage Model Usage and Quotas

URL Source: 

Markdown Content:
Rate Limits

Making additional accounts or API keys will not affect your rate limits, as we govern capacity globally. We do however have different rate limits for different models, so you can share the load that way if you do run into issues.

Rate Limits and Credits Remaining
---------------------------------

To check the rate limit or credits left on an API key, make a GET request to `

1 import { OpenRouter } from '@openrouter/sdk';
2
3 const openRouter = new OpenRouter({
4 apiKey: '<OPENROUTER_API_KEY>',
5});
6
7 const keyInfo = await openRouter.apiKeys.getCurrent();
8 console.log(keyInfo);

If you submit a valid API key, you should get a response of the form:

TypeScript

1 type Key = {
2 data: {
3 label: string;
4 limit: number | null; // Credit limit for the key, or null if unlimited
5 limit_reset: string | null; // Type of limit reset for the key, or null if never resets
6 limit_remaining: number | null; // Remaining credits for the key, or null if unlimited
7 include_byok_in_limit: boolean; // Whether to include external BYOK usage in the credit limit
8
9 usage: number; // Number of credits used (all time)
10 usage_daily: number; // Number of credits used (current UTC day)
11 usage_weekly: number; // ... (current UTC week, starting Monday)
12 usage_monthly: number; // ... (current UTC month)
13
14 byok_usage: number; // Same for external BYOK usage
15 byok_usage_daily: number;
16 byok_usage_weekly: number;
17 byok_usage_monthly: number;
18
19 is_free_tier: boolean; // Whether the user has paid for credits before
20// rate_limit: { ... } // A deprecated object in the response, safe to ignore
21};
22};

There are a few rate limits that apply to certain types of requests, regardless of account status:

1.   Free usage limits: If you’re using a free model variant (with an ID ending in `:free`), you can make up to 20 requests per minute. The following per-day limits apply:

*   If you have purchased less than 10 credits, you’re limited to 50 `:free` model requests per day.

*   If you purchase at least 10 credits, your daily limit is increased to 1000 `:free` model requests per day.

1.   **DDoS protection**: Cloudflare’s DDoS protection will block requests that dramatically exceed reasonable usage.

If your account has a negative credit balance, you may see `402` errors, including for free models. Adding credits to put your balance above zero allows you to use those models again.


<END_OF_CONTEXT>
            
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
Docs URL: https://mistral.ai/technology/#pricing
Provider: Mistral AI

Title: Mistral AI Studio - your AI production platform | Mistral AI

URL Source: 

Markdown Content:
Mistral AI Studio - your AI production platform | Mistral AI
===============

Image 17: Mistral AI Logo Image 18: Mistral AI Logo White

*   Products
*   Solutions
*   Research
*   Resources
*   Pricing
*   Company

Try StudioTalk to sales

Image 19: Mistral AI Logo Image 20: Mistral AI Logo White

Everything you need at the frontier.
====================================

Create AI use cases, manage the AI full lifecycle, and ship with confidence, all with enterprise privacy, security, and full ownership of your data.

Enterprise deploymentsTry Studio

Image 21: e2d06cb1-c252-48e6-9192-11dc111096e2

### AI tooling, models, and infrastructure. Deployable Image 22: Boat anywhere.

Mistral AI Studio is the AI builders' preferred toolkit.

Start building

Applied AI and deployment services

AI tooling Agent Runtime

Observability

AI Registry

Post-training

Custom pre-training

Data and tool connections
Library of frontier LLMs SOTA language models

Small and edge models

Code models

Multimodal models

Custom models
AI infrastructure management Inference container

Routing/caching

Load balancing

API gateway

Security and resilience

### Why Studio?

### Packaged best practices from a frontier AI lab.

Leverage our best practices playbook behind SOTA models, built to meet enterprise challenges.

### Privacy by design.

Retain full data ownership, whether deploying privately, in a dedicated environment, or self-hosted.

Image 23: icon-filters-beige

### State and telemetry control.

Traces, metrics, and evaluation judges are wired into datasets and experiments for full control.

Image 24: icon-copy-beige

### Unified AI registry.

Connect models, agents, datasets, and tools with full lineage and version control through a governed catalog.

Image 25: icon-lightbulb-beige

### Expertly orchestrated intelligence.

Only Mistral AI Studio delivers expertly combined LLM Agents, rules, and deterministic code tuned to enterprise use cases.

### Comprehensive AI tooling.

Mistral Studio unifies reusable blocks (agents, tools, connectors, guardrails, judges, datasets, workflows, evaluations) with observability and workflow telemetry so teams can move from PoC to production, safely and measurably.

Agent Runtime

Image 26: check-orange

AI Registry

Image 27: check-orange

Observability

Image 28: check-orange

Post-training

Image 29: check-orange

Custom pre-training

Image 30: check-orange

Data and tool connections

Image 31: check-orange

Agent Runtime

Make multi-step AI work repeatable, observable, and shareable. Gain transparency in agentic business workflows to reduce failures, clarify ownership, and quickly resolve incidents.

Image 32: 21ae6d9c-689f-403c-be49-aa883f9b2d28

AI Registry

Govern every AI asset with confidence and clarity. A unified catalog coupled with comprehensive management controls delivers complete traceability, safer collaboration, and faster promotion from experiment to production.

Image 33: 693d647e-9821-4cd3-8d65-14da7058f031

Observability

Understand your AI, not just its metrics. Legacy observability stops at technical metrics — we go further. Our approach focuses on behavioral KPIs and statistical signals that explain not just what happened, but why. Built for AI systems where patterns matter more than point values, it helps you understand, iterate, and act with confidence.

Image 34: e2e79beb-1dac-41d8-8434-ffc6d2254a3a

Post-training

Customize models for your specific use cases with complete control over the training process. Mistral AI Studio enables teams to adapt models to their domain-specific needs while maintaining performance and reliability.

Image 35: 12686646-a8b8-4c85-ba4a-43f33d7e802f

Custom pre-training

Go beyond post-training to train open models deeply on your domain and deploy with governance, ensuring control, lineage, and higher compliance.

Image 36: 37a56940-62ae-4211-89f3-7ada980b55ed

Data and tool connections

Query, cross-reference, and perform actions on any enterprise data sources using custom or MCP connectors.

Image 37: 71ef2c45-fe03-4d61-a58e-9f372acaaaec

Build with freedom.

Faster iteration

*   Experiments: Design and compare model variations in controlled environments. 
*   Iterations: Rapidly refine performance with reproducible, versioned runs. 
*   Judges: Evaluate outputs automatically using built-in or custom scoring models. 

Image 38: f473b396-e2af-4b5e-a70f-881379ab6593

Measurable quality

*   Datasets: Turn real traffic and feedback into curated, high-quality datasets. 
*   Judge scores: Quantify improvements with consistent, interpretable metrics. 
*   APM metrics: Track latency, accuracy, and reliability across every deployment. 

Image 39: a324708b-3263-4812-9fab-5b42eae871b4

Lower-risk deployments

*   Moderation: Detect and filter unsafe or non-compliant outputs automatically. 
*   Guardrails: Enforce behavioral and policy constraints at runtime. 
*   Versioning and rollback: Safely deploy new iterations with instant rollback options. 

Image 40: f4a0149c-36c8-48ab-9ece-49ab2f31db09

Deep observability

*   Traces: Visualize every request and response to diagnose issues fast. 
*   Dashboards: Monitor health, usage, and experiment outcomes in real time. 
*   Workflow telemetry: Gain visibility into multi-step pipelines and dependencies. 

Image 41: cee0454a-0315-4709-ab63-5355b307c8d2

Portability

*   Hybrid: Deploy seamlessly across cloud and on-prem environments. 
*   Dedicated environments: Isolate workloads for security, compliance, or performance. 
*   Self-hosted deployment: Retain full control over infrastructure and data residency. 
*   Exportable artifacts: Package and move trained assets across systems with ease. 

Image 42: 33e5e3e5-ad9f-49f9-94d8-3dc1b165da84

Traceability and reuse

*   Unified registry: Connect models, agents, datasets, and workflows under one lineage system. 
*   Version control: Track changes and reuse assets confidently across teams. 

Image 43: 716c2298-27b3-4353-99c3-85e4103a0749

Privacy and control

*   Data governance: Your data stays within your perimeter—never shared or exposed. 
*   Auditability: Maintain full transparency across datasets, models, and experiments. 

Image 44: 2e8b1168-4e76-44ff-b362-7bbd50c62203

Faster iteration

Measurable quality

Lower-risk deployments

Deep observability

Portability

Traceability and reuse

Privacy and control

Faster iteration

*   Experiments: Design and compare model variations in controlled environments. 
*   Iterations: Rapidly refine performance with reproducible, versioned runs. 
*   Judges: Evaluate outputs automatically using built-in or custom scoring models. 

Image 45: f473b396-e2af-4b5e-a70f-881379ab6593

Measurable quality

*   Datasets: Turn real traffic and feedback into curated, high-quality datasets. 
*   Judge scores: Quantify improvements with consistent, interpretable metrics. 
*   APM metrics: Track latency, accuracy, and reliability across every deployment. 

Image 46: a324708b-3263-4812-9fab-5b42eae871b4

Lower-risk deployments

*   Moderation: Detect and filter unsafe or non-compliant outputs automatically. 
*   Guardrails: Enforce behavioral and policy constraints at runtime. 
*   Versioning and rollback: Safely deploy new iterations with instant rollback options. 

Image 47: f4a0149c-36c8-48ab-9ece-49ab2f31db09

Deep observability

*   Traces: Visualize every request and response to diagnose issues fast. 
*   Dashboards: Monitor health, usage, and experiment outcomes in real time. 
*   Workflow telemetry: Gain visibility into multi-step pipelines and dependencies. 

Image 48: cee0454a-0315-4709-ab63-5355b307c8d2

Portability

*   Hybrid: Deploy seamlessly across cloud and on-prem environments. 
*   Dedicated environments: Isolate workloads for security, compliance, or performance. 
*   Self-hosted deployment: Retain full control over infrastructure and data residency. 
*   Exportable artifacts: Package and move trained assets across systems with ease. 

Image 49: 33e5e3e5-ad9f-49f9-94d8-3dc1b165da84

Traceability and reuse

*   Unified registry: Connect models, agents, datasets, and workflows under one lineage system. 
*   Version control: Track changes and reuse assets confidently across teams. 

Image 50: 716c2298-27b3-4353-99c3-85e4103a0749

Privacy and control

*   Data governance: Your data stays within your perimeter—never shared or exposed. 
*   Auditability: Maintain full transparency across datasets, models, and experiments. 

Image 51: 2e8b1168-4e76-44ff-b362-7bbd50c62203

### Widest library of frontier LLMs.

Mistral Studio is your entry point for all our frontier models, ready to deploy as-is or for your pre-training and post-training customizations.

Mistral Large 3

One of the best OSS models in the world.

Image 52



Mistral Medium 3

State-of-the-art performance at 8X lower cost.

Image 53



Ministral 3 Family

The world’s best edge models.

Image 54





Explore more models

Deployable Image 55: Arrow Right anywhere.

Deploy Mistral Studio anywhere and maintain complete control over your AI while leveraging production-ready infrastructure, optimized inference engine, caching, routing, security controls, and automated deployment.

Self-hosted

Mistral Cloud

Cloud providers

Deploy Mistral Studio on virtual cloud, edge, or on-premises. Self-hosted deployments offer more advanced levels of customization and control. Your data stays within your walls.

Contact our team

Image 56: 782833a7-8c6a-4fae-87bc-7cea9bca22cd

Get started with Mistral Studio hosted on Mistral’s infrastructure and build your own applications and services with our APIs. Our servers are hosted in EU.

Discover Studio

Image 57: c99bd909-0b5b-4ad7-8992-f81660c48a08

Access the power of Mistral AI Studio via your preferred cloud provider (Google Cloud, AWS, Azure, SAP, IBM, Snowflake, NVIDIA, Outscale) using your cloud credits.

Explore cloud deployments

Image 58: bdd57ea1-afa5-4e96-bcf9-3e900a168aa5

### Deployable Image 59: Arrow Right anywhere.

Deploy Mistral Studio anywhere and maintain complete control over your AI while leveraging production-ready infrastructure, optimized inference engine, caching, routing, security controls, and automated deployment.

Self-hosted

Mistral Cloud

Cloud providers

Deploy Mistral Studio on virtual cloud, edge, or on-premises. Self-hosted deployments offer more advanced levels of customization and control. Your data stays within your walls.

Contact our team

Image 60: 782833a7-8c6a-4fae-87bc-7cea9bca22cd

### Deeply engaged applied AI services.

Transform general LLMs into specialized solutions with expert guidance and deployment.

### Custom training

Transform general-purpose LLMs into specialized intelligence powerhouses with domain-specific training services, achieving enhanced accuracy while reducing model size by 2-3x through advanced distillation techniques for optimal performance.

### Use case discovery

Partner with our expert team to define clear AI adoption success criteria and build targeted use cases aligned with your organization’s goals, business objectives, and existing data platforms for maximum value realization.

### Deployment services

Process tens of billions of tokens daily across thousands of GPUs with enterprise-grade deployment capabilities, choosing from flexible options including public clouds, private infrastructure, or on-premises installations with comprehensive expert support.

### Enablement and value delivery

Progress from proof of value to full deployment with expert guidance at every step, transforming your business objectives into custom AI solutions that deliver measurable results, including 94% reduction in cost per token and 70% improvement in latency.

Explore applied AI services

### Build the next Image 61: Arrow Right big thing.

Documentation

Comprehensive guides and API references.

View docs

Examples

Ready-to-use code samples and tutorials.

Browse examples

Support

Expert guidance and community resources.

Get help

Image 62
Explore flexible pricing options, right-sized for your business.
----------------------------------------------------------------

View pricing

Build your own AI future.
-------------------------

Build, customize, and deploy AI solutions with complete control.

Try le ChatBuild on Mistral StudioTalk to an expert

Image 63: LeChat - Mistral



Image 64: App Store Mistral AIImage 65: Google Play Mistral AI

Mistral AI © 2026

### Why Mistral

About usOur customersCareersContact us

### Explore

AI solutionsPartnersResearchDocumentation

### Build

StudioLe ChatVibeMistral Compute

### Legal

Terms of servicePrivacy policyPrivacy choicesData processing agreementLegal noticeBrand

en
Mistral AI © 2026

Image 66Image 67Image 68


<END_OF_CONTEXT>
            