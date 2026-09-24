# NEXUS AI

NEXUS is a lightweight AI chat interface.

## Web search

NEXUS can optionally use Groq's server-side browser search with OpenAI GPT-OSS models.

### Deployment

The web-search endpoint is implemented as `/api/chat.js`, so deploy NEXUS to a platform that supports serverless functions (for example, Vercel).

Set this server-side environment variable:

```text
GROQ_API_KEY=your_groq_api_key
```

**Never put the Groq API key in `index.html` or commit it to Git.**

### How it works

1. Turn on **Web Search** in NEXUS.
2. The browser sends the conversation to `/api/chat`.
3. The server calls Groq with `openai/gpt-oss-120b` and the `browser_search` built-in tool.
4. Groq performs the web search server-side and returns the answer.
5. NEXUS displays the result.

Groq documents browser search as a server-side built-in tool for GPT-OSS models.
