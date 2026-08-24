---
name: token_reducer
description: >-
  Skill to minimize token usage per request by applying prompt compression,
  summarizing user input, and using token budgeting strategies.
---

# Token Reduction Skill

## Goal
Reduce the number of tokens sent to the model for each request while preserving the essential meaning and required context.

## How It Works
1. **Input Summarization**
   - If the user provides a large block of text, the skill first attempts to create a concise summary using a lightweight model (e.g., `gpt-3.5-turbo` with a low `max_tokens` setting).
   - The summary replaces the original input in the request payload.
2. **Prompt Compression**
   - Common boilerplate (e.g., "Please answer concisely") is stored in a reusable snippet and injected only when needed.
   - Repetitive user instructions are detected and replaced by a short reference token.
3. **Token Budgeting**
   - A configurable budget (`max_total_tokens`) can be set per request.
   - The skill trims or truncates non‑essential sections (e.g., long code listings) to stay under the budget.
4. **Chunking Large Payloads**
   - For inputs exceeding the budget, the skill splits the request into multiple logical chunks and issues sequential calls, stitching the responses together.
5. **Cache Frequent Summaries**
   - Results of summarization are cached in a local store (keyed by a hash of the original content) to avoid recomputing for repeated inputs.

## Configuration
```yaml
max_total_tokens: 2048   # Maximum tokens for the whole request (prompt + completion)
summary_model: "gpt-3.5-turbo"   # Model used for quick summarization
summary_max_tokens: 150   # Tokens allocated for the summary step
cache_dir: "~/.gemini/token_reducer_cache"   # Where to store cached summaries
```

## Usage Example
```text
User: I have a 3000‑line configuration file that I need to analyze for security issues. Please list any dangerous settings.

Skill Action:
- Detect that the input exceeds the token budget.
- Summarize the configuration to the most relevant sections (e.g., security‑related keys).
- Create a compressed prompt:
  "Analyze the following summarized config for insecure settings."
- Send the request with the compressed prompt.
```

## Benefits
- **Cost reduction**: Fewer tokens mean lower usage fees.
- **Faster responses**: Smaller payloads reduce latency.
- **Scalability**: Enables handling of large inputs that would otherwise exceed model limits.

## Limitations
- Summarization may omit edge‑case details; ensure critical data is marked as "high priority" in the input.
- Cache invalidation is manual; stale summaries may persist after the source data changes.

## Activation
Add the skill directory to your workspace’s `skills.json` or place it under `.agents/` for auto‑discovery. Once loaded, the Antigravity system will automatically apply token reduction to relevant requests.
