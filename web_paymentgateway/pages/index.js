import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then(setProducts);
    try { setCart(JSON.parse(localStorage.getItem('cart') || '[]')); } catch(e){ setCart([]); }
  }, []);

  useEffect(() => { localStorage.setItem('cart', JSON.stringify(cart)); }, [cart]);

  const addToCart = p => {
    setCart(prev => {
      const exists = prev.find(i => i.product === p._id);
      if (exists) return prev.map(i => i.product === p._id ? {...i, quantity: i.quantity + 1 } : i);
      return [...prev, { product: p._id, name: p.name, price: p.price, quantity: 1 }];
    });
  };

  return (
    <div style={{padding:20}}>
      <h1>Select Items</h1>
      <Link href="/checkout"><a>Go to Checkout ({cart.reduce((s,i)=>s+i.quantity,0)})</a></Link>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginTop:12}}>
        {products.map(p => <ProductCard key={p._id} product={p} onAdd={addToCart} />)}
      </div>
    </div>
  );
}
