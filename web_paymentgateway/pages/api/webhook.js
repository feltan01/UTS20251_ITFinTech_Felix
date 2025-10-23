// import dbConnect from "../../lib/mongodb";
// import Checkout from "../../models/Checkout";
// import User from "../../models/User";
// import axios from "axios";

// const FONNTE_TOKEN = process.env.FONNTE_TOKEN;

// // ✅ Fungsi helper untuk kirim WA
// async function sendWhatsAppNotification(phone, message) {
//   if (!FONNTE_TOKEN) {
//     console.warn("⚠️ FONNTE_TOKEN tidak dikonfigurasi");
//     return false;
//   }

//   if (!phone) {
//     console.warn("⚠️ Nomor telepon tidak tersedia");
//     return false;
//   }

//   // Normalisasi nomor telepon
//   let normalizedPhone = String(phone).replace(/\D/g, ""); // Hapus non-digit
  
//   // Jika dimulai dengan 0, ganti dengan 62
//   if (normalizedPhone.startsWith("0")) {
//     normalizedPhone = "62" + normalizedPhone.substring(1);
//   }
  
//   // Jika tidak dimulai dengan 62, tambahkan 62
//   if (!normalizedPhone.startsWith("62")) {
//     normalizedPhone = "62" + normalizedPhone;
//   }

//   try {
//     console.log("📤 Sending WA to:", normalizedPhone);
    
//     await axios.post(
//       "https://api.fonnte.com/send",
//       {
//         target: normalizedPhone,
//         message,
//         countryCode: "62",
//       },
//       {
//         headers: { Authorization: FONNTE_TOKEN },
//       }
//     );
//     console.log("✅ WhatsApp notification sent to", normalizedPhone);
//     return true;
//   } catch (err) {
//     console.error("❌ Gagal kirim WA:", err?.response?.data || err.message);
//     return false;
//   }
// }

// // ✅ Format rupiah
// function formatRupiah(amount) {
//   return new Intl.NumberFormat("id-ID", {
//     style: "currency",
//     currency: "IDR",
//     minimumFractionDigits: 0,
//   }).format(amount);
// }

// // ✅ Format tanggal
// function formatDate(date) {
//   return new Intl.DateTimeFormat("id-ID", {
//     dateStyle: "long",
//     timeStyle: "short",
//   }).format(new Date(date));
// }

// export default async function handler(req, res) {
//   await dbConnect();

//   if (req.method !== "POST") {
//     return res.status(405).json({ message: "Method not allowed" });
//   }

//   try {
//     // ✅ LOGIC ORIGINAL: Ambil payload dari req.body
//     const payload = req.body.data || req.body;
//     const { external_id, status } = payload;

//     if (!external_id) {
//       return res.status(400).json({ message: "external_id tidak ditemukan" });
//     }

//     // ✅ LOGIC ORIGINAL: Cari checkout berdasarkan external_id
//     const checkout = await Checkout.findOne({ external_id });

//     if (!checkout) {
//       return res.status(404).json({ 
//         message: "Checkout tidak ditemukan", 
//         external_id 
//       });
//     }

//     // ✅ LOGIC ORIGINAL: Update status
//     checkout.status = status || "PAID";
//     await checkout.save();

//     console.log(`✅ Checkout ${external_id} diupdate menjadi ${checkout.status}`);

//     // ✅ TAMBAHAN: Kirim notifikasi WA berdasarkan status
//     try {
//       const user = await User.findOne({ email: checkout.email?.toLowerCase().trim() });

//       if (user && user.phone) {
//         const itemsList = checkout.items
//           .map((item) => `• ${item.name} x${item.qty || 1}`)
//           .join("\n");

//         // Notifikasi untuk PAID
//         if (checkout.status === "PAID" || checkout.status === "SETTLED") {
//           const paidMessage = `
// ✅ *PEMBAYARAN BERHASIL*

// Halo *${user.name}*,
// Pembayaran Anda telah diterima!

// 🎉 *Invoice Details:*
// 📦 Order ID: *${external_id}*
// 💰 Total: *${formatRupiah(checkout.total)}*
// 💳 Metode: ${payload.payment_method || "-"}
// 🏦 Channel: ${payload.payment_channel || "-"}
// 📅 Tanggal: ${formatDate(payload.paid_at || new Date())}

// 📋 *Item yang dibeli:*
// ${itemsList}

// Terima kasih telah berbelanja!
// Pesanan Anda akan segera diproses. 🚀
//           `.trim();

//           await sendWhatsAppNotification(user.phone, paidMessage);
//         }
//         // Notifikasi untuk EXPIRED
//         else if (checkout.status === "EXPIRED") {
//           const expiredMessage = `
// ⏰ *INVOICE KADALUARSA*

// Halo *${user.name}*,

// Invoice Anda telah kadaluarsa.

// Order ID: *${external_id}*
// Total: *${formatRupiah(checkout.total)}*

// Silakan buat pesanan baru jika masih berminat.
//           `.trim();

//           await sendWhatsAppNotification(user.phone, expiredMessage);
//         }
//       }
//     } catch (waErr) {
//       // Jangan ganggu flow utama kalau WA gagal
//       console.error("⚠️ Gagal kirim WA webhook:", waErr.message);
//     }

