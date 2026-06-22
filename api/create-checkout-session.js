// Función serverless (Vercel) para crear una sesión de pago de Stripe.
// Requiere: npm install stripe  y la variable de entorno STRIPE_SECRET_KEY.
// Crea precios (Price) en el panel de Stripe y pon sus IDs en STRIPE_PRICE_MONTHLY
// y STRIPE_PRICE_YEARLY.

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const secret = process.env.STRIPE_SECRET_KEY
  if (!secret) return res.status(500).json({ error: 'Falta STRIPE_SECRET_KEY' })

  try {
    // Import dinámico para no romper el build si stripe no está instalado en local
    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(secret)

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    const { plan = 'yearly', origin } = body || {}

    const priceId =
      plan === 'monthly' ? process.env.STRIPE_PRICE_MONTHLY : process.env.STRIPE_PRICE_YEARLY
    if (!priceId) return res.status(500).json({ error: 'Falta el Price ID del plan' })

    const baseUrl = origin || req.headers.origin || ''

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: { trial_period_days: 7 },
      success_url: `${baseUrl}/?premium=success`,
      cancel_url: `${baseUrl}/?premium=cancel`,
    })

    return res.status(200).json({ url: session.url })
  } catch (e) {
    return res.status(500).json({ error: e?.message || 'Error creando la sesión' })
  }
}
