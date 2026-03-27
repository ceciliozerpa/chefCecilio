// api/analyze-recipe.js
export default async function handler(req, res) {
  const { description } = req.body;
  const API_KEY = process.env.ANTHROPIC_API_KEY; // <--- Secreto guardado en Vercel

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        messages: [{ role: 'user', content: `Extrae esta receta en JSON: ${description}` }]
      })
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Error de servidor" });
  }
}
