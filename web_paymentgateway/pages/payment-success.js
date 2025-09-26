import Link from "next/link";

export default function PaymentSuccess() {
  return (
    <>
      <div className="container">
        <header className="page-header">
          <h1 className="page-title">
            <span className="title-icon">✅</span>
            Pembayaran Berhasil
          </h1>
        </header>

        <div className="main-content">
          <div className="success-container">
            {/* Success Icon */}
            <div className="success-icon">✅</div>
            
            <h1 className="success-title">
              Pembayaran Berhasil!
            </h1>
            
            <p className="success-subtitle">
              Transaksi Anda telah berhasil diproses
            </p>

            {/* Status Badge */}
            <div className="status-badge">
              STATUS: LUNAS
            </div>

            {/* Message */}
            <div className="success-message">
              <p>
                Terima kasih atas pembayaran Anda! <br/>
                Pesanan Anda sedang diproses.
              </p>
            </div>

            {/* Action Button */}
            <div className="action-section">
              <Link href="/" className="btn btn-home">
                <span className="btn-icon">🏠</span>
                <span className="btn-text">Kembali ke Home</span>
              </Link>
            </div>

            {/* Footer Info */}
            <div className="footer-info">
              <p>
                Jika ada pertanyaan, silakan hubungi customer service kami
              </p>
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

        .page-header {
          max-width: 1200px;
          margin: 0 auto 2rem auto;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .page-title {
          color: white;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 1rem;
          text-align: center;
        }

        .title-icon {
          font-size: 1.2em;
        }

        .main-content {
          max-width: 600px;
          margin: 0 auto;
          display: flex;
          justify-content: center;
        }

        .success-container {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 3rem 2rem;
          text-align: center;
          width: 100%;
          position: relative;
          overflow: hidden;
        }

        .success-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          transition: left 0.5s;
        }

        .success-container:hover::before {
          left: 100%;
        }

        .success-icon {
          font-size: 5rem;
          margin-bottom: 1.5rem;
          animation: bounce 2s infinite;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }

        .success-title {
          font-size: 2rem;
          font-weight: 700;
          color: #28a745;
          margin-bottom: 1rem;
        }

        .success-subtitle {
          font-size: 1.1rem;
          color: #6c757d;
          margin-bottom: 2rem;
        }

        .status-badge {
          display: inline-block;
          background: linear-gradient(135deg, #28a745, #20c997);
          color: white;
          padding: 1rem 2rem;
          border-radius: 25px;
          font-size: 1rem;
          font-weight: 700;
          margin-bottom: 2rem;
          box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
          letter-spacing: 0.5px;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }

        .success-message {
          background: rgba(212, 237, 218, 0.8);
          border: 1px solid rgba(195, 230, 203, 0.8);
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          backdrop-filter: blur(5px);
        }

        .success-message p {
          margin: 0;
          color: #155724;
          font-size: 1rem;
          line-height: 1.6;
        }

        .action-section {
          margin-bottom: 2rem;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 1rem 2.5rem;
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
          min-width: 200px;
        }

        .btn-home {
          background: linear-gradient(135deg, #007bff, #0056b3);
          color: white;
          box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
        }

        .btn-home::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s;
        }

        .btn-home:hover {
          background: linear-gradient(135deg, #0056b3, #004085);
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(0, 123, 255, 0.4);
        }

        .btn-home:hover::before {
          left: 100%;
        }

        .btn-icon {
          font-size: 1.2em;
        }

        .footer-info {
          padding-top: 2rem;
          border-top: 1px solid rgba(0, 0, 0, 0.1);
        }

        .btn-text {
  color:rgb(0, 0, 0); /* ganti dengan warna yang kamu mau */
}

        .footer-info p {
          font-size: 0.9rem;
          color: #6c757d;
          margin: 0;
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .container {
            padding: 1rem;
          }

          .page-header {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }

          .success-container {
            padding: 2rem 1.5rem;
          }

          .success-icon {
            font-size: 4rem;
          }

          .success-title {
            font-size: 1.75rem;
          }

          .success-subtitle {
            font-size: 1rem;
          }

          .btn {
            padding: 0.875rem 2rem;
            font-size: 0.95rem;
            min-width: 180px;
          }
        }

        @media (max-width: 480px) {
          .success-container {
            padding: 1.5rem 1rem;
          }

          .success-icon {
            font-size: 3.5rem;
          }

          .success-title {
            font-size: 1.5rem;
          }

          .status-badge {
            padding: 0.75rem 1.5rem;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </>
  );
}