import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function PaymentPage(){
  const router = useRouter();
  const { checkoutId } = router.query;
  const [checkout, setCheckout] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    if (!checkoutId) return;
    fetch(`/api/checkout/${checkoutId}`).then(r=>r.json()).then(setCheckout);
  },[checkoutId]);

  const createInvoice = async () => {
    setLoading(true);
    const res = await fetch('/api/payments/create', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ checkoutId, payerEmail: 'buyer@example.com' })
    });
    const data = await res.json();
    setLoading(false);
    if (data.invoice) {
      const url = data.invoice.invoice_url || data.invoice.hosted_url || data.invoice.url || data.invoice.external_url;
      if (url) window.open(url, '_blank');
      else console.log('invoice created', data);
    } else {
      alert('Gagal membuat invoice. cek console.');
      console.error(data);
    }
  };

  if (!checkout) return <div>Loading...</div>;
  return (
    <div style={{padding:20}}>
      <h1>Payment</h1>
      <div>Checkout ID: {checkout._id}</div>
      <div>Status: {checkout.status}</div>
      <div>Total: Rp {checkout.total?.toLocaleString()}</div>
      <button onClick={createInvoice} disabled={checkout.status === 'paid' || loading}>
        {checkout.status === 'paid' ? 'Sudah Lunas' : 'Bayar via Xendit'}
      </button>
    </div>
  );
}
