import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '50px',
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ 
        fontSize: '48px', 
        marginBottom: '20px',
        background: 'linear-gradient(45deg, #007bff, #28a745)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        🛒 WEB Payment Gateway
      </h1>
      
      <p style={{ 
        fontSize: '18px', 
        color: '#666', 
        marginBottom: '40px' 
      }}>
        Demo aplikasi e-commerce dengan integrasi Xendit Payment Gateway
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginTop: '40px'
      }}>
        
        {/* Select Items Card */}
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '30px',
          borderRadius: '12px',
          border: '1px solid #dee2e6',
          transition: 'transform 0.2s',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '15px' }}>🛍️</div>
          <h3 style={{ marginBottom: '15px', color: '#333' }}>Select Items</h3>
          <p style={{ color: '#666', marginBottom: '20px', fontSize: '14px' }}>
            Pilih produk yang ingin dibeli dan masukkan ke keranjang
          </p>
          <Link 
            href="/select-items" 
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              padding: '12px 24px',
              textDecoration: 'none',
              borderRadius: '6px',
              display: 'inline-block',
              fontWeight: 'bold',
              transition: 'background-color 0.2s'
            }}
          >
            Mulai Belanja
          </Link>
        </div>

        {/* Checkout Card */}
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '30px',
          borderRadius: '12px',
          border: '1px solid #dee2e6',
          opacity: 0.7
        }}>
          <div style={{ fontSize: '48px', marginBottom: '15px' }}>📋</div>
          <h3 style={{ marginBottom: '15px', color: '#333' }}>Checkout</h3>
          <p style={{ color: '#666', marginBottom: '20px', fontSize: '14px' }}>
            Review pesanan Anda sebelum melakukan pembayaran
          </p>
          <span style={{
            backgroundColor: '#6c757d',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '6px',
            display: 'inline-block',
            fontWeight: 'bold'
          }}>
            Butuh Items Dulu
          </span>
        </div>

        {/* Payment Card */}
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '30px',
          borderRadius: '12px',
          border: '1px solid #dee2e6',
          opacity: 0.7
        }}>
          <div style={{ fontSize: '48px', marginBottom: '15px' }}>💳</div>
          <h3 style={{ marginBottom: '15px', color: '#333' }}>Payment</h3>
          <p style={{ color: '#666', marginBottom: '20px', fontSize: '14px' }}>
            Bayar dengan berbagai metode: Kartu, E-Wallet, dll
          </p>
          <span style={{
            backgroundColor: '#6c757d',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '6px',
            display: 'inline-block',
            fontWeight: 'bold'
          }}>
            Selesaikan Checkout
          </span>
        </div>
      </div>

      {/* Features Section */}
      <div style={{ marginTop: '60px', textAlign: 'left' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
          🚀 Fitur Payment Gateway
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px'
        }}>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '36px', marginBottom: '10px' }}>💳</div>
            <h4 style={{ color: '#333', marginBottom: '8px' }}>Direct Card</h4>
            <p style={{ fontSize: '14px', color: '#666' }}>
              Form kartu kredit langsung di website
            </p>
          </div>
          
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '36px', marginBottom: '10px' }}>📱</div>
            <h4 style={{ color: '#333', marginBottom: '8px' }}>E-Wallet</h4>
            <p style={{ fontSize: '14px', color: '#666' }}>
              DANA, OVO, GoPay integration
            </p>
          </div>
          
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '36px', marginBottom: '10px' }}>🔗</div>
            <h4 style={{ color: '#333', marginBottom: '8px' }}>Embedded</h4>
            <p style={{ fontSize: '14px', color: '#666' }}>
              Modal checkout tanpa redirect
            </p>
          </div>
          
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '36px', marginBottom: '10px' }}>🔒</div>
            <h4 style={{ color: '#333', marginBottom: '8px' }}>Secure</h4>
            <p style={{ fontSize: '14px', color: '#666' }}>
              SSL encryption & tokenization
            </p>
          </div>
        </div>
      </div>

      {/* Demo Notice */}
      <div style={{
        marginTop: '40px',
        backgroundColor: '#fff3cd',
        border: '1px solid #ffeaa7',
        borderRadius: '8px',
        padding: '20px',
        color: '#856404'
      }}>
        <h4 style={{ margin: '0 0 10px 0' }}>🧪 Demo Mode</h4>
        <p style={{ margin: 0, fontSize: '14px' }}>
          Aplikasi ini menggunakan Xendit test environment. 
          Gunakan test card: <strong>4000 0000 0000 0002</strong> untuk testing.
        </p>
      </div>
    </div>
  );
}