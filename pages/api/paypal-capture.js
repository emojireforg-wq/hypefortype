import { captureOrder } from '../../lib/paypal';
import { generateToken } from '../../lib/tokens';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { orderId, fontSlug, licenseTier, customerEmail } = req.body;
    if (!orderId) return res.status(400).json({ error: 'Missing orderId' });

    const capture = await captureOrder(orderId);
    if (capture.status !== 'COMPLETED') {
      return res.status(400).json({ error: 'Payment not completed', details: capture });
    }

    const payer = capture.payer;
    const amount = capture.purchase_units[0]?.payments?.captures[0]?.amount?.value;

    const downloadToken = generateToken({
      fontSlug,
      licenseTier,
      customerEmail: customerEmail || payer?.email_address,
      paypalOrderId: orderId,
      amount,
      purchasedAt: new Date().toISOString(),
    });

    const downloadUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/download?token=${downloadToken}`;

    res.status(200).json({
      success: true,
      downloadUrl,
      token: downloadToken,
      payerEmail: payer?.email_address,
      amount,
    });
  } catch (err) {
    console.error('PayPal capture error:', err);
    res.status(500).json({ error: 'Failed to capture payment' });
  }
}
