export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'GROQ_API_KEY is not configured on the server.'
    });
  }

  try {
    const body = req.body || {};
    const messages = Array.isArray(body.messages) ? body.messages : [];

    if (!messages.length) {
      return res.status(400).json({ error: 'messages must be a non-empty array.' });
    }

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b',
        messages,
        tools: [{ type: 'browser_search' }],
        citation_options: 'enabled'
      })
    });

    const data = await groqResponse.json();

    if (!groqResponse.ok) {
      return res.status(groqResponse.status).json({
        error: data?.error?.message || 'Groq API request failed.'
      });
    }

    const message = data?.choices?.[0]?.message;
    return res.status(200).json({
      content: message?.content || '',
      citations: message?.citations || data?.citations || []
    });
  } catch (error) {
    return res.status(500).json({
      error: error?.message || 'Unexpected server error.'
    });
  }
}
