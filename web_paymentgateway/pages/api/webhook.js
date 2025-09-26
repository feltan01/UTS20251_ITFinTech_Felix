// import dbConnect from "../../lib/mongodb";
// import Checkout from "../../models/Checkout";

// export default async function handler(req, res) {
//   if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

//   await dbConnect();

//   try {
//     const event = req.body;
//     console.log("Webhook event received:", event);

//     const externalId = event.external_id;
//     if (!externalId) return res.status(400).json({ error: "external_id not found" });

//     let checkout = await Checkout.findOne({ external_id: externalId });

//     // Buat checkout otomatis kalau belum ada
//     if (!checkout) {
//       checkout = await Checkout.create({
//         external_id: externalId,
//         user_id: event.user_id || "unknown",
//         amount: event.amount || 0,
//         status: event.status === "PAID" ? "LUNAS" : "PENDING",
//         payment_method: event.payment_method,
//         paid_at: event.paid_at ? new Date(event.paid_at) : null,
//       });
//       console.log(`Checkout ${externalId} created automatically`);
//     } else if (event.status === "PAID") {
//       checkout.status = "LUNAS";
//       checkout.paid_at = new Date(event.paid_at);
//       checkout.payment_method = event.payment_method;
//       checkout.updated_at = new Date();
//       await checkout.save();
//       console.log(`Checkout ${externalId} marked as LUNAS`);
//     }

//     res.status(200).json({ received: true });
//   } catch (err) {
//     console.error("Error processing webhook:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// }


import dbConnect from "../../lib/mongodb";
import Checkout from "../../models/Checkout";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  
  await dbConnect();
  
  try {
    const event = req.body;
    console.log("=== WEBHOOK DEBUG ===");
    console.log("Full event:", JSON.stringify(event, null, 2));
    console.log("Event status:", event.status);
    
    const externalId = event.external_id;
    if (!externalId) return res.status(400).json({ error: "external_id not found" });
    
    let checkout = await Checkout.findOne({ external_id: externalId });
    console.log("Found existing checkout:", checkout);
    
    if (!checkout) {
      console.log("Creating new checkout...");
      try {
        checkout = await Checkout.create({
          external_id: externalId,
          user_id: event.user_id || "unknown",
          amount: event.amount || 0,
          status: event.status === "PAID" ? "LUNAS" : "PENDING",
          payment_method: event.payment_method || "unknown",
          paid_at: event.paid_at ? new Date(event.paid_at) : null,
        });
        console.log("Checkout created successfully:", checkout);
      } catch (createError) {
        console.error("Error creating checkout:", createError);
        return res.status(500).json({ error: "Failed to create checkout" });
      }
    } else if (event.status === "PAID") {
      console.log("Updating existing checkout to LUNAS...");
      checkout.status = "LUNAS";
      checkout.paid_at = new Date(event.paid_at || Date.now());
      checkout.payment_method = event.payment_method || checkout.payment_method;
      checkout.updated_at = new Date();
      
      try {
        await checkout.save();
        console.log(`Checkout ${externalId} marked as LUNAS`);
      } catch (updateError) {
        console.error("Error updating checkout:", updateError);
        return res.status(500).json({ error: "Failed to update checkout" });
      }
    }
    
    res.status(200).json({ received: true });
  } catch (err) {
    console.error("Error processing webhook:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}