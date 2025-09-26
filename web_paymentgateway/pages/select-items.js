import { useEffect, useState } from "react";
import Link from "next/link";

export default function SelectItems() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Gagal memuat produk");
        setLoading(false);
      });
  }, []);

  function addToCart(product) {
    const existing = cart.find(item => item._id === product._id);
    if (existing) {
      setCart(cart.map(item => item._id === product._id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  }

  function removeFromCart(id) {
    setCart(cart.filter(item => item._id !== id));
  }

  function updateQuantity(id, qty) {
    if (qty <= 0) return removeFromCart(id);
    setCart(cart.map(item => item._id === id ? { ...item, qty } : item));
  }

  function getTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  }

  async function handleCheckout() {
    if (!cart.length) return;
    setCheckoutLoading(true);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          email: "test@example.com" // nanti bisa diganti pakai user login
        }),
      });

      const data = await res.json();
      if (data._id) {
        window.location.href = `/checkout?id=${data._id}`;
      } else {
        setError(data.error || "Gagal membuat checkout");
      }
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan saat checkout");
    } finally {
      setCheckoutLoading(false);
    }
  }

  if (loading) return <p style={{ textAlign: "center" }}>Loading products...</p>;
  if (error) return <p style={{ color: "red", textAlign: "center" }}>⚠️ {error}</p>;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 20 }}>
      <Link href="/">← Kembali ke Home</Link>
      <h1>🛍️ Pilih Produk</h1>

      <div style={{ display: "flex", gap: 30, flexWrap: "wrap" }}>
        {/* Products */}
        <div style={{ flex: 2, minWidth: 300 }}>
          <h2>Produk Tersedia</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20 }}>
            {products.map(p => (
              <div key={p._id} style={{ padding: 20, border: "1px solid #dee2e6", borderRadius: 8, background: "#f8f9fa" }}>
                <h3>{p.name}</h3>
                <p style={{ fontWeight: "bold", color: "#28a745" }}>Rp{p.price.toLocaleString()}</p>
                <button onClick={() => addToCart(p)} style={{ width: "100%", padding: 10, borderRadius: 6, background: "#007bff", color: "white", cursor: "pointer" }}>
                  + Tambah ke Keranjang
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Cart */}
        <div style={{ flex: 1, minWidth: 300, position: "sticky", top: 20, height: "fit-content" }}>
          <div style={{ padding: 20, border: "2px solid #dee2e6", borderRadius: 8, background: "#fff" }}>
            <h2>🛒 Keranjang ({cart.reduce((s, i) => s + i.qty, 0)})</h2>
            {cart.length === 0 ? (
              <p style={{ textAlign: "center" }}>Keranjang masih kosong</p>
            ) : (
              <>
                {cart.map((item) => (
                  <div key={item._id} style={{ padding: 10, border: "1px solid #dee2e6", borderRadius: 6, marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <h4>{item.name}</h4>
                      <button onClick={() => removeFromCart(item._id)}>×</button>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <button onClick={() => updateQuantity(item._id, item.qty - 1)}>-</button>
                        <span>{item.qty}</span>
                        <button onClick={() => updateQuantity(item._id, item.qty + 1)}>+</button>
                      </div>
                      <div>Rp{(item.price * item.qty).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
                <div style={{ fontWeight: "bold", display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <span>Total:</span>
                  <span>Rp{getTotal().toLocaleString()}</span>
                </div>
                <button onClick={handleCheckout} disabled={checkoutLoading} style={{ width: "100%", padding: 12, background: "#28a745", color: "white", borderRadius: 6, cursor: "pointer" }}>
                  {checkoutLoading ? "Memproses..." : "Lanjut ke Checkout →"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
