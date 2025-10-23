import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function PaymentPage() {
  const router = useRouter();
  const { id } = router.query;
  const [checkout, setCheckout] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card"); // card, ewallet, embedded

  // Card form states
  const [cardForm, setCardForm] = useState({
    number: "",
    expMonth: "",
    expYear: "",
    cvv: "",
    holderName: ""
  });

  useEffect(() => {
    if (!id) return;
    
    fetch(`/api/checkout?id=${id}`)
      .then((res) => res.json())
      .then((data) => setCheckout(data))
      .catch((err) => setError(err.message));
  }, [id]);

  // Inisialisasi Xendit
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Xendit) {
      window.Xendit.setPublishableKey('xnd_public_development_O46JfOtygef9kMNsK+ZPGT+ZZ9b3ooF4w3Dn+R1HNkCYxH8y7r');
    }
  }, []);

  const handleCardPayment = async (e) => {
    e.preventDefault();
    if (!checkout || !window.Xendit) return;

    setLoading(true);
    setError("");

    try {
      // Buat token dari kartu
      const tokenData = await window.Xendit.card.createToken({
        amount: checkout.total,
        card_number: cardForm.number.replace(/\s/g, ''),
        card_exp_month: cardForm.expMonth,
        card_exp_year: cardForm.expYear,
        card_cvv: cardForm.cvv,
        is_multiple_use: false
      });

      console.log("Token created:", tokenData);

      // Kirim token ke backend untuk charge
      const res = await fetch("/api/chargeCard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token_id: tokenData.id,
          amount: checkout.total,
          description: "Pembayaran produk UTS",
          external_id: `order-${id}-${Date.now()}`
        }),
      });

      const result = await res.json();
      
      if (result.status === 'CAPTURED') {
        alert("Pembayaran berhasil!");
        router.push('/payment-success');
      } else {
        setError(`Pembayaran gagal: ${result.failure_reason || 'Unknown error'}`);
      }

    } catch (err) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan pada pembayaran");
    } finally {
      setLoading(false);
    }
  };

  const handleEWalletPayment = async (channel) => {
    if (!checkout) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/createEWallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: checkout.total,
          channel: channel, // ID_DANA, ID_OVO, ID_GOPAY
          external_id: `ewallet-${id}-${Date.now()}`
        }),
      });

      const data = await res.json();
      
      if (data.actions?.desktop_web_checkout_url) {
        // Buka di popup atau iframe
        window.open(data.actions.desktop_web_checkout_url, '_blank', 'width=600,height=700');
      } else {
        setError("E-Wallet URL tidak tersedia");
      }

    } catch (err) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const handleEmbeddedCheckout = async () => {
    if (!checkout || !window.Xendit) return;
    
    setLoading(true);
    setError("");

    try {
      const xenditCheckout = window.Xendit.createCheckout({
        external_id: `embedded-${id}-${Date.now()}`,
        amount: checkout.total,
        currency: 'IDR',
        success_redirect_url: 'http://localhost:3000/payment-success',
        failure_redirect_url: 'http://localhost:3000/payment-failed'
      });

      xenditCheckout.show();
    } catch (err) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  if (!checkout) return <p>Loading checkout...</p>;

  return (
    <>
      <Head>
        <script src="https://js.xendit.co/v1/xendit.min.js"></script>
      </Head>

      <div style={{ maxWidth: "500px", margin: "0 auto", padding: "20px" }}>
        <h1>Payment - Rp{checkout.total.toLocaleString()}</h1>
        
        {/* Payment Method Selector */}
        <div style={{ marginBottom: "20px" }}>
          <label>
            <input 
              type="radio" 
              value="card" 
              checked={paymentMethod === "card"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Credit/Debit Card
          </label>
          <br/>
          <label>
            <input 
              type="radio" 
              value="ewallet" 
              checked={paymentMethod === "ewallet"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            E-Wallet
          </label>
          <br/>
          <label>
            <input 
              type="radio" 
              value="embedded" 
              checked={paymentMethod === "embedded"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Embedded Checkout
          </label>
        </div>

        {/* Card Payment Form */}
        {paymentMethod === "card" && (
          <form onSubmit={handleCardPayment} style={{ marginBottom: "20px" }}>
            <h3>Card Details</h3>
            <input
              type="text"
              placeholder="Card Number (4000 0000 0000 0002 for test)"
              value={cardForm.number}
              onChange={(e) => setCardForm({...cardForm, number: e.target.value})}
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
              required
            />
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="text"
                placeholder="MM"
                value={cardForm.expMonth}
                onChange={(e) => setCardForm({...cardForm, expMonth: e.target.value})}
                style={{ flex: 1, padding: "8px" }}
                maxLength="2"
                required
              />
              <input
                type="text"
                placeholder="YYYY"
                value={cardForm.expYear}
                onChange={(e) => setCardForm({...cardForm, expYear: e.target.value})}
                style={{ flex: 1, padding: "8px" }}
                maxLength="4"
                required
              />
              <input
                type="text"
                placeholder="CVV"
                value={cardForm.cvv}
                onChange={(e) => setCardForm({...cardForm, cvv: e.target.value})}
                style={{ flex: 1, padding: "8px" }}
                maxLength="4"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                background: "#4CAF50",
                color: "white",
                padding: "12px",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                marginTop: "10px"
              }}
            >
              {loading ? "Processing..." : "Pay with Card"}
            </button>
          </form>
        )}

        {/* E-Wallet Options */}
        {paymentMethod === "ewallet" && (
          <div style={{ marginBottom: "20px" }}>
            <h3>Choose E-Wallet</h3>
            <button
              onClick={() => handleEWalletPayment('ID_DANA')}
              disabled={loading}
              style={{
                width: "100%",
                background: "#00A8E8",
                color: "white",
                padding: "12px",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                marginBottom: "10px"
              }}
            >
              DANA
            </button>
            <button
              onClick={() => handleEWalletPayment('ID_OVO')}
              disabled={loading}
              style={{
                width: "100%",
                background: "#7B3F99",
                color: "white",
                padding: "12px",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                marginBottom: "10px"
              }}
            >
              OVO
            </button>
            <button
              onClick={() => handleEWalletPayment('ID_GOPAY')}
              disabled={loading}
              style={{
                width: "100%",
                background: "#00AA5B",
                color: "white",
                padding: "12px",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
              }}
            >
              GoPay
            </button>
          </div>
        )}

        {/* Embedded Checkout */}
        {paymentMethod === "embedded" && (
          <button
            onClick={handleEmbeddedCheckout}
            disabled={loading}
            style={{
              width: "100%",
              background: "#FF6B35",
              color: "white",
              padding: "12px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              marginBottom: "20px"
            }}
          >
            {loading ? "Loading..." : "Open Xendit Checkout"}
          </button>
        )}

        {error && <p style={{ color: "red", marginTop: "20px" }}>⚠️ {error}</p>}
      </div>
    </>
  );
}