// import { useEffect, useState } from "react";
// import Script from "next/script";

// export default function CheckoutPage() {
//   const [checkout, setCheckout] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [paymentLoading, setPaymentLoading] = useState(false);

//   // Load checkout data
//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const id = params.get("id");
//     if (!id) return;

//     fetch(`/api/checkout?id=${id}`)
//       .then(res => res.json())
//       .then(data => {
//         setCheckout(data);
//         setLoading(false);
//       })
//       .catch(err => {
//         console.error(err);
//         setError("Gagal memuat checkout");
//         setLoading(false);
//       });
//   }, []);

//   // Payment handler
//   const handlePayment = async () => {
//     if (!checkout) return;
//     setPaymentLoading(true);
//     setError("");

//     try {
//       const res = await fetch("/api/createInvoice", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           amount: checkout.total,
//           description: "Pembayaran produk",
//           email: checkout.email || "test@example.com",
//         }),
//       });

//       const data = await res.json();

//       // ❌ Jangan cek res.ok, langsung pakai field invoiceUrl
//       const invoiceUrl = data.invoiceUrl || data.invoice_url;
//       if (invoiceUrl) {
//         // Redirect ke halaman Xendit
//         window.location.href = invoiceUrl;
//       } else {
//         console.error("Invoice tidak tersedia:", data);
//         setError(data.error || "Invoice tidak tersedia");
//       }

//       if (data.invoiceUrl && data.id) {
//         window.location.href = `${data.invoiceUrl}?invoice_id=${data.id}`;
//       } else {
//         setError(data.error || "Invoice tidak tersedia");
//       }
//     } catch (err) {
//       console.error("Error handlePayment:", err);
//       setError("Terjadi kesalahan saat membuat pembayaran");
//     } finally {
//       setPaymentLoading(false);
//     }
//   };

//   if (loading) return (
//     <div className="loading-container">
//       <div className="loading-spinner"></div>
//       <p className="loading-text">Loading checkout...</p>
//     </div>
//   );

//   return (
//     <>
//       <Script src="https://js.xendit.co/v1/xendit.min.js" strategy="beforeInteractive" />
      
//       <div className="container">
//         <div className="checkout-wrapper">
//           <header className="checkout-header">
//             <div className="header-icon">🛒</div>
//             <h1 className="page-title">Checkout</h1>
//             <p className="page-subtitle">Review pesanan Anda sebelum melanjutkan pembayaran</p>
//           </header>

//           <div className="checkout-content">
//             {/* Order Summary */}
//             <section className="order-summary">
//               <div className="summary-header">
//                 <h2 className="summary-title">
//                   <span className="summary-icon">📋</span>
//                   Ringkasan Pesanan
//                 </h2>
//                 <div className="items-count">
//                   {checkout?.items?.length || 0} item
//                 </div>
//               </div>

//               <div className="items-list">
//                 {checkout && checkout.items.map((item, i) => (
//                   <div key={i} className="order-item">
//                     <div className="item-info">
//                       <h3 className="item-name">{item.name}</h3>
//                       <div className="item-details">
//                         <span className="item-quantity">Qty: {item.qty}</span>
//                         <span className="item-price">Rp{item.price.toLocaleString()}</span>
//                       </div>
//                     </div>
//                     <div className="item-total">
//                       Rp{(item.price * item.qty).toLocaleString()}
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <div className="total-section">
//                 <div className="total-row">
//                   <span className="total-label">Total Pembayaran:</span>
//                   <span className="total-amount">Rp{checkout?.total?.toLocaleString()}</span>
//                 </div>
//               </div>
//             </section>

//             {/* Payment Section */}
//             <section className="payment-section">
//               <div className="payment-header">
//                 <h2 className="payment-title">
//                   <span className="payment-icon">💳</span>
//                   Metode Pembayaran
//                 </h2>
//                 <p className="payment-subtitle">Pilih metode pembayaran yang diinginkan</p>
//               </div>

//               <div className="payment-methods">
//                 <div className="method-item active">
//                   <div className="method-icon">🏦</div>
//                   <div className="method-info">
//                     <h4>Xendit Payment Gateway</h4>
//                     <p>Kartu Kredit, E-Wallet, Transfer Bank</p>
//                   </div>
//                   <div className="method-check">✓</div>
//                 </div>
//               </div>