//     // ✅ LOGIC ORIGINAL: Return response
//     return res.status(200).json({ 
//       message: "Webhook processed", 
//       external_id, 
//       new_status: checkout.status 
//     });

//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ 
//       message: "Internal Server Error", 
//       error: error.message 
//     });
//   }
// }

import dbConnect from "../../lib/mongodb";
import Checkout from "../../models/Checkout";
import User from "../../models/User";
import axios from "axios";

const FONNTE_TOKEN = process.env.FONNTE_TOKEN;

// ✅ Fungsi helper untuk kirim WA
async function sendWhatsAppNotification(phone, message) {
  if (!FONNTE_TOKEN) {
    console.warn("⚠️ FONNTE_TOKEN tidak dikonfigurasi");
    return false;
  }

  if (!phone) {
    console.warn("⚠️ Nomor telepon tidak tersedia");
    return false;
  }

  // Normalisasi nomor telepon
  let normalizedPhone = String(phone).replace(/\D/g, ""); // Hapus non-digit
  
  // Jika dimulai dengan 0, ganti dengan 62
  if (normalizedPhone.startsWith("0")) {
    normalizedPhone = "62" + normalizedPhone.substring(1);
  }
  
  // Jika tidak dimulai dengan 62, tambahkan 62
  if (!normalizedPhone.startsWith("62")) {
    normalizedPhone = "62" + normalizedPhone;
  }

  try {
    console.log("📤 Sending WA to:", normalizedPhone);
    
    await axios.post(
      "https://api.fonnte.com/send",
      {
        target: normalizedPhone,
        message,
        countryCode: "62",
      },
      {
        headers: { Authorization: FONNTE_TOKEN },
      }
    );
    console.log("✅ WhatsApp notification sent to", normalizedPhone);
    return true;
  } catch (err) {
    console.error("❌ Gagal kirim WA:", err?.response?.data || err.message);
    return false;
  }
}

// ✅ Format rupiah
function formatRupiah(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

// ✅ Format tanggal
function formatDate(date) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(date));
}

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // ✅ LOGIC ORIGINAL: Ambil payload dari req.body
    const payload = req.body.data || req.body;
    const { external_id, status } = payload;

    if (!external_id) {
      return res.status(400).json({ message: "external_id tidak ditemukan" });
    }

    // ✅ LOGIC ORIGINAL: Cari checkout berdasarkan external_id
    const checkout = await Checkout.findOne({ external_id });

    if (!checkout) {
      return res.status(404).json({ 
        message: "Checkout tidak ditemukan", 
        external_id 
      });
    }

    // ✅ LOGIC ORIGINAL: Update status
    checkout.status = status || "PAID";
    await checkout.save();

    console.log(`✅ Checkout ${external_id} diupdate menjadi ${checkout.status}`);

    // ✅ TAMBAHAN: Kirim notifikasi WA berdasarkan status
    try {
      const user = await User.findOne({ email: checkout.email?.toLowerCase().trim() });

      if (user && user.phone) {
        console.log("📦 Checkout items:", JSON.stringify(checkout.items, null, 2));
        
        // Pastikan items ada dan array
        let itemsList = "Tidak ada item";
        if (checkout.items && Array.isArray(checkout.items) && checkout.items.length > 0) {
          itemsList = checkout.items
            .map((item) => `• ${item.name || "Produk"} x${item.qty || 1}`)
            .join("\n");
        }

        console.log("📋 Items list yang akan dikirim:", itemsList);

        // Notifikasi untuk PAID
        if (checkout.status === "PAID" || checkout.status === "SETTLED") {
          const paidMessage = `
✅ *PEMBAYARAN BERHASIL*

Halo *${user.name}*,
Pembayaran Anda telah diterima!

🎉 *Invoice Details:*
📦 Order ID: *${external_id}*
💰 Total: *${formatRupiah(checkout.total)}*
💳 Metode: ${payload.payment_method || "-"}
🏦 Channel: ${payload.payment_channel || "-"}
📅 Tanggal: ${formatDate(payload.paid_at || new Date())}

📋 *Item yang dibeli:*
${itemsList || "Tidak ada item"}

Terima kasih telah berbelanja!
Pesanan Anda akan segera diproses. 🚀
          `.trim();

          await sendWhatsAppNotification(user.phone, paidMessage);
        }
        // Notifikasi untuk EXPIRED
        else if (checkout.status === "EXPIRED") {
          const expiredMessage = `
⏰ *INVOICE KADALUARSA*

Halo *${user.name}*,

Invoice Anda telah kadaluarsa.

Order ID: *${external_id}*
Total: *${formatRupiah(checkout.total)}*

Silakan buat pesanan baru jika masih berminat.
          `.trim();

          await sendWhatsAppNotification(user.phone, expiredMessage);
        }
      }
    } catch (waErr) {
      // Jangan ganggu flow utama kalau WA gagal
      console.error("⚠️ Gagal kirim WA webhook:", waErr.message);
    }

    // ✅ LOGIC ORIGINAL: Return response
    return res.status(200).json({ 
      message: "Webhook processed", 
      external_id, 
      new_status: checkout.status 
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      message: "Internal Server Error", 
      error: error.message 
    });
  }
}