// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/router";

// export default function SelectItems() {
//   const router = useRouter();
//   const [products, setProducts] = useState([]);
//   const [cart, setCart] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [checkoutLoading, setCheckoutLoading] = useState(false);
  
//   // ✅ TAMBAHAN: State untuk modal login
//   const [showLoginModal, setShowLoginModal] = useState(false);
//   const [authMode, setAuthMode] = useState('login');
//   const [showMFA, setShowMFA] = useState(false);
//   const [pendingAuth, setPendingAuth] = useState(null);
//   const [user, setUser] = useState(null);
  
//   // Form states untuk login
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     password: '',
//     mfaCode: ''
//   });
//   const [authLoading, setAuthLoading] = useState(false);
//   const [authError, setAuthError] = useState('');

//   useEffect(() => {
//     // Check if user is logged in
//     const storedUser = localStorage.getItem('user');
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }

//     // Load products
//     fetch("/api/products")
//       .then(res => res.json())
//       .then(data => {
//         setProducts(data);
//         setLoading(false);
//       })
//       .catch(err => {
//         console.error(err);
//         setError("Gagal memuat produk");
//         setLoading(false);
//       });
//   }, []);

//   function addToCart(product) {
//     const existing = cart.find(item => item._id === product._id);
//     if (existing) {
//       setCart(cart.map(item => item._id === product._id ? { ...item, qty: item.qty + 1 } : item));
//     } else {
//       setCart([...cart, { ...product, qty: 1 }]);
//     }
//   }

//   function removeFromCart(id) {
//     setCart(cart.filter(item => item._id !== id));
//   }

//   function updateQuantity(id, qty) {
//     if (qty <= 0) return removeFromCart(id);
//     setCart(cart.map(item => item._id === id ? { ...item, qty } : item));
//   }

//   function getTotal() {
//     return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
//   }

//   // ✅ FUNGSI LOGIN
//   const handleInputChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     setAuthError('');
//   };

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     setAuthLoading(true);
//     setAuthError('');

//     try {
//       const res = await fetch('/api/auth/register', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           name: formData.name,
//           email: formData.email,
//           phone: formData.phone,
//           password: formData.password
//         })
//       });

//       const data = await res.json();

//       if (res.ok) {
//         alert('✅ Registrasi berhasil! Silakan login.');
//         setAuthMode('login');
//         setFormData({ ...formData, password: '' });
//       } else {
//         setAuthError(data.error || 'Registrasi gagal');
//       }
//     } catch (err) {
//       setAuthError('Terjadi kesalahan. Coba lagi.');
//     } finally {
//       setAuthLoading(false);
//     }
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setAuthLoading(true);
//     setAuthError('');

//     try {
//       const res = await fetch('/api/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           email: formData.email,
//           password: formData.password
//         })
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setPendingAuth(data.user);
//         setShowMFA(true);
//         alert('📱 Kode verifikasi telah dikirim ke WhatsApp Anda!');
//       } else {
//         setAuthError(data.error || 'Login gagal');
//       }
//     } catch (err) {
//       setAuthError('Terjadi kesalahan. Coba lagi.');
//     } finally {
//       setAuthLoading(false);
//     }
//   };

//   const handleVerifyMFA = async (e) => {
//     e.preventDefault();
//     setAuthLoading(true);
//     setAuthError('');

//     if (!pendingAuth?.email) {
//       setAuthError('Email user tidak ditemukan, login ulang');
//       setAuthLoading(false);
//       return;
//     }

//     try {
//       const res = await fetch('/api/auth/verify-mfa', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           email: pendingAuth.email,
//           code: formData.mfaCode
//         })
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setAuthError(data.error || 'Kode verifikasi salah');
//       } else {
//         localStorage.setItem('user', JSON.stringify(pendingAuth));
//         setUser(pendingAuth);
//         setShowLoginModal(false);
//         setShowMFA(false);
//         setFormData({ name: '', email: '', phone: '', password: '', mfaCode: '' });
//         alert('✅ Login berhasil! Silakan lanjutkan checkout.');
        
//         // ✅ Langsung proses checkout setelah login
//         setTimeout(() => {
//           handleCheckout();
//         }, 500);
//       }
//     } catch (err) {
//       console.error(err);
//       setAuthError('Terjadi kesalahan. Coba lagi.');
//     } finally {
//       setAuthLoading(false);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('user');
//     setUser(null);
//     alert('👋 Anda telah logout');
//   };

//   // ✅ MODIFIKASI: Cek login sebelum checkout
//   async function handleCheckout() {
//     if (!cart.length) return;
    
//     // ✅ CEK LOGIN DULU
//     const storedUser = localStorage.getItem('user');
//     if (!storedUser) {
//       setShowLoginModal(true);
//       alert('🔐 Silakan login terlebih dahulu untuk melakukan checkout');
//       return;
//     }

//     setCheckoutLoading(true);
//     setError("");

//     const userData = JSON.parse(storedUser);
//     const userEmail = userData.email;
    
//     if (!userEmail) {
//       setError("Email tidak ditemukan. Silakan login ulang.");
//       setCheckoutLoading(false);
//       return;
//     }

//     const items = cart.map(item => ({
//       name: item.name,
//       price: item.price,
//       qty: item.qty
//     }));

//     console.log("🛒 Checkout items:", items);
//     console.log("📧 Email:", userEmail);

//     try {
//       const res = await fetch("/api/checkout", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           items: items,
//           email: userEmail
//         }),
//       });

//       const data = await res.json();

//       if (res.ok && data.success && data.checkout) {
//         if (data.checkout.invoice_url) {
//           window.location.href = data.checkout.invoice_url;
//         } else {
//           window.location.href = `/checkout?id=${data.checkout._id}`;
//         }
//       } else {
//         setError(data.error || data.hint || "Gagal membuat checkout");
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Terjadi kesalahan saat checkout");
//     } finally {
//       setCheckoutLoading(false);
//     }
//   }

//   if (loading) return (
//     <div className="loading-container">
//       <div className="loading-spinner"></div>
//       <p className="loading-text">Loading products...</p>
//     </div>
//   );
  
//   if (error && !products.length) return (
//     <div className="error-container">
//       <div className="error-content">
//         <div className="error-icon">⚠️</div>
//         <p className="error-text">{error}</p>
//         <Link href="/" className="btn btn-secondary">
//           Kembali ke Home
//         </Link>
//       </div>
//     </div>
//   );