//               <button
//                 onClick={handlePayment}
//                 disabled={paymentLoading}
//                 className="btn btn-payment"
//               >
//                 {paymentLoading ? (
//                   <>
//                     <div className="btn-spinner"></div>
//                     <span>Memproses...</span>
//                   </>
//                 ) : (
//                   <>
//                     <span className="payment-text">Bayar Sekarang</span>
//                     <span className="payment-amount">Rp{checkout?.total?.toLocaleString()}</span>
//                   </>
//                 )}
//               </button>

//               {error && (
//                 <div className="error-message">
//                   <div className="error-icon">⚠️</div>
//                   <span className="error-text">{error}</span>
//                 </div>
//               )}
//             </section>

//             {/* Security Notice */}
//             <div className="security-notice">
//               <div className="security-icon">🔒</div>
//               <div className="security-content">
//                 <h4 className="security-title">Pembayaran Aman</h4>
//                 <p className="security-text">
//                   Transaksi Anda diamankan dengan enkripsi SSL 256-bit dan diproses melalui Xendit yang telah tersertifikasi PCI DSS.
//                 </p>
//               </div>
//             </div>
//           </div>
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

//         .loading-container {
//           min-height: 100vh;
//           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//           display: flex;
//           flex-direction: column;
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

//         .checkout-wrapper {
//           max-width: 800px;
//           margin: 0 auto;
//         }

//         .checkout-header {
//           text-align: center;
//           margin-bottom: 3rem;
//           background: rgba(255, 255, 255, 0.95);
//           backdrop-filter: blur(10px);
//           padding: 3rem 2rem;
//           border-radius: 24px;
//           box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
//           border: 1px solid rgba(255, 255, 255, 0.2);
//         }

//         .header-icon {
//           font-size: 4rem;
//           margin-bottom: 1rem;
//           display: block;
//         }

//         .page-title {
//           font-size: clamp(2.5rem, 5vw, 3.5rem);
//           font-weight: 700;
//           margin-bottom: 1rem;
//           background: linear-gradient(135deg, #007bff, #28a745);
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//           background-clip: text;
//         }

//         .page-subtitle {
//           font-size: 1.1rem;
//           color: #6c757d;
//           margin: 0;
//           line-height: 1.6;
//         }

//         .checkout-content {
//           display: flex;
//           flex-direction: column;
//           gap: 2rem;
//         }

//         .order-summary, .payment-section {
//           background: rgba(255, 255, 255, 0.95);
//           backdrop-filter: blur(10px);
//           border-radius: 20px;
//           box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
//           border: 1px solid rgba(255, 255, 255, 0.2);
//           padding: 2rem;
//         }

//         .summary-header, .payment-header {
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           margin-bottom: 2rem;
//           padding-bottom: 1rem;
//           border-bottom: 1px solid rgba(0, 0, 0, 0.1);
//         }

//         .summary-title, .payment-title {
//           font-size: 1.5rem;
//           font-weight: 600;
//           color: #212529;
//           margin: 0;
//           display: flex;
//           align-items: center;
//           gap: 0.75rem;
//         }

//         .summary-icon, .payment-icon {
//           font-size: 1.2em;
//         }

//         .items-count {
//           background: linear-gradient(135deg, #007bff, #0056b3);
//           color: white;
//           padding: 0.5rem 1rem;
//           border-radius: 20px;
//           font-size: 0.9rem;
//           font-weight: 600;
//         }

//         .items-list {
//           margin-bottom: 2rem;
//         }

//         .order-item {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           padding: 1.5rem;
//           background: rgba(248, 249, 250, 0.5);
//           border-radius: 12px;
//           margin-bottom: 1rem;
//           border: 1px solid rgba(0, 0, 0, 0.05);
//           transition: all 0.3s ease;
//         }

//         .order-item:hover {
//           background: rgba(248, 249, 250, 0.8);
//           transform: translateY(-2px);
//           box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
//         }

//         .item-info {
//           flex: 1;
//         }

//         .item-name {
//           font-size: 1.1rem;
//           font-weight: 600;
//           color: #212529;
//           margin-bottom: 0.5rem;
//         }

//         .item-details {
//           display: flex;
//           gap: 1rem;
//           font-size: 0.9rem;
//           color: #6c757d;
//         }

