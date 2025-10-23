import axios from 'axios';

const FONNTE_TOKEN = process.env.FONNTE_TOKEN;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { phone, type, data } = req.body;

    if (!phone || !type) {
      return res.status(400).json({ error: 'Phone dan type wajib diisi' });
    }

    let message = '';

    // Template untuk checkout notification
    if (type === 'checkout') {
      const { orderId, items, total, customerName } = data;
      
      message = `🛍️ *Pesanan Baru Dibuat*\n\n`;
      message += `Halo ${customerName}!\n\n`;
      message += `Terima kasih telah berbelanja di WEB Payment Gateway.\n\n`;
      message += `📋 *Detail Pesanan:*\n`;
      message += `Order ID: ${orderId}\n\n`;
      message += `*Produk:*\n`;
      items.forEach(item => {
        message += `• ${item.name} x${item.quantity} - Rp ${item.price.toLocaleString('id-ID')}\n`;
      });
      message += `\n💰 *Total: Rp ${total.toLocaleString('id-ID')}*\n\n`;
      message += `Silakan lakukan pembayaran untuk menyelesaikan pesanan Anda.\n\n`;
      message += `Terima kasih! 🙏`;
    }

    // Template untuk payment success notification
    if (type === 'payment_success') {
      const { orderId, amount, customerName, paymentMethod } = data;
      
      message = `✅ *Pembayaran Berhasil!*\n\n`;
      message += `Halo ${customerName}!\n\n`;
      message += `Pembayaran Anda telah berhasil diproses.\n\n`;
      message += `📋 *Detail Pembayaran:*\n`;
      message += `Order ID: ${orderId}\n`;
      message += `Metode: ${paymentMethod}\n`;
      message += `Total: Rp ${amount.toLocaleString('id-ID')}\n\n`;
      message += `Pesanan Anda akan segera diproses.\n\n`;
      message += `Terima kasih telah berbelanja! 🎉`;
    }

    // Kirim WhatsApp menggunakan Fonnte
    const response = await axios.post('https://api.fonnte.com/send', {
      target: phone,
      message: message,
      countryCode: '62'
    }, {
      headers: {
        'Authorization': FONNTE_TOKEN
      }
    });

    console.log('WhatsApp sent:', response.data);

    res.status(200).json({
      success: true,
      message: 'Notifikasi WhatsApp berhasil dikirim'
    });

  } catch (error) {
    console.error('Send WhatsApp error:', error);
    res.status(500).json({ 
      error: 'Gagal mengirim notifikasi WhatsApp',
      details: error.message 
    });
  }
}