//   return (
//     <>
//       <div className="container">
//         <header className="page-header">
//           <Link href="/" className="back-link">
//             <span className="back-icon">←</span>
//             <span>Kembali ke Home</span>
//           </Link>
//           <h1 className="page-title">
//             <span className="title-icon">🛍️</span>
//             Felix Shop
//           </h1>
//           {/* ✅ TAMBAHAN: Tampilkan info user atau tombol login */}
//           <div className="user-section">
//             {user ? (
//               <div className="user-info">
//                 <span className="user-name">👋 {user.name}</span>
//                 <button className="btn-small btn-logout" onClick={handleLogout}>
//                   🚪 Logout
//                 </button>
//               </div>
//             ) : (
//               <button className="btn-small btn-login" onClick={() => setShowLoginModal(true)}>
//                 🔐 Login
//               </button>
//             )}
//           </div>
//         </header>

//         {/* ✅ TAMBAHAN: Login Modal */}
//         {showLoginModal && (
//           <div className="modal-overlay" onClick={() => setShowLoginModal(false)}>
//             <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//               <button className="modal-close" onClick={() => setShowLoginModal(false)}>✕</button>
              
//               {!showMFA ? (
//                 <>
//                   <h2 className="modal-title">
//                     {authMode === 'login' ? '🔐 Login untuk Checkout' : '📝 Register'}
//                   </h2>

//                   {authError && <div className="error-message">{authError}</div>}

//                   <form onSubmit={authMode === 'login' ? handleLogin : handleRegister}>
//                     {authMode === 'register' && (
//                       <>
//                         <div className="form-group">
//                           <label>Nama Lengkap</label>
//                           <input
//                             type="text"
//                             name="name"
//                             value={formData.name}
//                             onChange={handleInputChange}
//                             required
//                             placeholder="John Doe"
//                           />
//                         </div>

//                         <div className="form-group">
//                           <label>Nomor WhatsApp</label>
//                           <input
//                             type="tel"
//                             name="phone"
//                             value={formData.phone}
//                             onChange={handleInputChange}
//                             required
//                             placeholder="628123456789"
//                           />
//                           <small>Format: 628xxx (gunakan kode negara)</small>
//                         </div>
//                       </>
//                     )}

//                     <div className="form-group">
//                       <label>Email</label>
//                       <input
//                         type="email"
//                         name="email"
//                         value={formData.email}
//                         onChange={handleInputChange}
//                         required
//                         placeholder="email@example.com"
//                       />
//                     </div>

//                     <div className="form-group">
//                       <label>Password</label>
//                       <input
//                         type="password"
//                         name="password"
//                         value={formData.password}
//                         onChange={handleInputChange}
//                         required
//                         placeholder="••••••••"
//                         minLength="6"
//                       />
//                     </div>

//                     <button type="submit" className="btn btn-primary btn-full" disabled={authLoading}>
//                       {authLoading ? '⏳ Processing...' : authMode === 'login' ? '🔓 Login' : '📝 Register'}
//                     </button>
//                   </form>

//                   <div className="auth-switch">
//                     {authMode === 'login' ? (
//                       <p>
//                         Belum punya akun?{' '}
//                         <span onClick={() => setAuthMode('register')}>Register disini</span>
//                       </p>
//                     ) : (
//                       <p>
//                         Sudah punya akun?{' '}
//                         <span onClick={() => setAuthMode('login')}>Login disini</span>
//                       </p>
//                     )}
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   <h2 className="modal-title">📱 Verifikasi WhatsApp</h2>
//                   <p className="mfa-info">
//                     Kode verifikasi telah dikirim ke WhatsApp Anda
//                   </p>

//                   {authError && <div className="error-message">{authError}</div>}

//                   <form onSubmit={handleVerifyMFA}>
//                     <div className="form-group">
//                       <label>Kode Verifikasi (6 digit)</label>
//                       <input
//                         type="text"
//                         name="mfaCode"
//                         value={formData.mfaCode}
//                         onChange={handleInputChange}
//                         required
//                         placeholder="123456"
//                         maxLength="6"
//                         className="mfa-input"
//                       />
//                     </div>

//                     <button type="submit" className="btn btn-primary btn-full" disabled={authLoading}>
//                       {authLoading ? '⏳ Verifying...' : '✓ Verify'}
//                     </button>
//                   </form>

//                   <button 
//                     className="btn-link"
//                     onClick={() => {
//                       setShowMFA(false);
//                       setPendingAuth(null);
//                     }}
//                   >
//                     ← Kembali ke login
//                   </button>
//                 </>
//               )}
//             </div>
//           </div>
//         )}

//         <div className="main-content">
//           {/* Products Section */}
//           <section className="products-section">
//             <div className="section-header">
//               <h2 className="section-title">Produk Tersedia</h2>
//               <div className="products-count">{products.length} produk</div>
//             </div>
            
//             <div className="products-grid">
//               {products.map(p => (
//                 <div key={p._id} className="product-card">
//                   <div className="product-content">
//                     <h3 className="product-name">{p.name}</h3>
//                     <p className="product-price">Rp{p.price.toLocaleString()}</p>
//                   </div>
//                   <button 
//                     onClick={() => addToCart(p)} 
//                     className="btn btn-add-cart"
//                   >
//                     <span className="btn-icon">+</span>
//                     <span>Tambah ke Keranjang</span>
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </section>

//           {/* Cart Section */}
//           <aside className="cart-section">
//             <div className="cart-container">
//               <div className="cart-header">
//                 <h2 className="cart-title">
//                   <span className="cart-icon">🛒</span>
//                   Keranjang
//                 </h2>
//                 <div className="cart-badge">
//                   {cart.reduce((s, i) => s + i.qty, 0)}
//                 </div>
//               </div>

//               {cart.length === 0 ? (
//                 <div className="empty-cart">
//                   <div className="empty-icon">🛍️</div>
//                   <p className="empty-text">Keranjang masih kosong</p>
//                   <p className="empty-subtitle">Pilih produk untuk mulai berbelanja</p>
//                 </div>
//               ) : (
//                 <div className="cart-content">
//                   <div className="cart-items">
//                     {cart.map((item) => (
//                       <div key={item._id} className="cart-item">
//                         <div className="item-header">
//                           <h4 className="item-name">{item.name}</h4>
//                           <button 
//                             onClick={() => removeFromCart(item._id)}
//                             className="btn-remove"
//                           >
//                             ×
//                           </button>
//                         </div>
//                         <div className="item-controls">
//                           <div className="quantity-controls">
//                             <button 
//                               onClick={() => updateQuantity(item._id, item.qty - 1)}
//                               className="qty-btn"
//                             >
//                               -
//                             </button>
//                             <span className="qty-display">{item.qty}</span>
//                             <button 
//                               onClick={() => updateQuantity(item._id, item.qty + 1)}
//                               className="qty-btn"
//                             >
//                               +
//                             </button>
//                           </div>
//                           <div className="item-total">
//                             Rp{(item.price * item.qty).toLocaleString()}
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
                  
