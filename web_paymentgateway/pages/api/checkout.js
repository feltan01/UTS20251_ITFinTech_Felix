// import dbConnect from "../../lib/mongodb";
// import Checkout from "../../models/Checkout";
// import User from "../../models/User";
// import { v4 as uuidv4 } from "uuid";
// import axios from "axios";

// const XENDIT_API_KEY = process.env.XENDIT_SECRET_KEY;
// const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL?.trim();
// const FONNTE_TOKEN = process.env.FONNTE_TOKEN;

// // ✅ Fungsi helper untuk kirim WA via Fonnte
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

// export default async function handler(req, res) {
//   await dbConnect();

//   // === [POST] BUAT CHECKOUT BARU ===
//   if (req.method === "POST") {
//     try {
//       const { items } = req.body;

//       // ✅ DEBUG: Log request body
//       console.log("📥 Request body:", JSON.stringify(req.body, null, 2));
//       console.log("📦 Items received:", items?.length || 0);

//       if (!items || items.length === 0) {
//         return res.status(400).json({ error: "Cart kosong" });
//       }

//       // ✅ AMBIL EMAIL DARI BERBAGAI SUMBER (prioritas berurutan)
//       let email = null;
//       let authSource = "unknown";

//       // 1. Dari req.body (jika dikirim dari frontend)
//       if (req.body.email) {
//         email = req.body.email;
//         authSource = "request_body";
//       }
//       // 2. Dari session/cookies (next-auth, express-session, dll)
//       else if (req.session?.user?.email) {
//         email = req.session.user.email;
//         authSource = "session";
//       }
//       // 3. Dari Authorization header (JWT token)
//       else if (req.headers.authorization) {
//         try {
//           // Decode JWT token (jika pakai JWT)
//           const token = req.headers.authorization.replace("Bearer ", "");
//           const decoded = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
//           email = decoded.email;
//           authSource = "jwt_token";
//         } catch (jwtErr) {
//           console.warn("⚠️ Failed to decode JWT token");
//         }
//       }
//       // 4. Dari cookies langsung
//       else if (req.cookies?.userEmail) {
//         email = req.cookies.userEmail;
//         authSource = "cookies";
//       }

//       console.log("🔐 Auth source:", authSource);
//       console.log("📧 Email resolved:", email);

//       // ✅ Validasi email harus ada
//       if (!email) {
//         return res.status(401).json({ 
//           error: "User tidak terautentikasi. Silakan login terlebih dahulu.",
//           hint: "Email tidak ditemukan dari session, token, atau request body"
//         });
//       }

//       const total = items.reduce(
//         (sum, item) => sum + item.price * (item.qty || 1),
//         0
//       );

//       // ✅ Gunakan UUID untuk external_id
//       const external_id = `order-${uuidv4()}`;

//       // ✅ Query user SEKALI di awal (untuk efisiensi & konsistensi)
//       let user = null;
//       try {
//         user = await User.findOne({ email: email.toLowerCase().trim() });
//         if (user) {
//           console.log("👤 User ditemukan:", user.name, user.phone);
//         } else {
//           console.log("⚠️ User tidak ditemukan untuk email:", email);
//           // Tetap lanjut checkout meskipun user tidak ditemukan di DB
//           // (mungkin guest checkout atau data belum sync)
//         }
//       } catch (userErr) {
//         console.error("⚠️ Error saat mencari user:", userErr.message);
//       }

//       // Simpan ke database terlebih dahulu
//       const checkout = await Checkout.create({
//         email,
//         items,
//         total,
//         external_id,
//         status: "PENDING",
//       });

//       // ✅ TAMBAHAN: Kirim WA notifikasi checkout (menggunakan user yang sudah di-query)
//       if (user && user.phone) {
//         try {
//           const itemsList = items
//             .map((item) => `• ${item.name} x${item.qty || 1} = ${formatRupiah(item.price * (item.qty || 1))}`)
//             .join("\n");

//           const checkoutMessage = `
// 🛒 *CHECKOUT BERHASIL*

