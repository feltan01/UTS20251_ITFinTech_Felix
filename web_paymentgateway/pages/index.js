import Link from 'next/link';

export default function Home() {
  return (
    <>
      <div className="container">
        <header className="hero-section">
          <h1 className="hero-title">
            🛒 WEB Payment Gateway
          </h1>
          
          <p className="hero-subtitle">
            Demo aplikasi e-commerce dengan integrasi Xendit Payment Gateway
          </p>
        </header>

        <div className="cards-grid">
          {/* Select Items Card */}
          <div className="card card-active">
            <div className="card-icon">🛍️</div>
            <h3 className="card-title">Select Items</h3>
            <p className="card-description">
              Pilih produk yang ingin dibeli dan masukkan ke keranjang
            </p>
            <Link href="/select-items">
              <button className="btn btn-primary">
                <span className="btn-text">Mulai Belanja</span>
                <span className="btn-icon">🚀</span>
              </button>
            </Link>
          </div>

          {/* Checkout Card */}
          <div className="card card-disabled">
            <div className="card-icon">📋</div>
            <h3 className="card-title">Checkout</h3>
            <p className="card-description">
              Review pesanan Anda sebelum melakukan pembayaran
            </p>
            <span className="btn btn-disabled">
              <span className="btn-text">Butuh Items Dulu</span>
            </span>
          </div>

          {/* Payment Card */}
          <div className="card card-disabled">
            <div className="card-icon">💳</div>
            <h3 className="card-title">Payment</h3>
            <p className="card-description">
              Bayar dengan berbagai metode: Kartu, E-Wallet, dll
            </p>
            <span className="btn btn-disabled">
              <span className="btn-text">Selesaikan Checkout</span>
            </span>
          </div>
        </div>

        {/* Features Section */}
        <section className="features-section">
          <h2 className="features-title">
            🚀 Fitur Payment Gateway
          </h2>
          
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">💳</div>
              <h4 className="feature-title">Direct Card</h4>
              <p className="feature-description">
                Form kartu kredit langsung di website
              </p>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">📱</div>
              <h4 className="feature-title">E-Wallet</h4>
              <p className="feature-description">
                DANA, OVO, GoPay integration
              </p>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">🔗</div>
              <h4 className="feature-title">Embedded</h4>
              <p className="feature-description">
                Modal checkout tanpa redirect
              </p>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">🔒</div>
              <h4 className="feature-title">Secure</h4>
              <p className="feature-description">
                SSL encryption & tokenization
              </p>
            </div>
          </div>
        </section>

        {/* Demo Notice */}
        <div className="demo-notice">
          <h4 className="demo-title">🧪 Demo Mode</h4>
          <p className="demo-description">
            Aplikasi ini menggunakan Xendit test environment. 
            Gunakan test card: <strong>4000 0000 0000 0002</strong> untuk testing.
          </p>
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

        .hero-section {
          text-align: center;
          max-width: 800px;
          margin: 0 auto 4rem auto;
          padding: 3rem 2rem;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 24px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .hero-title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 700;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #007bff, #28a745);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .hero-subtitle {
          font-size: 1.25rem;
          color: #495057;
          margin: 0;
          font-weight: 400;
          line-height: 1.6;
        }

        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto 4rem auto;
        }

        .card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          padding: 2.5rem;
          border-radius: 20px;
          text-align: center;
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          position: relative;
          overflow: hidden;
        }

        .card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          transition: left 0.5s;
        }

        .card-active {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 123, 255, 0.2);
        }

        .card-active:hover {
          transform: translateY(-10px);
          box-shadow: 0 25px 50px rgba(0, 123, 255, 0.3);
        }

        .card-active:hover::before {
          left: 100%;
        }

        .card-disabled {
          opacity: 0.7;
        }

        .card-disabled:hover {
          transform: translateY(-3px);
          opacity: 0.8;
        }

        .card-icon {
          font-size: 4rem;
          margin-bottom: 1.5rem;
          display: block;
        }

        .card-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #212529;
          margin-bottom: 1rem;
        }

        .card-description {
          color: #6c757d;
          margin-bottom: 2rem;
          font-size: 0.95rem;
          line-height: 1.6;
        }

        .btn {
          display: inline-block;
          padding: 0.875rem 2rem;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          cursor: pointer;
          border: none;
          position: relative;
          overflow: hidden;
        }

        .btn-primary {
          background: linear-gradient(135deg, #007bff, #0056b3);
          color: white;
          box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .btn-text {
          transition: transform 0.3s ease;
        }

        .btn-icon {
          transition: transform 0.3s ease;
          display: inline-block;
        }

        .btn-primary:hover .btn-text {
          transform: translateX(-3px);
        }

        .btn-primary:hover .btn-icon {
          transform: translateX(3px) rotate(10deg);
        }

        .btn-primary::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 123, 255, 0.4);
          background: linear-gradient(135deg, #0056b3, #004085);
        }

        .btn-primary:hover::before {
          left: 100%;
        }

        .btn-primary:active {
          transform: translateY(0px);
          transition: transform 0.1s;
        }

        .btn-disabled {
          background: linear-gradient(135deg, #6c757d, #495057);
          color: white;
          cursor: not-allowed;
        }

        .features-section {
          max-width: 1200px;
          margin: 0 auto 4rem auto;
          padding: 3rem 2rem;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 24px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .features-title {
          text-align: center;
          font-size: 2.5rem;
          font-weight: 700;
          color: #212529;
          margin-bottom: 3rem;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .feature-item {
          text-align: center;
          padding: 2rem 1rem;
          transition: transform 0.3s ease;
          border-radius: 16px;
        }

        .feature-item:hover {
          transform: translateY(-5px);
          background: rgba(0, 123, 255, 0.05);
        }

        .feature-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          display: block;
        }

        .feature-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #212529;
          margin-bottom: 0.75rem;
        }

        .feature-description {
          font-size: 0.95rem;
          color: #6c757d;
          line-height: 1.6;
          margin: 0;
        }

        .demo-notice {
          max-width: 800px;
          margin: 0 auto;
          background: linear-gradient(135deg, #fff3cd, #ffeaa7);
          border: 1px solid #f0ad4e;
          border-radius: 16px;
          padding: 2rem;
          text-align: center;
          box-shadow: 0 10px 30px rgba(240, 173, 78, 0.2);
        }

        .demo-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #856404;
          margin: 0 0 1rem 0;
        }

        .demo-description {
          color: #856404;
          font-size: 0.95rem;
          line-height: 1.6;
          margin: 0;
        }

        .demo-description strong {
          color: #7c4a03;
          font-weight: 700;
        }

        @media (max-width: 768px) {
          .container {
            padding: 1rem;
          }

          .hero-section {
            padding: 2rem 1rem;
            margin-bottom: 2rem;
          }

          .cards-grid {
            gap: 1.5rem;
            margin-bottom: 2rem;
          }

          .card {
            padding: 2rem 1.5rem;
          }

          .features-section {
            padding: 2rem 1rem;
            margin-bottom: 2rem;
          }

          .features-grid {
            gap: 1.5rem;
          }

          .demo-notice {
            padding: 1.5rem;
          }
        }
      `}</style>
    </>
  );
}