//                   <div className="cart-summary">
//                     <div className="total-row">
//                       <span className="total-label">Total:</span>
//                       <span className="total-amount">Rp{getTotal().toLocaleString()}</span>
//                     </div>
//                     {/* ✅ Info jika belum login */}
//                     {!user && (
//                       <div className="login-notice">
//                         🔐 Login diperlukan untuk checkout
//                       </div>
//                     )}
//                     <button 
//                       onClick={handleCheckout} 
//                       disabled={checkoutLoading} 
//                       className="btn btn-checkout"
//                     >
//                       {checkoutLoading ? (
//                         <>
//                           <div className="btn-spinner"></div>
//                           <span>Memproses...</span>
//                         </>
//                       ) : (
//                         <>
//                           <span>{user ? 'Bayar Menggunakan Xendit' : 'Login & Bayar'}</span>
//                           <span className="btn-arrow">→</span>
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </aside>
//         </div>
//       </div>

//       <style jsx>{`
//         * {
//           box-sizing: border-box;
//         }

//         .container {
//           min-height: 100vh;
//           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//           font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
//           padding: 2rem 1rem;
//         }

//         .loading-container, .error-container {
//           min-height: 100vh;
//           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
//         }

//         .loading-spinner {
//           width: 40px;
//           height: 40px;
//           border: 4px solid rgba(255, 255, 255, 0.3);
//           border-top: 4px solid white;
//           border-radius: 50%;
//           animation: spin 1s linear infinite;
//           margin-bottom: 1rem;
//         }

//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }

//         .loading-text {
//           color: white;
//           font-size: 1.1rem;
//           text-align: center;
//         }

//         .error-content {
//           background: rgba(255, 255, 255, 0.95);
//           backdrop-filter: blur(10px);
//           padding: 3rem;
//           border-radius: 20px;
//           text-align: center;
//           box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
//         }

//         .error-icon {
//           font-size: 3rem;
//           margin-bottom: 1rem;
//         }

//         .error-text {
//           color: #dc3545;
//           font-size: 1.1rem;
//           margin-bottom: 2rem;
//         }

//         .page-header {
//           max-width: 1200px;
//           margin: 0 auto 2rem auto;
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           flex-wrap: wrap;
//           gap: 1rem;
//         }

//         .back-link {
//           display: flex;
//           align-items: center;
//           gap: 0.5rem;
//           color: white;
//           text-decoration: none;
//           font-weight: 500;
//           transition: all 0.3s ease;
//           padding: 0.75rem 1.5rem;
//           background: rgba(255, 255, 255, 0.1);
//           backdrop-filter: blur(10px);
//           border-radius: 12px;
//           border: 1px solid rgba(255, 255, 255, 0.2);
//         }

//         .back-link:hover {
//           background: rgba(255, 255, 255, 0.2);
//           transform: translateY(-2px);
//         }

//         .back-icon {
//           font-size: 1.2rem;
//         }

//         .page-title {
//           color: white;
//           font-size: clamp(2rem, 4vw, 3rem);
//           font-weight: 700;
//           margin: 0;
//           display: flex;
//           align-items: center;
//           gap: 1rem;
//         }

//         .title-icon {
//           font-size: 1.2em;
//         }

//         .user-section {
//           display: flex;
//           align-items: center;
//           gap: 0.5rem;
//         }

//         .user-info {
//           display: flex;
//           align-items: center;
//           gap: 0.5rem;
//           background: rgba(255, 255, 255, 0.1);
//           backdrop-filter: blur(10px);
//           padding: 0.75rem 1rem;
//           border-radius: 12px;
//           border: 1px solid rgba(255, 255, 255, 0.2);
//         }

//         .user-name {
//           color: white;
//           font-weight: 600;
//           font-size: 0.9rem;
//         }

//         .btn-small {
//           padding: 0.5rem 1rem;
//           border-radius: 8px;
//           border: none;
//           font-weight: 600;
//           font-size: 0.85rem;
//           cursor: pointer;
//           transition: all 0.3s ease;
//         }

//         .btn-login {
//           background: linear-gradient(135deg, #007bff, #0056b3);
//           color: white;
//         }

//         .btn-login:hover {
//           transform: translateY(-2px);
//           box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
//         }

//         .btn-logout {
//           background: linear-gradient(135deg, #dc3545, #c82333);
//           color: white;
//         }

//         .btn-logout:hover {
//           transform: translateY(-2px);
//           box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
//         }

//         .modal-overlay {
//           position: fixed;
//           top: 0;
//           left: 0;
//           right: 0;
//           bottom: 0;
//           background: rgba(0, 0, 0, 0.7);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           z-index: 1000;
//           padding: 1rem;
//         }

//         .modal-content {
//           background: white;
//           border-radius: 20px;
//           padding: 2.5rem;
//           max-width: 450px;
//           width: 100%;
//           position: relative;
//           box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
//           max-height: 90vh;
//           overflow-y: auto;
//         }

//         .modal-close {
//           position: absolute;
//           top: 1rem;
//           right: 1rem;
//           background: none;
//           border: none;
//           font-size: 1.5rem;
//           cursor: pointer;
//           color: #6c757d;
//           transition: color 0.3s;
//         }

//         .modal-close:hover {
//           color: #212529;
//         }

//         .modal-title {
//           font-size: 1.75rem;
//           font-weight: 700;
//           color: #212529;
//           margin-bottom: 1.5rem;
//         }

//         .form-group {
//           margin-bottom: 1.25rem;
//         }

//         .form-group label {
//           display: block;
//           font-weight: 600;
//           color: #212529;
//           margin-bottom: 0.5rem;
//           font-size: 0.9rem;
//         }

//         .form-group input {
//           width: 100%;
//           padding: 0.75rem 1rem;
//           border: 2px solid #e9ecef;
//           border-radius: 10px;
//           font-size: 0.95rem;
//           transition: all 0.3s;
//         }

