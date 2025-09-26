import { useEffect, useState } from "react";
import Script from "next/script";

export default function CheckoutPage() {
  const [checkout, setCheckout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Load checkout data
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (!id) return;

    fetch(`/api/checkout?id=${id}`)
      .then(res => res.json())
      .then(data => {
        setCheckout(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Gagal memuat checkout");
        setLoading(false);
      });
  }, []);

  // Payment handler
  const handlePayment = async () => {
    if (!checkout) return;
    setPaymentLoading(true);
    setError("");

    try {
      const res = await fetch("/api/createInvoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: checkout.total,
          description: "Pembayaran produk",
          email: checkout.email || "test@example.com",
        }),
      });

      const data = await res.json();

      // ❌ Jangan cek res.ok, langsung pakai field invoiceUrl
      const invoiceUrl = data.invoiceUrl || data.invoice_url;

      if (invoiceUrl) {
        // Redirect ke halaman Xendit
        window.location.href = invoiceUrl;
      } else {
        console.error("Invoice tidak tersedia:", data);
        setError(data.error || "Invoice tidak tersedia");
      }
    } catch (err) {
      console.error("Error handlePayment:", err);
      setError("Terjadi kesalahan saat membuat pembayaran");
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) return <p>Loading checkout...</p>;

  return (
    <>
      <Script src="https://js.xendit.co/v1/xendit.min.js" strategy="beforeInteractive" />

      <div style={{ textAlign: "center", marginTop: 50 }}>
        <h1>Checkout</h1>
        {checkout && checkout.items.map((item, i) => (
          <p key={i}>{item.name} x {item.qty} - Rp{item.price.toLocaleString()}</p>
        ))}
        <h3>Total: Rp{checkout?.total?.toLocaleString()}</h3>
        <button 
          onClick={handlePayment} 
          disabled={paymentLoading}
          style={{
            padding: "12px 24px",
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          {paymentLoading ? "Memproses..." : "Bayar Sekarang"}
        </button>

        {error && <p style={{ color: "red", marginTop: 12 }}>{error}</p>}
      </div>
    </>
  );
}