// Halo *${user.name}*,
// Terima kasih telah berbelanja!

// 📦 *Detail Pesanan:*
// ${itemsList}

// 💰 *Total:* ${formatRupiah(total)}
// 🔖 *Order ID:* ${external_id}

// Status: ⏳ Menunggu Pembayaran

// Silakan lanjutkan pembayaran untuk memproses pesanan Anda.
//           `.trim();

//           await sendWhatsAppNotification(user.phone, checkoutMessage);
//         } catch (waErr) {
//           console.error("⚠️ Gagal kirim WA checkout:", waErr.message);
//         }
//       }

//       // Kalau Xendit belum dikonfigurasi, langsung return saja
//       if (!XENDIT_API_KEY || !BASE_URL) {
//         console.warn("⚠️ Xendit tidak dikonfigurasi — invoice dilewati");
//         return res.status(201).json({
//           success: true,
//           checkout,
//         });
//       }

//       // === BUAT INVOICE DI XENDIT ===
//       const xenditPayload = {
//         external_id,
//         amount: total,
//         payer_email: email, // ✅ Gunakan email yang sudah di-resolve
//         description: `Pembayaran untuk pesanan ${external_id}`,
//         invoice_duration: 86400, // 24 jam
//         success_redirect_url: `${BASE_URL}/payment-success?order_id=${checkout._id}`,
//         failure_redirect_url: `${BASE_URL}/payment-failed`,
//         currency: "IDR",
//         items: items.map((item) => ({
//           name: item.name,
//           quantity: item.qty || 1,
//           price: item.price,
//           category: "product",
//         })),
//       };

//       console.log("📤 Mengirim payload ke Xendit:", xenditPayload);

//       const xenditResponse = await fetch("https://api.xendit.co/v2/invoices", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Basic ${Buffer.from(XENDIT_API_KEY + ":").toString(
//             "base64"
//           )}`,
//         },
//         body: JSON.stringify(xenditPayload),
//       });

//       const xenditData = await xenditResponse.json();

//       if (!xenditResponse.ok) {
//         console.error("❌ Gagal membuat invoice Xendit:", xenditData);
//         return res.status(500).json({
//           success: false,
//           message: "Gagal membuat invoice di Xendit",
//           error: xenditData,
//         });
//       }

//       // Update checkout dengan data invoice Xendit
//       checkout.xendit_invoice_id = xenditData.id;
//       checkout.invoice_url = (xenditData.invoice_url || "").trim();
//       await checkout.save();

//       console.log("✅ Checkout dan invoice tersimpan:", checkout._id);

//       // ✅ TAMBAHAN: Kirim WA dengan link invoice (menggunakan user yang sudah di-query)
//       if (user && user.phone) {
//         try {
//           const invoiceMessage = `
// 💳 *INVOICE PEMBAYARAN*

// Halo *${user.name}*,

// Order ID: *${external_id}*
// Total: *${formatRupiah(total)}*

// 🔗 Link Pembayaran:
// ${checkout.invoice_url}

// ⏰ Berlaku hingga 24 jam ke depan.

// Segera lakukan pembayaran untuk memproses pesanan Anda!
//           `.trim();

//           await sendWhatsAppNotification(user.phone, invoiceMessage);
//         } catch (waErr) {
//           console.error("⚠️ Gagal kirim WA invoice:", waErr.message);
//         }
//       }

//       return res.status(201).json({
//         success: true,
//         checkout,
//       });
//     } catch (err) {
//       console.error("❌ Error di checkout:", err);
//       return res.status(500).json({ error: err.message });
//     }
//   }

//   // === [GET] CEK STATUS CHECKOUT ===
//   if (req.method === "GET") {
//     const { id } = req.query;

//     if (!id) {
//       return res.status(400).json({ error: "Checkout ID dibutuhkan" });
//     }

//     try {
//       const checkout = await Checkout.findById(id);

//       if (!checkout) {
//         return res.status(404).json({ error: "Checkout tidak ditemukan" });
//       }