//         .form-group input:focus {
//           outline: none;
//           border-color: #007bff;
//           box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
//         }

//         .form-group small {
//           display: block;
//           color: #6c757d;
//           font-size: 0.8rem;
//           margin-top: 0.25rem;
//         }

//         .mfa-input {
//           text-align: center;
//           font-size: 1.5rem !important;
//           letter-spacing: 0.5rem;
//           font-weight: 600;
//         }

//         .mfa-info {
//           text-align: center;
//           color: #6c757d;
//           margin-bottom: 1.5rem;
//           font-size: 0.95rem;
//         }

//         .error-message {
//           background: #f8d7da;
//           color: #721c24;
//           padding: 0.75rem 1rem;
//           border-radius: 8px;
//           margin-bottom: 1rem;
//           font-size: 0.9rem;
//           border: 1px solid #f5c6cb;
//         }

//         .btn-full {
//           width: 100%;
//           margin-top: 0.5rem;
//         }

//         .auth-switch {
//           text-align: center;
//           margin-top: 1.5rem;
//           padding-top: 1.5rem;
//           border-top: 1px solid #e9ecef;
//         }

//         .auth-switch p {
//           color: #6c757d;
//           font-size: 0.9rem;
//           margin: 0;
//         }

//         .auth-switch span {
//           color: #007bff;
//           font-weight: 600;
//           cursor: pointer;
//           text-decoration: underline;
//         }

//         .auth-switch span:hover {
//           color: #0056b3;
//         }

//         .btn-link {
//           background: none;
//           border: none;
//           color: #007bff;
//           cursor: pointer;
//           font-size: 0.9rem;
//           margin-top: 1rem;
//           text-decoration: underline;
//         }

//         .btn-link:hover {
//           color: #0056b3;
//         }

//         .main-content {
//           max-width: 1200px;
//           margin: 0 auto;
//           display: flex;
//           gap: 2rem;
//           flex-wrap: wrap;
//         }

//         .products-section {
//           flex: 2;
//           min-width: 300px;
//         }

//         .section-header {
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           margin-bottom: 2rem;
//           background: rgba(255, 255, 255, 0.95);
//           backdrop-filter: blur(10px);
//           padding: 1.5rem 2rem;
//           border-radius: 16px;
//           box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
//         }

//         .section-title {
//           font-size: 1.5rem;
//           font-weight: 600;
//           color: #212529;
//           margin: 0;
//         }

//         .products-count {
//           background: linear-gradient(135deg, #007bff, #0056b3);
//           color: white;
//           padding: 0.5rem 1rem;
//           border-radius: 20px;
//           font-size: 0.9rem;
//           font-weight: 600;
//         }

//         .products-grid {
//           display: grid;
//           grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
//           gap: 1.5rem;
//         }

//         .product-card {
//           background: rgba(255, 255, 255, 0.95);
//           backdrop-filter: blur(10px);
//           padding: 2rem;
//           border-radius: 16px;
//           box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
//           border: 1px solid rgba(255, 255, 255, 0.2);
//           transition: all 0.3s ease;
//           position: relative;
//           overflow: hidden;
//         }

//         .product-card::before {
//           content: '';
//           position: absolute;
//           top: 0;
//           left: -100%;
//           width: 100%;
//           height: 100%;
//           background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
//           transition: left 0.5s;
//         }

//         .product-card:hover {
//           transform: translateY(-5px);
//           box-shadow: 0 20px 40px rgba(0, 123, 255, 0.2);
//         }

//         .product-card:hover::before {
//           left: 100%;
//         }

//         .product-content {
//           margin-bottom: 1.5rem;
//         }

//         .product-name {
//           font-size: 1.25rem;
//           font-weight: 600;
//           color: #212529;
//           margin-bottom: 0.75rem;
//         }

//         .product-price {
//           font-size: 1.1rem;
//           font-weight: 700;
//           color: #28a745;
//           margin: 0;
//         }

//         .cart-section {
//           flex: 1;
//           min-width: 300px;
//           position: sticky;
//           top: 2rem;
//           height: fit-content;
//         }

//         .cart-container {
//           background: rgba(255, 255, 255, 0.95);
//           backdrop-filter: blur(10px);
//           border-radius: 20px;
//           box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
//           border: 1px solid rgba(255, 255, 255, 0.2);
//           overflow: hidden;
//         }

//         .cart-header {
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           padding: 2rem 2rem 1rem 2rem;
//           border-bottom: 1px solid rgba(0, 0, 0, 0.1);
//         }

//         .cart-title {
//           font-size: 1.5rem;
//           font-weight: 600;
//           color: #212529;
//           margin: 0;
//           display: flex;
//           align-items: center;
//           gap: 0.5rem;
//         }

//         .cart-icon {
//           font-size: 1.2em;
//         }

//         .cart-badge {
//           background: linear-gradient(135deg, #28a745, #20c997);
//           color: white;
//           padding: 0.5rem 1rem;
//           border-radius: 20px;
//           font-weight: 600;
//           font-size: 0.9rem;
//         }

//         .empty-cart {
//           padding: 3rem 2rem;
//           text-align: center;
//         }

//         .empty-icon {
//           font-size: 4rem;
//           margin-bottom: 1rem;
//           opacity: 0.5;
//         }

//         .empty-text {
//           font-size: 1.1rem;
//           color: #6c757d;
//           margin-bottom: 0.5rem;
//         }

//         .empty-subtitle {
//           font-size: 0.9rem;
//           color: #adb5bd;
//           margin: 0;
//         }

//         .cart-content {
//           padding: 1rem 2rem 2rem 2rem;
//         }

//         .cart-items {
//           margin-bottom: 2rem;
//         }

//         .cart-item {
//           padding: 1.5rem;
//           border: 1px solid rgba(0, 0, 0, 0.1);
//           border-radius: 12px;
//           margin-bottom: 1rem;
//           background: rgba(248, 249, 250, 0.5);
//           transition: all 0.3s ease;
//         }

//         .cart-item:hover {
//           background: rgba(248, 249, 250, 0.8);
//           transform: translateY(-2px);
//         }

//         .item-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 1rem;
//         }

//         .item-name {
//           font-size: 1rem;
//           font-weight: 600;
//           color: #212529;
//           margin: 0;
//         }

