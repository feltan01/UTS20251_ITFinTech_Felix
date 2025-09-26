import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function CheckoutPage(){
  const router = useRouter();
  const [cart, setCart] = useState([]);

  useEffect(()=> {
    try { setCart(JSON.parse(localStorage.getItem('cart') || '[]')); } catch(e){ setCart([]); }
  }, []);

  const changeQty = (productId, qty) => setCart(prev => prev.map(i => i.product === productId ? {...i, quantity: qty} : i));
  const removeItem = (productId) => setCart(prev => prev.filter(i => i.product !== productId));

  const confirmCheckout = async () => {
    const res = await fetch('/api/checkout', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ items: cart.map(i => ({ productId: i.product, quantity: i.quantity })) })
    });
    if (res.ok) {
      const checkout = await res.json();
      localStorage.removeItem('cart');
      router.push(`/payment?checkoutId=${checkout._id}`);
    } else {
      alert('Gagal membuat checkout');
    }
  };

  const total = cart.reduce((s,i)=> s + i.price*i.quantity, 0);

  return (
    <div style={{padding:20}}>
      <h1>Checkout</h1>
      {cart.length===0 ? <div>Keranjang kosong. <a href="/">Pilih barang</a></div> : null}
      {cart.map(i=>(
        <div key={i.product} style={{borderBottom:'1px solid #ddd',padding:8}}>
          <div>{i.name}</div>
          <div>Rp {i.price.toLocaleString()}</div>
          <input type="number" value={i.quantity} min={1} onChange={e => changeQty(i.product, +e.target.value)} />
          <button onClick={() => removeItem(i.product)}>Hapus</button>
        </div>
      ))}
      <div style={{marginTop:12}}>Total: Rp {total.toLocaleString()}</div>
      <button disabled={!cart.length} onClick={confirmCheckout}>Confirm & Create Checkout</button>
    </div>
  );
}