//         .item-quantity {
//           font-weight: 500;
//         }

//         .item-price {
//           color: #28a745;
//           font-weight: 600;
//         }

//         .item-total {
//           font-size: 1.1rem;
//           font-weight: 700;
//           color: #28a745;
//         }

//         .total-section {
//           border-top: 2px solid rgba(0, 0, 0, 0.1);
//           padding-top: 1.5rem;
//         }

//         .total-row {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//         }

//         .total-label {
//           font-size: 1.25rem;
//           font-weight: 600;
//           color: #212529;
//         }

//         .total-amount {
//           font-size: 1.5rem;
//           font-weight: 700;
//           color: #28a745;
//         }

//         .payment-subtitle {
//           font-size: 1rem;
//           color: #6c757d;
//           margin: 0;
//           line-height: 1.6;
//         }

//         .payment-methods {
//           margin-bottom: 2rem;
//         }

//         .method-item {
//           display: flex;
//           align-items: center;
//           padding: 1.5rem;
//           background: rgba(248, 249, 250, 0.5);
//           border: 2px solid #dee2e6;
//           border-radius: 12px;
//           cursor: pointer;
//           transition: all 0.3s ease;
//           gap: 1rem;
//         }

//         .method-item.active {
//           border-color: #007bff;
//           background: rgba(0, 123, 255, 0.05);
//         }

//         .method-item:hover {
//           border-color: #007bff;
//           background: rgba(0, 123, 255, 0.08);
//           transform: translateY(-2px);
//         }

//         .method-icon {
//           font-size: 2rem;
//         }

//         .method-info {
//           flex: 1;
//         }

//         .method-info h4 {
//           font-size: 1.1rem;
//           font-weight: 600;
//           color: #212529;
//           margin-bottom: 0.25rem;
//         }

//         .method-info p {
//           font-size: 0.9rem;
//           color: #6c757d;
//           margin: 0;
//         }

//         .method-check {
//           font-size: 1.5rem;
//           color: #28a745;
//           font-weight: bold;
//         }

//         .btn {
//           display: inline-flex;
//           align-items: center;
//           justify-content: center;
//           padding: 1rem 2rem;
//           border-radius: 12px;
//           text-decoration: none;
//           font-weight: 600;
//           font-size: 1rem;
//           transition: all 0.3s ease;
//           cursor: pointer;
//           border: none;
//           gap: 0.75rem;
//           position: relative;
//           overflow: hidden;
//           width: 100%;
//         }

//         .btn-payment {
//           background: linear-gradient(135deg, #28a745, #20c997);
//           color: white;
//           box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
//           padding: 1.25rem 2rem;
//           font-size: 1.1rem;
//           flex-direction: column;
//           gap: 0.25rem;
//         }

//         .btn-payment::before {
//           content: '';
//           position: absolute;
//           top: 0;
//           left: -100%;
//           width: 100%;
//           height: 100%;
//           background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
//           transition: left 0.5s;
//         }

//         .btn-payment:hover:not(:disabled) {
//           background: linear-gradient(135deg, #218838, #1e7e34);
//           transform: translateY(-3px);
//           box-shadow: 0 8px 25px rgba(40, 167, 69, 0.4);
//         }

//         .btn-payment:hover:not(:disabled)::before {
//           left: 100%;
//         }

//         .btn-payment:disabled {
//           opacity: 0.7;
//           cursor: not-allowed;
//           transform: none;
//         }

//         .payment-text {
//           font-size: 1.1rem;
//           font-weight: 700;
//         }

//         .payment-amount {
//           font-size: 0.9rem;
//           opacity: 0.9;
//         }

//         .btn-spinner {
//           width: 20px;
//           height: 20px;
//           border: 2px solid rgba(255, 255, 255, 0.3);
//           border-top: 2px solid white;
//           border-radius: 50%;
//           animation: spin 1s linear infinite;
//         }

//         .error-message {
//           display: flex;
//           align-items: center;
//           gap: 0.75rem;
//           padding: 1rem 1.5rem;
//           background: linear-gradient(135deg, #f8d7da, #f5c6cb);
//           border: 1px solid #f5c6cb;
//           border-radius: 12px;
//           margin-top: 1rem;
//         }