//         .btn-remove {
//           background: #dc3545;
//           color: white;
//           border: none;
//           border-radius: 50%;
//           width: 30px;
//           height: 30px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           cursor: pointer;
//           font-size: 1.2rem;
//           transition: all 0.3s ease;
//         }

//         .btn-remove:hover {
//           background: #c82333;
//           transform: scale(1.1);
//         }

//         .item-controls {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//         }

//         .quantity-controls {
//           display: flex;
//           align-items: center;
//           gap: 1rem;
//           background: white;
//           padding: 0.5rem;
//           border-radius: 8px;
//           border: 1px solid #dee2e6;
//         }

//         .qty-btn {
//           background: linear-gradient(135deg, #007bff, #0056b3);
//           color: white;
//           border: none;
//           border-radius: 6px;
//           width: 32px;
//           height: 32px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           cursor: pointer;
//           font-weight: 600;
//           transition: all 0.3s ease;
//         }

//         .qty-btn:hover {
//           background: linear-gradient(135deg, #0056b3, #004085);
//           transform: scale(1.1);
//         }

//         .qty-display {
//           font-weight: 600;
//           min-width: 2rem;
//           text-align: center;
//         }

//         .item-total {
//           font-weight: 700;
//           color: #28a745;
//           font-size: 1.1rem;
//         }

//         .cart-summary {
//           border-top: 2px solid rgba(0, 0, 0, 0.1);
//           padding-top: 1.5rem;
//         }

//         .total-row {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 1.5rem;
//           font-size: 1.25rem;
//           font-weight: 700;
//         }

//         .total-label {
//           color: #212529;
//         }

//         .total-amount {
//           color: #28a745;
//         }

//         .login-notice {
//           background: linear-gradient(135deg, #fff3cd, #ffeaa7);
//           border: 1px solid #f0ad4e;
//           color: #856404;
//           padding: 0.75rem 1rem;
//           border-radius: 8px;
//           text-align: center;
//           font-size: 0.9rem;
//           font-weight: 600;
//           margin-bottom: 1rem;
//         }

//         .btn {
//           display: inline-flex;
//           align-items: center;
//           justify-content: center;
//           padding: 0.875rem 2rem;
//           border-radius: 12px;
//           text-decoration: none;
//           font-weight: 600;
//           font-size: 0.95rem;
//           transition: all 0.3s ease;
//           cursor: pointer;
//           border: none;
//           gap: 0.5rem;
//           position: relative;
//           overflow: hidden;
//         }

//         .btn-secondary {
//           background: linear-gradient(135deg, #6c757d, #495057);
//           color: white;
//           box-shadow: 0 4px 15px rgba(108, 117, 125, 0.3);
//         }

//         .btn-secondary:hover {
//           background: linear-gradient(135deg, #495057, #343a40);
//           transform: translateY(-2px);
//         }

//         .btn-add-cart {
//           width: 100%;
//           background: linear-gradient(135deg, #007bff, #0056b3);
//           color: white;
//           box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
//         }

//         .btn-add-cart::before {
//           content: '';
//           position: absolute;
//           top: 0;
//           left: -100%;
//           width: 100%;
//           height: 100%;
//           background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
//           transition: left 0.5s;
//         }

//         .btn-add-cart:hover {
//           background: linear-gradient(135deg, #0056b3, #004085);
//           transform: translateY(-2px);
//           box-shadow: 0 8px 25px rgba(0, 123, 255, 0.4);
//         }

//         .btn-add-cart:hover::before {
//           left: 100%;
//         }

//         .btn-checkout {
//           width: 100%;
//           background: linear-gradient(135deg, #28a745, #20c997);
//           color: white;
//           box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
//         }

//         .btn-checkout:hover:not(:disabled) {
//           background: linear-gradient(135deg, #218838, #1e7e34);
//           transform: translateY(-2px);
//           box-shadow: 0 8px 25px rgba(40, 167, 69, 0.4);
//         }

//         .btn-checkout:disabled {
//           opacity: 0.7;
//           cursor: not-allowed;
//           transform: none;
//         }

//         .btn-spinner {
//           width: 16px;
//           height: 16px;
//           border: 2px solid rgba(255, 255, 255, 0.3);
//           border-top: 2px solid white;
//           border-radius: 50%;
//           animation: spin 1s linear infinite;
//         }

//         .btn-icon {
//           font-size: 1.1em;
//         }

//         .btn-arrow {
//           transition: transform 0.3s ease;
//         }

//         .btn-checkout:hover:not(:disabled) .btn-arrow {
//           transform: translateX(3px);
//         }

//         .btn-primary {
//           background: linear-gradient(135deg, #007bff, #0056b3);
//           color: white;
//           box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
//         }

//         .btn-primary:hover:not(:disabled) {
//           background: linear-gradient(135deg, #0056b3, #004085);
//           transform: translateY(-2px);
//           box-shadow: 0 8px 25px rgba(0, 123, 255, 0.4);
//         }

//         .btn-primary:disabled {
//           opacity: 0.7;
//           cursor: not-allowed;
//         }

//         @media (max-width: 768px) {
//           .container {
//             padding: 1rem;
//           }

//           .page-header {
//             flex-direction: column;
//             align-items: stretch;
//             text-align: center;
//           }

//           .user-section {
//             justify-content: center;
//           }

//           .main-content {
//             flex-direction: column;
//           }

//           .cart-section {
//             position: static;
//           }

//           .section-header {
//             flex-direction: column;
//             gap: 1rem;
//             text-align: center;
//           }

//           .products-grid {
//             grid-template-columns: 1fr;
//           }

//           .cart-header {
//             padding: 1.5rem;
//           }

//           .cart-content {
//             padding: 1rem 1.5rem 1.5rem 1.5rem;
//           }

