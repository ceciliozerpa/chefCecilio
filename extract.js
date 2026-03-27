export default async function handler(req, res) {
  const { url } = req.body;
  // Usamos una variable de entorno para no exponer tu clave
  const API_KEY = process.env.ANTHROPIC_API_KEY;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1000,
        messages: [{ role: 'user', content: `Extrae la receta de esto: ${url}. Devuelve solo JSON con title, ingredients (array) y stepsArray (array).` }]
      })
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Error de extracción" });
  }
}