//       return res.status(200).json(checkout);
//     } catch (err) {
//       console.error("❌ Get checkout error:", err);
//       return res.status(500).json({ error: err.message });
//     }
//   }

//   // === DEFAULT ===
//   return res.status(405).json({ error: "Method not allowed" });
// }

import dbConnect from "../../lib/mongodb";
import Checkout from "../../models/Checkout";
import User from "../../models/User";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

const XENDIT_API_KEY = process.env.XENDIT_SECRET_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL?.trim();
const FONNTE_TOKEN = process.env.FONNTE_TOKEN;

// ✅ Fungsi helper untuk kirim WA via Fonnte
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

export default async function handler(req, res) {
  await dbConnect();

  // === [POST] BUAT CHECKOUT BARU ===
  if (req.method === "POST") {
    try {
      const { items } = req.body;

      // ✅ DEBUG: Log request body
      console.log("📥 Request body:", JSON.stringify(req.body, null, 2));
      console.log("📦 Items received:", items?.length || 0);

      if (!items || items.length === 0) {
        return res.status(400).json({ error: "Cart kosong" });
      }

      // ✅ AMBIL EMAIL DARI BERBAGAI SUMBER (prioritas berurutan)
      let email = null;
      let authSource = "unknown";

      // 1. Dari req.body (jika dikirim dari frontend)
      if (req.body.email) {
        email = req.body.email;
        authSource = "request_body";
      }
      // 2. Dari session/cookies (next-auth, express-session, dll)
      else if (req.session?.user?.email) {
        email = req.session.user.email;
        authSource = "session";
      }
      // 3. Dari Authorization header (JWT token)
      else if (req.headers.authorization) {
        try {
          // Decode JWT token (jika pakai JWT)
          const token = req.headers.authorization.replace("Bearer ", "");
          const decoded = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
          email = decoded.email;
          authSource = "jwt_token";
        } catch (jwtErr) {
          console.warn("⚠️ Failed to decode JWT token");
        }
      }
      // 4. Dari cookies langsung
      else if (req.cookies?.userEmail) {
        email = req.cookies.userEmail;
        authSource = "cookies";
      }

      console.log("🔐 Auth source:", authSource);
      console.log("📧 Email resolved:", email);

      // ✅ Validasi email harus ada
      if (!email) {
        return res.status(401).json({ 
          error: "User tidak terautentikasi. Silakan login terlebih dahulu.",
          hint: "Email tidak ditemukan dari session, token, atau request body"
        });
      }

      const total = items.reduce(
        (sum, item) => sum + item.price * (item.qty || 1),
        0
      );

      // ✅ Gunakan UUID untuk external_id
      const external_id = `order-${uuidv4()}`;

      // ✅ Query user SEKALI di awal (untuk efisiensi & konsistensi)
      let user = null;
      try {
        user = await User.findOne({ email: email.toLowerCase().trim() });
        if (user) {
          console.log("👤 User ditemukan:", user.name, user.phone);
        } else {
          console.log("⚠️ User tidak ditemukan untuk email:", email);
          // Tetap lanjut checkout meskipun user tidak ditemukan di DB
          // (mungkin guest checkout atau data belum sync)
        }
      } catch (userErr) {
        console.error("⚠️ Error saat mencari user:", userErr.message);
      }

      // Simpan ke database terlebih dahulu
      const checkout = await Checkout.create({
        email,
        items,
        total,
        external_id,
        status: "PENDING",
      });

      // ✅ TAMBAHAN: Kirim WA notifikasi checkout (menggunakan user yang sudah di-query)
      if (user && user.phone) {
        try {
          console.log("📦 Items untuk WA:", JSON.stringify(items, null, 2));
          
          // Pastikan items ada dan valid
          let itemsList = "Tidak ada item";
          if (items && Array.isArray(items) && items.length > 0) {
            itemsList = items
              .map((item) => `• ${item.name || "Produk"} x${item.qty || 1} = ${formatRupiah(item.price * (item.qty || 1))}`)
              .join("\n");
          }

          console.log("📋 Items list yang akan dikirim:", itemsList);

          const checkoutMessage = `
🛒 *CHECKOUT BERHASIL*

Halo *${user.name}*,
Terima kasih telah berbelanja!

📦 *Detail Pesanan:*
${itemsList}

💰 *Total:* ${formatRupiah(total)}
🔖 *Order ID:* ${external_id}

Status: ⏳ Menunggu Pembayaran

Silakan lanjutkan pembayaran untuk memproses pesanan Anda.
          `.trim();

          await sendWhatsAppNotification(user.phone, checkoutMessage);
        } catch (waErr) {
          console.error("⚠️ Gagal kirim WA checkout:", waErr.message);
        }
      }

      // Kalau Xendit belum dikonfigurasi, langsung return saja
      if (!XENDIT_API_KEY || !BASE_URL) {
        console.warn("⚠️ Xendit tidak dikonfigurasi — invoice dilewati");
        return res.status(201).json({
          success: true,
          checkout,
        });
      }

      // === BUAT INVOICE DI XENDIT ===
      const xenditPayload = {
        external_id,
        amount: total,
        payer_email: email, // ✅ Gunakan email yang sudah di-resolve
        description: `Pembayaran untuk pesanan ${external_id}`,
        invoice_duration: 86400, // 24 jam
        success_redirect_url: `${BASE_URL}/payment-success?order_id=${checkout._id}`,
        failure_redirect_url: `${BASE_URL}/payment-failed`,
        currency: "IDR",
        items: items.map((item) => ({
          name: item.name,
          quantity: item.qty || 1,
          price: item.price,
          category: "product",
        })),
      };

      console.log("📤 Mengirim payload ke Xendit:", xenditPayload);

      const xenditResponse = await fetch("https://api.xendit.co/v2/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(XENDIT_API_KEY + ":").toString(
            "base64"
          )}`,
        },
        body: JSON.stringify(xenditPayload),
      });

      const xenditData = await xenditResponse.json();

      if (!xenditResponse.ok) {
        console.error("❌ Gagal membuat invoice Xendit:", xenditData);
        return res.status(500).json({
          success: false,
          message: "Gagal membuat invoice di Xendit",
          error: xenditData,
        });
      }

      // Update checkout dengan data invoice Xendit
      checkout.xendit_invoice_id = xenditData.id;
      checkout.invoice_url = (xenditData.invoice_url || "").trim();
      await checkout.save();

      console.log("✅ Checkout dan invoice tersimpan:", checkout._id);

      // ✅ TAMBAHAN: Kirim WA dengan link invoice (menggunakan user yang sudah di-query)
      if (user && user.phone) {
        try {
          const invoiceMessage = `
💳 *INVOICE PEMBAYARAN*

Halo *${user.name}*,

Order ID: *${external_id}*
Total: *${formatRupiah(total)}*

🔗 Link Pembayaran:
${checkout.invoice_url}

⏰ Berlaku hingga 24 jam ke depan.

Segera lakukan pembayaran untuk memproses pesanan Anda!
          `.trim();

          await sendWhatsAppNotification(user.phone, invoiceMessage);
        } catch (waErr) {
          console.error("⚠️ Gagal kirim WA invoice:", waErr.message);
        }
      }

      return res.status(201).json({
        success: true,
        checkout,
      });
    } catch (err) {
      console.error("❌ Error di checkout:", err);
      return res.status(500).json({ error: err.message });
    }
  }

  // === [GET] CEK STATUS CHECKOUT ===
  if (req.method === "GET") {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: "Checkout ID dibutuhkan" });
    }

    try {
      const checkout = await Checkout.findById(id);

      if (!checkout) {
        return res.status(404).json({ error: "Checkout tidak ditemukan" });
      }

      return res.status(200).json(checkout);
    } catch (err) {
      console.error("❌ Get checkout error:", err);
      return res.status(500).json({ error: err.message });
    }
  }

  // === DEFAULT ===
  return res.status(405).json({ error: "Method not allowed" });
}