//           .modal-content {
//             padding: 2rem 1.5rem;
//           }
//         }
//       `}</style>
//     </>
//   );
// }

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function SelectItems() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [showMFA, setShowMFA] = useState(false);
  const [pendingAuth, setPendingAuth] = useState(null);
  const [user, setUser] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    mfaCode: ''
  });
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

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

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setAuthError('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert('✅ Registrasi berhasil! Silakan login.');
        setAuthMode('login');
        setFormData({ ...formData, password: '' });
      } else {
        setAuthError(data.error || 'Registrasi gagal');
      }
    } catch (err) {
      setAuthError('Terjadi kesalahan. Coba lagi.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await res.json();

      if (res.ok) {
        setPendingAuth(data.user);
        setShowMFA(true);
        alert('📱 Kode verifikasi telah dikirim ke WhatsApp Anda!');
      } else {
        setAuthError(data.error || 'Login gagal');
      }
    } catch (err) {
      setAuthError('Terjadi kesalahan. Coba lagi.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleVerifyMFA = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    if (!pendingAuth?.email) {
      setAuthError('Email user tidak ditemukan, login ulang');
      setAuthLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/verify-mfa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: pendingAuth.email,
          code: formData.mfaCode
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setAuthError(data.error || 'Kode verifikasi salah');
      } else {
        localStorage.setItem('user', JSON.stringify(pendingAuth));
        setUser(pendingAuth);
        setShowLoginModal(false);
        setShowMFA(false);
        setFormData({ name: '', email: '', phone: '', password: '', mfaCode: '' });
        alert('✅ Login berhasil! Silakan lanjutkan checkout.');
        
        setTimeout(() => {
          handleCheckout();
        }, 500);
      }
    } catch (err) {
      console.error(err);
      setAuthError('Terjadi kesalahan. Coba lagi.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    alert('👋 Anda telah logout');
  };

  async function handleCheckout() {
    if (!cart.length) return;
    
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      setShowLoginModal(true);
      alert('🔐 Silakan login terlebih dahulu untuk melakukan checkout');
      return;
    }

    setCheckoutLoading(true);
    setError("");

    const userData = JSON.parse(storedUser);
    const userEmail = userData.email;
    
    if (!userEmail) {
      setError("Email tidak ditemukan. Silakan login ulang.");
      setCheckoutLoading(false);
      return;
    }

    const items = cart.map(item => ({
      name: item.name,
      price: item.price,
      qty: item.qty
    }));

    console.log("🛒 Checkout items:", items);
    console.log("📧 Email:", userEmail);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items,
          email: userEmail
        }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.checkout) {
        if (data.checkout.invoice_url) {
          window.location.href = data.checkout.invoice_url;
        } else {
          window.location.href = `/checkout?id=${data.checkout._id}`;
        }
      } else {
        setError(data.error || data.hint || "Gagal membuat checkout");
      }
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan saat checkout");
    } finally {
      setCheckoutLoading(false);
    }
  }

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p className="loading-text">Loading products...</p>
    </div>
  );
  
  if (error && !products.length) return (
    <div className="error-container">
      <div className="error-content">
        <div className="error-icon">⚠️</div>
        <p className="error-text">{error}</p>
        <Link href="/" className="btn btn-secondary">
          Kembali ke Home
        </Link>
      </div>
    </div>
  );

  return (
    <>
      <div className="container">
        <header className="page-header">
          <Link href="/" className="back-link">
            <span className="back-icon">←</span>
            <span>Kembali ke Home</span>
          </Link>
          <h1 className="page-title">
            <span className="title-icon">🛍️</span>
            Felix Shop
          </h1>
          <div className="user-section">
            {user ? (
              <div className="user-info">
                <span className="user-name">👋 {user.name}</span>
                <button className="btn-small btn-logout" onClick={handleLogout}>
                  🚪 Logout
                </button>
              </div>
            ) : (
              <button className="btn-small btn-login" onClick={() => setShowLoginModal(true)}>
                🔐 Login
              </button>
            )}
          </div>
        </header>

        {showLoginModal && (
          <div className="modal-overlay" onClick={() => setShowLoginModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setShowLoginModal(false)}>✕</button>
              
              {!showMFA ? (
                <>
                  <h2 className="modal-title">
                    {authMode === 'login' ? '🔐 Login untuk Checkout' : '📝 Register'}
                  </h2>

                  {authError && <div className="error-message">{authError}</div>}

                  <form onSubmit={authMode === 'login' ? handleLogin : handleRegister}>
                    {authMode === 'register' && (
                      <>
                        <div className="form-group">
                          <label>Nama Lengkap</label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            placeholder="John Doe"
                          />
                        </div>

                        <div className="form-group">
                          <label>Nomor WhatsApp</label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            placeholder="628123456789"
                          />
                          <small>Format: 628xxx (gunakan kode negara)</small>
                        </div>
                      </>
                    )}

                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="email@example.com"
                      />
                    </div>

                    <div className="form-group">
                      <label>Password</label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        placeholder="••••••••"
                        minLength="6"
                      />
                    </div>

                    <button type="submit" className="btn btn-primary btn-full" disabled={authLoading}>
                      {authLoading ? '⏳ Processing...' : authMode === 'login' ? '🔓 Login' : '📝 Register'}
                    </button>
                  </form>

                  <div className="auth-switch">
                    {authMode === 'login' ? (
                      <p>
                        Belum punya akun?{' '}
                        <span onClick={() => setAuthMode('register')}>Register disini</span>
                      </p>
                    ) : (
                      <p>
                        Sudah punya akun?{' '}
                        <span onClick={() => setAuthMode('login')}>Login disini</span>
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <h2 className="modal-title">📱 Verifikasi WhatsApp</h2>
                  <p className="mfa-info">
                    Kode verifikasi telah dikirim ke WhatsApp Anda
                  </p>

                  {authError && <div className="error-message">{authError}</div>}

                  <form onSubmit={handleVerifyMFA}>
                    <div className="form-group">
                      <label>Kode Verifikasi (6 digit)</label>
                      <input
                        type="text"
                        name="mfaCode"
                        value={formData.mfaCode}
                        onChange={handleInputChange}
                        required
                        placeholder="123456"
                        maxLength="6"
                        className="mfa-input"
                      />
                    </div>

                    <button type="submit" className="btn btn-primary btn-full" disabled={authLoading}>
                      {authLoading ? '⏳ Verifying...' : '✓ Verify'}
                    </button>
                  </form>

                  <button 
                    className="btn-link"
                    onClick={() => {
                      setShowMFA(false);
                      setPendingAuth(null);
                    }}
                  >
                    ← Kembali ke login
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        <div className="main-content">
          <section className="products-section">
            <div className="section-header">
              <h2 className="section-title">Produk Tersedia</h2>
              <div className="products-count">{products.length} produk</div>
            </div>
            
            <div className="products-grid">
  {products.map(p => (
    <div key={p._id} className="product-card">
      {/* ✅ FIX: Tampilkan gambar dengan benar */}
      <div className="product-image-wrapper">
        {(p.imageUrl || p.image) ? (
          <img 
            src={p.imageUrl || p.image} 
            alt={p.name}
            className="product-image"
            onError={(e) => {
              console.log('Image load error:', e.target.src);
              e.target.style.display = 'none';
              e.target.nextElementSibling.style.display = 'flex';
            }}
            onLoad={(e) => {
              console.log('Image loaded successfully:', e.target.src);
            }}
          />
        ) : null}
        <div 
          className="product-image-placeholder"
          style={{display: (p.imageUrl || p.image) ? 'none' : 'flex'}}
        >
          <span className="placeholder-icon">📦</span>
        </div>
      </div>
      
      <div className="product-content">
        <h3 className="product-name">{p.name}</h3>
        <p className="product-price">Rp{p.price.toLocaleString()}</p>
      </div>
      <button 
        onClick={() => addToCart(p)} 
        className="btn btn-add-cart"
      >
        <span className="btn-icon">+</span>
        <span>Tambah ke Keranjang</span>
      </button>
    </div>
  ))}
</div>
          </section>

          <aside className="cart-section">
            <div className="cart-container">
              <div className="cart-header">
                <h2 className="cart-title">
                  <span className="cart-icon">🛒</span>
                  Keranjang
                </h2>
                <div className="cart-badge">
                  {cart.reduce((s, i) => s + i.qty, 0)}
                </div>
              </div>

              {cart.length === 0 ? (
                <div className="empty-cart">
                  <div className="empty-icon">🛍️</div>
                  <p className="empty-text">Keranjang masih kosong</p>
                  <p className="empty-subtitle">Pilih produk untuk mulai berbelanja</p>
                </div>
              ) : (
                <div className="cart-content">
                  <div className="cart-items">
                    {cart.map((item) => (
                      <div key={item._id} className="cart-item">
                        <div className="item-header">
                          <h4 className="item-name">{item.name}</h4>
                          <button 
                            onClick={() => removeFromCart(item._id)}
                            className="btn-remove"
                          >
                            ×
                          </button>
                        </div>
                        <div className="item-controls">
                          <div className="quantity-controls">
                            <button 
                              onClick={() => updateQuantity(item._id, item.qty - 1)}
                              className="qty-btn"
                            >
                              -
                            </button>
                            <span className="qty-display">{item.qty}</span>
                            <button 
                              onClick={() => updateQuantity(item._id, item.qty + 1)}
                              className="qty-btn"
                            >
                              +
                            </button>
                          </div>
                          <div className="item-total">
                            Rp{(item.price * item.qty).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="cart-summary">
                    <div className="total-row">
                      <span className="total-label">Total:</span>
                      <span className="total-amount">Rp{getTotal().toLocaleString()}</span>
                    </div>
                    {!user && (
                      <div className="login-notice">
                        🔐 Login diperlukan untuk checkout
                      </div>
                    )}
                    <button 
                      onClick={handleCheckout} 
                      disabled={checkoutLoading} 
                      className="btn btn-checkout"
                    >
                      {checkoutLoading ? (
                        <>
                          <div className="btn-spinner"></div>
                          <span>Memproses...</span>
                        </>
                      ) : (
                        <>
                          <span>{user ? 'Bayar Menggunakan Xendit' : 'Login & Bayar'}</span>
                          <span className="btn-arrow">→</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }
        .product-image-wrapper {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #f8f9fa;
  position: relative;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.product-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  position: absolute;
  top: 0;
  left: 0;
}

.placeholder-icon {
  font-size: 4rem;
  opacity: 0.3;
}


        .container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
          padding: 2rem 1rem;
        }

        .loading-container, .error-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-top: 4px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .loading-text {
          color: white;
          font-size: 1.1rem;
          text-align: center;
        }

        .error-content {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          padding: 3rem;
          border-radius: 20px;
          text-align: center;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .error-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .error-text {
          color: #dc3545;
          font-size: 1.1rem;
          margin-bottom: 2rem;
        }

        .page-header {
          max-width: 1200px;
          margin: 0 auto 2rem auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .back-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: white;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s ease;
          padding: 0.75rem 1.5rem;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .back-link:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }

        .back-icon {
          font-size: 1.2rem;
        }

        .page-title {
          color: white;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .title-icon {
          font-size: 1.2em;
        }

        .user-section {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          padding: 0.75rem 1rem;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .user-name {
          color: white;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .btn-small {
          padding: 0.5rem 1rem;
          border-radius: 8px;
          border: none;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-login {
          background: linear-gradient(135deg, #007bff, #0056b3);
          color: white;
        }

        .btn-login:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
        }

        .btn-logout {
          background: linear-gradient(135deg, #dc3545, #c82333);
          color: white;
        }

        .btn-logout:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }

        .modal-content {
          background: white;
          border-radius: 20px;
          padding: 2.5rem;
          max-width: 450px;
          width: 100%;
          position: relative;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #6c757d;
          transition: color 0.3s;
        }

        .modal-close:hover {
          color: #212529;
        }

        .modal-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #212529;
          margin-bottom: 1.5rem;
        }

        .form-group {
          margin-bottom: 1.25rem;
        }

        .form-group label {
          display: block;
          font-weight: 600;
          color: #212529;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }

        .form-group input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid #e9ecef;
          border-radius: 10px;
          font-size: 0.95rem;
          transition: all 0.3s;
        }

        .form-group input:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
        }

        .form-group small {
          display: block;
          color: #6c757d;
          font-size: 0.8rem;
          margin-top: 0.25rem;
        }

        .mfa-input {
          text-align: center;
          font-size: 1.5rem !important;
          letter-spacing: 0.5rem;
          font-weight: 600;
        }

        .mfa-info {
          text-align: center;
          color: #6c757d;
          margin-bottom: 1.5rem;
          font-size: 0.95rem;
        }

        .error-message {
          background: #f8d7da;
          color: #721c24;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          font-size: 0.9rem;
          border: 1px solid #f5c6cb;
        }

        .btn-full {
          width: 100%;
          margin-top: 0.5rem;
        }

        .auth-switch {
          text-align: center;
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e9ecef;
        }

        .auth-switch p {
          color: #6c757d;
          font-size: 0.9rem;
          margin: 0;
        }

        .auth-switch span {
          color: #007bff;
          font-weight: 600;
          cursor: pointer;
          text-decoration: underline;
        }

        .auth-switch span:hover {
          color: #0056b3;
        }

        .btn-link {
          background: none;
          border: none;
          color: #007bff;
          cursor: pointer;
          font-size: 0.9rem;
          margin-top: 1rem;
          text-decoration: underline;
        }

        .btn-link:hover {
          color: #0056b3;
        }

        .main-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .products-section {
          flex: 2;
          min-width: 300px;
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2rem;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          padding: 1.5rem 2rem;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #212529;
          margin: 0;
        }

        .products-count {
          background: linear-gradient(135deg, #007bff, #0056b3);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .product-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          padding: 0;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .product-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          transition: left 0.5s;
          z-index: 1;
        }

        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 123, 255, 0.2);
        }

        .product-card:hover::before {
          left: 100%;
        }

        /* ✅ TAMBAHAN: Styling untuk gambar produk */
        .product-image-wrapper {
          width: 100%;
          height: 200px;
          overflow: hidden;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          position: relative;
        }

        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .product-card:hover .product-image {
          transform: scale(1.05);
        }

        .product-image-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }

        .placeholder-icon {
          font-size: 4rem;
          opacity: 0.3;
        }

        .product-content {
          padding: 1.5rem 2rem;
        }

        .product-name {
          font-size: 1.25rem;
          font-weight: 600;
          color: #212529;
          margin-bottom: 0.75rem;
        }

        .product-price {
          font-size: 1.1rem;
          font-weight: 700;
          color: #28a745;
          margin: 0;
        }

        .btn-add-cart {
          width: 100%;
          margin: 0 2rem 2rem 2rem;
          width: calc(100% - 4rem);
        }

        .cart-section {
          flex: 1;
          min-width: 300px;
          position: sticky;
          top: 2rem;
          height: fit-content;
        }

        .cart-container {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          overflow: hidden;
        }

        .cart-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 2rem 2rem 1rem 2rem;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }

        .cart-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #212529;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .cart-icon {
          font-size: 1.2em;
        }

        .cart-badge {
          background: linear-gradient(135deg, #28a745, #20c997);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .empty-cart {
          padding: 3rem 2rem;
          text-align: center;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .empty-text {
          font-size: 1.1rem;
          color: #6c757d;
          margin-bottom: 0.5rem;
        }

        .empty-subtitle {
          font-size: 0.9rem;
          color: #adb5bd;
          margin: 0;
        }

        .cart-content {
          padding: 1rem 2rem 2rem 2rem;
        }

        .cart-items {
          margin-bottom: 2rem;
        }

        .cart-item {
          padding: 1.5rem;
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 12px;
          margin-bottom: 1rem;
          background: rgba(248, 249, 250, 0.5);
          transition: all 0.3s ease;
        }

        .cart-item:hover {
          background: rgba(248, 249, 250, 0.8);
          transform: translateY(-2px);
        }

        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .item-name {
          font-size: 1rem;
          font-weight: 600;
          color: #212529;
          margin: 0;
        }

        .btn-remove {
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1.2rem;
          transition: all 0.3s ease;
        }

        .btn-remove:hover {
          background: #c82333;
          transform: scale(1.1);
        }

        .item-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: white;
          padding: 0.5rem;
          border-radius: 8px;
          border: 1px solid #dee2e6;
        }

        .qty-btn {
          background: linear-gradient(135deg, #007bff, #0056b3);
          color: white;
          border: none;
          border-radius: 6px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .qty-btn:hover {
          background: linear-gradient(135deg, #0056b3, #004085);
          transform: scale(1.1);
        }

        .qty-display {
          font-weight: 600;
          min-width: 2rem;
          text-align: center;
        }

        .item-total {
          font-weight: 700;
          color: #28a745;
          font-size: 1.1rem;
        }

        .cart-summary {
          border-top: 2px solid rgba(0, 0, 0, 0.1);
          padding-top: 1.5rem;
        }

        .total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          font-size: 1.25rem;
          font-weight: 700;
        }

        .total-label {
          color: #212529;
        }

        .total-amount {
          color: #28a745;
        }

        .login-notice {
          background: linear-gradient(135deg, #fff3cd, #ffeaa7);
          border: 1px solid #f0ad4e;
          color: #856404;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          text-align: center;
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.875rem 2rem;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          cursor: pointer;
          border: none;
          gap: 0.5rem;
          position: relative;
          overflow: hidden;
        }

        .btn-secondary {
          background: linear-gradient(135deg, #6c757d, #495057);
          color: white;
          box-shadow: 0 4px 15px rgba(108, 117, 125, 0.3);
        }

        .btn-secondary:hover {
          background: linear-gradient(135deg, #495057, #343a40);
          transform: translateY(-2px);
        }

        .btn-add-cart {
          background: linear-gradient(135deg, #007bff, #0056b3);
          color: white;
          box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
        }

        .btn-add-cart::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s;
        }

        .btn-add-cart:hover {
          background: linear-gradient(135deg, #0056b3, #004085);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 123, 255, 0.4);
        }

        .btn-add-cart:hover::before {
          left: 100%;
        }

        .btn-checkout {
          width: 100%;
          background: linear-gradient(135deg, #28a745, #20c997);
          color: white;
          box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
        }

        .btn-checkout:hover:not(:disabled) {
          background: linear-gradient(135deg, #218838, #1e7e34);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(40, 167, 69, 0.4);
        }

        .btn-checkout:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .btn-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .btn-icon {
          font-size: 1.1em;
        }

        .btn-arrow {
          transition: transform 0.3s ease;
        }

        .btn-checkout:hover:not(:disabled) .btn-arrow {
          transform: translateX(3px);
        }

        .btn-primary {
          background: linear-gradient(135deg, #007bff, #0056b3);
          color: white;
          box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
        }

        .btn-primary:hover:not(:disabled) {
          background: linear-gradient(135deg, #0056b3, #004085);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 123, 255, 0.4);
        }

        .btn-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .container {
            padding: 1rem;
          }

          .page-header {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
          }

          .user-section {
            justify-content: center;
          }

          .main-content {
            flex-direction: column;
          }

          .cart-section {
            position: static;
          }

          .section-header {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .products-grid {
            grid-template-columns: 1fr;
          }

          .cart-header {
            padding: 1.5rem;
          }

          .cart-content {
            padding: 1rem 1.5rem 1.5rem 1.5rem;
          }

          .modal-content {
            padding: 2rem 1.5rem;
          }

          .product-image-wrapper {
            height: 180px;
          }
        }
      `}</style>
    </>
  );}