import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [user, setUser] = useState(null);
  const [showMFA, setShowMFA] = useState(false);
  const [pendingAuth, setPendingAuth] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    mfaCode: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

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
        setError(data.error || 'Registrasi gagal');
      }
    } catch (err) {
      setError('Terjadi kesalahan. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

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
        // Send MFA code via WhatsApp
        setPendingAuth(data.user);
        setShowMFA(true);
        alert('📱 Kode verifikasi telah dikirim ke WhatsApp Anda!');
      } else {
        setError(data.error || 'Login gagal');
      }
    } catch (err) {
      setError('Terjadi kesalahan. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyMFA = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  if (!pendingAuth?.email) {
    setError('Email user tidak ditemukan, login ulang');
    setLoading(false);
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
      setError(data.error || 'Kode verifikasi salah');
    } else {
      localStorage.setItem('user', JSON.stringify(pendingAuth));
      setUser(pendingAuth);
      setShowAuth(false);
      setShowMFA(false);
      setFormData(prev => ({ ...prev, mfaCode: '' }));
      alert('✅ Login berhasil!');

      if (pendingAuth.role === 'admin') {
        router.push('/admin/dashboard');
      }
    }
  } catch (err) {
    console.error(err);
    setError('Terjadi kesalahan. Coba lagi.');
  } finally {
    setLoading(false);
  }
};


  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    alert('👋 Anda telah logout');
  };

  return (
    <>
      <div className="container">
        <header className="hero-section">
          <div className="user-section">
            {user ? (
              <div className="user-info">
                <span className="user-name">👋 Halo, {user.name}</span>
                {user.role === 'admin' && (
                  <Link href="/admin/dashboard">
                    <button className="btn-small btn-admin">📊 Dashboard Admin</button>
                  </Link>
                )}
                <button className="btn-small btn-logout" onClick={handleLogout}>
                  🚪 Logout
                </button>
              </div>
            ) : (
              <button className="btn-small btn-login" onClick={() => setShowAuth(true)}>
                🔐 Login / Register
              </button>
            )}
          </div>

          <h1 className="hero-title">
            🛒 WEB Payment Gateway
          </h1>
          
          <p className="hero-subtitle">
            Demo aplikasi e-commerce dengan integrasi Xendit Payment Gateway
          </p>
        </header>

        {/* Auth Modal */}
        {showAuth && (
          <div className="modal-overlay" onClick={() => setShowAuth(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setShowAuth(false)}>✕</button>
              
              {!showMFA ? (
                <>
                  <h2 className="modal-title">
                    {authMode === 'login' ? '🔐 Login' : '📝 Register'}
                  </h2>

                  {error && <div className="error-message">{error}</div>}

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

                    <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                      {loading ? '⏳ Processing...' : authMode === 'login' ? '🔓 Login' : '📝 Register'}
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

                  {error && <div className="error-message">{error}</div>}

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

                    <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                      {loading ? '⏳ Verifying...' : '✓ Verify'}
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

        <div className="cards-grid">
          <div className="card card-active">
            <div className="card-icon">🛍️</div>
            <h3 className="card-title">Select Items</h3>
            <p className="card-description">
              Pilih produk yang ingin dibeli dan masukkan ke keranjang
            </p>
            <Link href={user ? "/select-items" : "#"}>
              <button
                className="btn btn-primary"
                onClick={(e) => {
                  if (!user) {
                    e.preventDefault(); // cegah navigasi
                    setShowAuth(true); // tampilkan modal login
                    setAuthMode("login"); // pastikan modal dalam mode login
                  }
                }}
              >
                <span className="btn-text">Mulai Belanja</span>
                <span className="btn-icon">🚀</span>
              </button>
            </Link>
          </div>

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

        <section className="features-section">
          <h2 className="features-title">🚀 Fitur Payment Gateway</h2>
          
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
          position: relative;
        }

        .user-section {
          position: absolute;
          top: 1rem;
          right: 1rem;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .user-name {
          font-weight: 600;
          color: #212529;
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

        .btn-admin {
          background: linear-gradient(135deg, #28a745, #1e7e34);
          color: white;
        }

        .btn-admin:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
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

        .hero-title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 700;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #007bff, #28a745);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-top: 1rem;
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

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
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
            padding: 3rem 1rem 2rem 1rem;
            margin-bottom: 2rem;
          }

          .user-section {
            position: relative;
            top: 0;
            right: 0;
            margin-bottom: 1rem;
            text-align: center;
          }

          .user-info {
            justify-content: center;
          }

          .modal-content {
            padding: 2rem 1.5rem;
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