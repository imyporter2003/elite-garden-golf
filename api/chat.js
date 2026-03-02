/**
 * Vercel Serverless Function: /api/chat
 * 
 * Proxies messages to OpenAI so the API key stays server-side
 * and is never exposed in the browser.
 * 
 * Set ARIA_API_KEY in your Vercel project environment variables.
 */

export default async function handler(req, res) {
    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const apiKey = process.env.ARIA_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'API key not configured on server.' });
    }

    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'Invalid request body. Expected { messages: [] }' });
    }

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: messages,
                max_tokens: 500,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const err = await response.json();
            return res.status(response.status).json({ error: err.error?.message || 'OpenAI error' });
        }

        const data = await response.json();
        return res.status(200).json(data);

    } catch (err) {
        console.error('Aria proxy error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