//         .error-icon {
//           font-size: 1.5rem;
//         }

//         .error-text {
//           color: #721c24;
//           font-weight: 500;
//         }

//         .security-notice {
//           display: flex;
//           align-items: flex-start;
//           gap: 1rem;
//           padding: 1.5rem;
//           background: linear-gradient(135deg, #d1ecf1, #bee5eb);
//           border: 1px solid #bee5eb;
//           border-radius: 16px;
//           margin-top: 1rem;
//         }

//         .security-icon {
//           font-size: 2rem;
//           color: #0c5460;
//         }

//         .security-content {
//           flex: 1;
//         }

//         .security-title {
//           font-size: 1rem;
//           font-weight: 600;
//           color: #0c5460;
//           margin-bottom: 0.5rem;
//         }

//         .security-text {
//           font-size: 0.9rem;
//           color: #0c5460;
//           line-height: 1.6;
//           margin: 0;
//         }

//         @media (max-width: 768px) {
//           .container {
//             padding: 1rem;
//           }

//           .checkout-header {
//             padding: 2rem 1rem;
//             margin-bottom: 2rem;
//           }

//           .order-summary, .payment-section {
//             padding: 1.5rem;
//           }

//           .summary-header, .payment-header {
//             flex-direction: column;
//             align-items: stretch;
//             gap: 1rem;
//             text-align: center;
//           }

//           .order-item {
//             flex-direction: column;
//             align-items: stretch;
//             gap: 1rem;
//             text-align: center;
//           }

//           .item-details {
//             justify-content: center;
//           }

//           .total-row {
//             flex-direction: column;
//             gap: 0.5rem;
//             text-align: center;
//           }

//           .method-item {
//             flex-direction: column;
//             text-align: center;
//             gap: 1rem;
//           }

