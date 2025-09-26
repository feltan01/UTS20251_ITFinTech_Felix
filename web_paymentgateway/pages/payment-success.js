import { useEffect, useState } from "react";

export default function PaymentSuccess() {
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const invoiceId = params.get("invoice_id");
    if (!invoiceId) return;

    fetch(`/api/getInvoice?id=${invoiceId}`)
      .then(res => res.json())
      .then(data => setInvoice(data))
      .catch(err => console.error(err));
  }, []);

  if (!invoice) return <p>Memuat data pembayaran...</p>;

  return (
    <div style={{ textAlign: "center", marginTop: 50 }}>
      <h1>✅ Pembayaran Berhasil</h1>
      <p>Invoice ID: {invoice.id}</p>
      <p>Jumlah: Rp{invoice.amount.toLocaleString()}</p>
      <p>Status: {invoice.status}</p>
      <a href="/">← Kembali ke Home</a>
    </div>
  );
}
