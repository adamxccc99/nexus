export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!apiKey) {
    return res.status(500).json({ error: 'GROQ_API_KEY is not configured on the server.' });
  }

  try {
    const body = req.body || {};
    const apiKey = typeof body.apiKey === 'string' && body.apiKey.trim()
      ? body.apiKey.trim()
      : process.env.GROQ_API_KEY;
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const model = typeof body.model === 'string' && body.model.trim()
      ? body.model.trim()
      : 'openai/gpt-oss-20b';

    if (!messages.length) {
      return res.status(400).json({ error: 'messages must be a non-empty array.' });
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ model, messages })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error?.message || 'Groq API request failed.'
      });
    }

    return res.status(200).json({
      content: data?.choices?.[0]?.message?.content || ''
    });
  } catch (error) {
    return res.status(500).json({
      error: error?.message || 'Unexpected server error.'
    });
  }
}