//           .security-notice {
//             flex-direction: column;
//             text-align: center;
//           }
//         }
//       `}</style>
//     </>
//   );
// }

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

  // ✅ FIXED: Fungsi untuk mendapatkan email user yang login
  const getUserEmail = () => {
    // 1. Coba dari checkout data
    if (checkout?.email && checkout.email !== "test@example.com") {
      return checkout.email;
    }

    // 2. Coba dari localStorage (user data setelah login)
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        if (user.email) {
          console.log("📧 Email dari localStorage:", user.email);
          return user.email;
        }
      }
    } catch (e) {
      console.warn("⚠️ Failed to parse user from localStorage");
    }

    // 3. Coba dari sessionStorage
    try {
      const userData = sessionStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        if (user.email) {
          console.log("📧 Email dari sessionStorage:", user.email);
          return user.email;
        }
      }
    } catch (e) {
      console.warn("⚠️ Failed to parse user from sessionStorage");
    }

    // 4. Coba cari key lain yang mungkin menyimpan email
    try {
      const email = localStorage.getItem('userEmail') || 
                    sessionStorage.getItem('userEmail') ||
                    localStorage.getItem('email');
      if (email) {
        console.log("📧 Email dari storage:", email);
        return email;
      }
    } catch (e) {
      console.warn("⚠️ Failed to get email from storage");
    }

    console.warn("⚠️ Email tidak ditemukan, menggunakan fallback");
    return "test@example.com";
  };

  // Payment handler
  const handlePayment = async () => {
    if (!checkout) return;
    setPaymentLoading(true);
    setError("");

    // ✅ FIXED: Ambil email user yang benar
    const userEmail = getUserEmail();
    console.log("📧 Email yang akan digunakan:", userEmail);

    try {
      const res = await fetch("/api/createInvoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: checkout.total,
          description: "Pembayaran produk",
          email: userEmail, // ✅ Gunakan email yang sudah di-resolve
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

      if (data.invoiceUrl && data.id) {
        window.location.href = `${data.invoiceUrl}?invoice_id=${data.id}`;
      } else {
        setError(data.error || "Invoice tidak tersedia");
      }
    } catch (err) {
      console.error("Error handlePayment:", err);
      setError("Terjadi kesalahan saat membuat pembayaran");
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p className="loading-text">Loading checkout...</p>
    </div>
  );

  return (
    <>
      <Script src="https://js.xendit.co/v1/xendit.min.js" strategy="beforeInteractive" />
      
      <div className="container">
        <div className="checkout-wrapper">
          <header className="checkout-header">
            <div className="header-icon">🛒</div>
            <h1 className="page-title">Checkout</h1>
            <p className="page-subtitle">Review pesanan Anda sebelum melanjutkan pembayaran</p>
          </header>

          <div className="checkout-content">
            {/* Order Summary */}
            <section className="order-summary">
              <div className="summary-header">
                <h2 className="summary-title">
                  <span className="summary-icon">📋</span>
                  Ringkasan Pesanan
                </h2>
                <div className="items-count">
                  {checkout?.items?.length || 0} item
                </div>
              </div>

              <div className="items-list">
                {checkout && checkout.items.map((item, i) => (
                  <div key={i} className="order-item">
                    <div className="item-info">
                      <h3 className="item-name">{item.name}</h3>
                      <div className="item-details">
                        <span className="item-quantity">Qty: {item.qty}</span>
                        <span className="item-price">Rp{item.price.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="item-total">
                      Rp{(item.price * item.qty).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <div className="total-section">
                <div className="total-row">
                  <span className="total-label">Total Pembayaran:</span>
                  <span className="total-amount">Rp{checkout?.total?.toLocaleString()}</span>
                </div>
              </div>
            </section>

            {/* Payment Section */}
            <section className="payment-section">
              <div className="payment-header">
                <h2 className="payment-title">
                  <span className="payment-icon">💳</span>
                  Metode Pembayaran
                </h2>
                <p className="payment-subtitle">Pilih metode pembayaran yang diinginkan</p>
              </div>

              <div className="payment-methods">
                <div className="method-item active">
                  <div className="method-icon">🏦</div>
                  <div className="method-info">
                    <h4>Xendit Payment Gateway</h4>
                    <p>Kartu Kredit, E-Wallet, Transfer Bank</p>
                  </div>
                  <div className="method-check">✓</div>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={paymentLoading}
                className="btn btn-payment"
              >
                {paymentLoading ? (
                  <>
                    <div className="btn-spinner"></div>
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <span className="payment-text">Bayar Sekarang</span>
                    <span className="payment-amount">Rp{checkout?.total?.toLocaleString()}</span>
                  </>
                )}
              </button>

              {error && (
                <div className="error-message">
                  <div className="error-icon">⚠️</div>
                  <span className="error-text">{error}</span>
                </div>
              )}
            </section>

            {/* Security Notice */}
            <div className="security-notice">
              <div className="security-icon">🔒</div>
              <div className="security-content">
                <h4 className="security-title">Pembayaran Aman</h4>
                <p className="security-text">
                  Transaksi Anda diamankan dengan enkripsi SSL 256-bit dan diproses melalui Xendit yang telah tersertifikasi PCI DSS.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
          padding: 2rem 1rem;
        }

        .loading-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          flex-direction: column;
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

        .checkout-wrapper {
          max-width: 800px;
          margin: 0 auto;
        }

        .checkout-header {
          text-align: center;
          margin-bottom: 3rem;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          padding: 3rem 2rem;
          border-radius: 24px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .header-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          display: block;
        }

        .page-title {
          font-size: clamp(2.5rem, 5vw, 3.5rem);
          font-weight: 700;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #007bff, #28a745);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .page-subtitle {
          font-size: 1.1rem;
          color: #6c757d;
          margin: 0;
          line-height: 1.6;
        }

        .checkout-content {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .order-summary, .payment-section {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 2rem;
        }

        .summary-header, .payment-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }

        .summary-title, .payment-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #212529;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .summary-icon, .payment-icon {
          font-size: 1.2em;
        }

        .items-count {
          background: linear-gradient(135deg, #007bff, #0056b3);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .items-list {
          margin-bottom: 2rem;
        }

        .order-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          background: rgba(248, 249, 250, 0.5);
          border-radius: 12px;
          margin-bottom: 1rem;
          border: 1px solid rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }

        .order-item:hover {
          background: rgba(248, 249, 250, 0.8);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .item-info {
          flex: 1;
        }

        .item-name {
          font-size: 1.1rem;
          font-weight: 600;
          color: #212529;
          margin-bottom: 0.5rem;
        }

        .item-details {
          display: flex;
          gap: 1rem;
          font-size: 0.9rem;
          color: #6c757d;
        }

        .item-quantity {
          font-weight: 500;
        }

        .item-price {
          color: #28a745;
          font-weight: 600;
        }

        .item-total {
          font-size: 1.1rem;
          font-weight: 700;
          color: #28a745;
        }

        .total-section {
          border-top: 2px solid rgba(0, 0, 0, 0.1);
          padding-top: 1.5rem;
        }

        .total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .total-label {
          font-size: 1.25rem;
          font-weight: 600;
          color: #212529;
        }

        .total-amount {
          font-size: 1.5rem;
          font-weight: 700;
          color: #28a745;
        }

        .payment-subtitle {
          font-size: 1rem;
          color: #6c757d;
          margin: 0;
          line-height: 1.6;
        }

        .payment-methods {
          margin-bottom: 2rem;
        }

        .method-item {
          display: flex;
          align-items: center;
          padding: 1.5rem;
          background: rgba(248, 249, 250, 0.5);
          border: 2px solid #dee2e6;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          gap: 1rem;
        }

        .method-item.active {
          border-color: #007bff;
          background: rgba(0, 123, 255, 0.05);
        }

        .method-item:hover {
          border-color: #007bff;
          background: rgba(0, 123, 255, 0.08);
          transform: translateY(-2px);
        }

        .method-icon {
          font-size: 2rem;
        }

        .method-info {
          flex: 1;
        }

        .method-info h4 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #212529;
          margin-bottom: 0.25rem;
        }

        .method-info p {
          font-size: 0.9rem;
          color: #6c757d;
          margin: 0;
        }

        .method-check {
          font-size: 1.5rem;
          color: #28a745;
          font-weight: bold;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 1rem 2rem;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 600;
          font-size: 1rem;
          transition: all 0.3s ease;
          cursor: pointer;
          border: none;
          gap: 0.75rem;
          position: relative;
          overflow: hidden;
          width: 100%;
        }

        .btn-payment {
          background: linear-gradient(135deg, #28a745, #20c997);
          color: white;
          box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
          padding: 1.25rem 2rem;
          font-size: 1.1rem;
          flex-direction: column;
          gap: 0.25rem;
        }

        .btn-payment::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s;
        }

        .btn-payment:hover:not(:disabled) {
          background: linear-gradient(135deg, #218838, #1e7e34);
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(40, 167, 69, 0.4);
        }

        .btn-payment:hover:not(:disabled)::before {
          left: 100%;
        }

        .btn-payment:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .payment-text {
          font-size: 1.1rem;
          font-weight: 700;
        }

        .payment-amount {
          font-size: 0.9rem;
          opacity: 0.9;
        }

        .btn-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.5rem;
          background: linear-gradient(135deg, #f8d7da, #f5c6cb);
          border: 1px solid #f5c6cb;
          border-radius: 12px;
          margin-top: 1rem;
        }

        .error-icon {
          font-size: 1.5rem;
        }

        .error-text {
          color: #721c24;
          font-weight: 500;
        }

        .security-notice {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1.5rem;
          background: linear-gradient(135deg, #d1ecf1, #bee5eb);
          border: 1px solid #bee5eb;
          border-radius: 16px;
          margin-top: 1rem;
        }

        .security-icon {
          font-size: 2rem;
          color: #0c5460;
        }

        .security-content {
          flex: 1;
        }

        .security-title {
          font-size: 1rem;
          font-weight: 600;
          color: #0c5460;
          margin-bottom: 0.5rem;
        }

        .security-text {
          font-size: 0.9rem;
          color: #0c5460;
          line-height: 1.6;
          margin: 0;
        }

        @media (max-width: 768px) {
          .container {
            padding: 1rem;
          }

          .checkout-header {
            padding: 2rem 1rem;
            margin-bottom: 2rem;
          }

          .order-summary, .payment-section {
            padding: 1.5rem;
          }

          .summary-header, .payment-header {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
            text-align: center;
          }

          .order-item {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
            text-align: center;
          }

          .item-details {
            justify-content: center;
          }

          .total-row {
            flex-direction: column;
            gap: 0.5rem;
            text-align: center;
          }

          .method-item {
            flex-direction: column;
            text-align: center;
            gap: 1rem;
          }

          .security-notice {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </>
  );
}