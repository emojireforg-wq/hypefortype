import { createOrder } from '../../lib/paypal';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { amount, description } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' });
    const order = await createOrder(amount, description || 'HypeForType Font License');
    res.status(200).json({ orderId: order.id });
  } catch (err) {
    console.error('PayPal create error:', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
}
