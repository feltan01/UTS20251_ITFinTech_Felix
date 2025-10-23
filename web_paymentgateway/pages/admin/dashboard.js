import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'products', 'analytics'

  // Orders state
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Products state
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    stock: ''
  });

  // Analytics state
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    pendingPayments: 0,
    dailyStats: [],
    monthlyStats: []
  });

  useEffect(() => {
    // Check if user is admin
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/');
      return;
    }

    const userData = JSON.parse(storedUser);
    if (userData.role !== 'admin') {
      alert('⛔ Akses ditolak! Anda bukan admin.');
      router.push('/');
      return;
    }

    setUser(userData);
    setLoading(false);
    loadOrders();
    loadProducts();
    loadAnalytics();
  }, []);

  const loadOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      if (res.ok) {
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const loadProducts = async () => {
    setProductsLoading(true);
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      if (res.ok) {
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setProductsLoading(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      const res = await fetch('/api/admin/analytics');
      const data = await res.json();
      if (res.ok) {
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const endpoint = editingProduct 
      ? `/api/admin/products/${editingProduct._id}`
      : '/api/admin/products';
    
    const method = editingProduct ? 'PUT' : 'POST';

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productForm)
      });

      if (res.ok) {
        alert(editingProduct ? '✅ Produk berhasil diupdate!' : '✅ Produk berhasil ditambahkan!');
        setShowProductForm(false);
        setEditingProduct(null);
        setProductForm({ name: '', price: '', description: '', image: '', stock: '' });
        loadProducts();
        loadAnalytics();
      } else {
        const data = await res.json();
        alert('❌ ' + (data.error || 'Gagal menyimpan produk'));
      }
    } catch (error) {
      alert('❌ Terjadi kesalahan');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.image,
      stock: product.stock
    });
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Yakin ingin menghapus produk ini?')) return;

    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        alert('✅ Produk berhasil dihapus!');
        loadProducts();
        loadAnalytics();
      } else {
        alert('❌ Gagal menghapus produk');
      }
    } catch (error) {
      alert('❌ Terjadi kesalahan');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <div className="dashboard-container">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-content">
            <div>
              <h1>📊 Admin Dashboard</h1>
              <p className="subtitle">Selamat datang, {user?.name}</p>
            </div>
            <Link href="/">
              <button className="btn-back">← Kembali ke Home</button>
            </Link>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card stat-blue">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <p className="stat-label">Total Revenue</p>
              <h2 className="stat-value">{formatCurrency(analytics.totalRevenue)}</h2>
            </div>
          </div>

          <div className="stat-card stat-green">
            <div className="stat-icon">📦</div>
            <div className="stat-info">
              <p className="stat-label">Total Orders</p>
              <h2 className="stat-value">{analytics.totalOrders}</h2>
            </div>
          </div>

          <div className="stat-card stat-orange">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <p className="stat-label">Pending Payments</p>
              <h2 className="stat-value">{analytics.pendingPayments}</h2>
            </div>
          </div>

          <div className="stat-card stat-purple">
            <div className="stat-icon">📦</div>
            <div className="stat-info">
              <p className="stat-label">Total Products</p>
              <h2 className="stat-value">{products.length}</h2>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs-container">
          <button
            className={`tab ${activeTab === 'orders' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            📋 Orders
          </button>
          <button
            className={`tab ${activeTab === 'products' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            🛍️ Products
          </button>
          <button
            className={`tab ${activeTab === 'analytics' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            📈 Analytics
          </button>
        </div>

        {/* Content */}
        <div className="content-container">
          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="orders-section">
              <h2 className="section-title">📋 Daftar Pesanan</h2>
              {ordersLoading ? (
                <div className="loading">Loading orders...</div>
              ) : orders.length === 0 ? (
                <div className="empty-state">
                  <p>📭 Belum ada pesanan</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Products</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order._id}>
                          <td className="mono">{order.orderId || order._id.slice(-8)}</td>
                          <td>
                            <div>{order.customerName}</div>
                            <small>{order.customerEmail}</small>
                          </td>
                          <td>
                            {order.items?.map((item, idx) => (
                              <div key={idx} className="order-item">
                                {item.name} x{item.quantity}
                              </div>
                            ))}
                          </td>
                          <td className="amount">{formatCurrency(order.amount)}</td>
                          <td>
                            <span className={`status-badge status-${order.status}`}>
                              {order.status === 'paid' ? '✅ Paid' : '⏳ Pending'}
                            </span>
                          </td>
                          <td>{formatDate(order.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="products-section">
              <div className="section-header">
                <h2 className="section-title">🛍️ Manajemen Produk</h2>
                <button
                  className="btn-primary"
                  onClick={() => {
                    setShowProductForm(true);
                    setEditingProduct(null);
                    setProductForm({ name: '', price: '', description: '', image: '', stock: '' });
                  }}
                >
                  ➕ Tambah Produk
                </button>
              </div>

              {/* Product Form Modal */}
              {showProductForm && (
                <div className="modal-overlay" onClick={() => setShowProductForm(false)}>
                  <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <button className="modal-close" onClick={() => setShowProductForm(false)}>✕</button>
                    <h3>{editingProduct ? '✏️ Edit Produk' : '➕ Tambah Produk Baru'}</h3>
                    
                    <form onSubmit={handleProductSubmit}>
                      <div className="form-group">
                        <label>Nama Produk</label>
                        <input
                          type="text"
                          value={productForm.name}
                          onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Harga (IDR)</label>
                        <input
                          type="number"
                          value={productForm.price}
                          onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Deskripsi</label>
                        <textarea
                          value={productForm.description}
                          onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                          rows="3"
                        />
                      </div>

                      <div className="form-group">
                        <label>URL Gambar</label>
                        <input
                          type="url"
                          value={productForm.image}
                          onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>

                      <div className="form-group">
                        <label>Stok</label>
                        <input
                          type="number"
                          value={productForm.stock}
                          onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                          required
                        />
                      </div>

                      <button type="submit" className="btn-primary btn-full">
                        {editingProduct ? '💾 Update Produk' : '➕ Tambah Produk'}
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {productsLoading ? (
                <div className="loading">Loading products...</div>
              ) : products.length === 0 ? (
                <div className="empty-state">
                  <p>📭 Belum ada produk</p>
                </div>
              ) : (
                <div className="products-grid">
                  {products.map((product) => (
                    <div key={product._id} className="product-card">
                      {product.image && (
                        <img src={product.image} alt={product.name} className="product-image" />
                      )}
                      <div className="product-info">
                        <h4>{product.name}</h4>
                        <p className="product-price">{formatCurrency(product.price)}</p>
                        <p className="product-stock">Stok: {product.stock}</p>
                        <div className="product-actions">
                          <button className="btn-edit" onClick={() => handleEditProduct(product)}>
                            ✏️ Edit
                          </button>
                          <button className="btn-delete" onClick={() => handleDeleteProduct(product._id)}>
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="analytics-section">
              <h2 className="section-title">📈 Analytics & Reports</h2>
              
              <div className="chart-grid">
                <div className="chart-card">
                  <h3>📊 Penjualan Harian (7 Hari Terakhir)</h3>
                  <div className="chart-placeholder">
                    {analytics.dailyStats.length > 0 ? (
                      <div className="bar-chart">
                        {analytics.dailyStats.map((stat, idx) => (
                          <div key={idx} className="bar-item">
                            <div
                              className="bar"
                              style={{ height: `${(stat.revenue / Math.max(...analytics.dailyStats.map(s => s.revenue))) * 100}%` }}
                            >
                              <span className="bar-label">{formatCurrency(stat.revenue)}</span>
                            </div>
                            <span className="bar-date">{stat.date}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="empty-chart">Belum ada data penjualan</p>
                    )}
                  </div>
                </div>

                <div className="chart-card">
                  <h3>📅 Penjualan Bulanan</h3>
                  <div className="chart-placeholder">
                    {analytics.monthlyStats.length > 0 ? (
                      <div className="monthly-stats">
                        {analytics.monthlyStats.map((stat, idx) => (
                          <div key={idx} className="monthly-item">
                            <div className="monthly-month">{stat.month}</div>
                            <div className="monthly-revenue">{formatCurrency(stat.revenue)}</div>
                            <div className="monthly-orders">{stat.orders} orders</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="empty-chart">Belum ada data penjualan bulanan</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .dashboard-container {
          min-height: 100vh;
          background: #f8f9fa;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .loading-screen {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          gap: 1rem;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #e9ecef;
          border-top-color: #007bff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .dashboard-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .header-content {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .dashboard-header h1 {
          font-size: 2rem;
          margin: 0 0 0.5rem 0;
          font-weight: 700;
        }

        .subtitle {
          margin: 0;
          opacity: 0.9;
          font-size: 1rem;
        }

        .btn-back {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 2px solid white;
          padding: 0.75rem 1.5rem;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-back:hover {
          background: white;
          color: #667eea;
        }

        .stats-grid {
          max-width: 1400px;
          margin: -3rem auto 2rem auto;
          padding: 0 2rem;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .stat-card {
          background: white;
          padding: 1.5rem;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: transform 0.3s;
        }

        .stat-card:hover {
          transform: translateY(-5px);
        }

        .stat-icon {
          font-size: 2.5rem;
          width: 70px;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
        }

        .stat-blue .stat-icon { background: #e3f2fd; }
        .stat-green .stat-icon { background: #e8f5e9; }
        .stat-orange .stat-icon { background: #fff3e0; }
        .stat-purple .stat-icon { background: #f3e5f5; }

        .stat-info {
          flex: 1;
        }

        .stat-label {
          color: #6c757d;
          font-size: 0.875rem;
          margin: 0 0 0.25rem 0;
          font-weight: 500;
        }

        .stat-value {
          font-size: 1.75rem;
          font-weight: 700;
          margin: 0;
          color: #212529;
        }

        .tabs-container {
          max-width: 1400px;
          margin: 0 auto 2rem auto;
          padding: 0 2rem;
          display: flex;
          gap: 1rem;
          border-bottom: 2px solid #e9ecef;
        }

        .tab {
          background: none;
          border: none;
          padding: 1rem 1.5rem;
          font-weight: 600;
          color: #6c757d;
          cursor: pointer;
          border-bottom: 3px solid transparent;
          transition: all 0.3s;
          font-size: 1rem;
        }

        .tab:hover {
          color: #007bff;
        }

        .tab-active {
          color: #007bff;
          border-bottom-color: #007bff;
        }

        .content-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem 4rem 2rem;
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0 0 1.5rem 0;
          color: #212529;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .loading, .empty-state {
          text-align: center;
          padding: 3rem;
          color: #6c757d;
          font-size: 1.1rem;
        }

        .table-responsive {
          background: white;
          border-radius: 16px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          overflow-x: auto;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
        }

        .data-table thead {
          background: #f8f9fa;
        }

        .data-table th {
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          color: #495057;
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .data-table td {
          padding: 1rem;
          border-top: 1px solid #e9ecef;
          color: #212529;
        }

        .data-table tbody tr:hover {
          background: #f8f9fa;
        }

        .mono {
          font-family: 'Courier New', monospace;
          font-size: 0.9rem;
          color: #6c757d;
        }

        .order-item {
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
        }

        .amount {
          font-weight: 600;
          color: #28a745;
        }

        .status-badge {
          display: inline-block;
          padding: 0.375rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .status-paid {
          background: #d4edda;
          color: #155724;
        }

        .status-pending {
          background: #fff3cd;
          color: #856404;
        }

        .btn-primary {
          background: linear-gradient(135deg, #007bff, #0056b3);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 0.95rem;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
        }

        .btn-full {
          width: 100%;
          margin-top: 0.5rem;
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
          padding: 2rem;
          max-width: 500px;
          width: 100%;
          position: relative;
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
        }

        .modal-content h3 {
          margin: 0 0 1.5rem 0;
          font-size: 1.5rem;
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

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e9ecef;
          border-radius: 10px;
          font-size: 0.95rem;
          transition: all 0.3s;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .product-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s;
        }

        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .product-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }

        .product-info {
          padding: 1.25rem;
        }

        .product-info h4 {
          margin: 0 0 0.5rem 0;
          font-size: 1.1rem;
          color: #212529;
        }

        .product-price {
          font-size: 1.25rem;
          font-weight: 700;
          color: #28a745;
          margin: 0.5rem 0;
        }

        .product-stock {
          font-size: 0.875rem;
          color: #6c757d;
          margin: 0.5rem 0 1rem 0;
        }

        .product-actions {
          display: flex;
          gap: 0.5rem;
        }

        .btn-edit {
          flex: 1;
          background: #007bff;
          color: white;
          border: none;
          padding: 0.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          font-size: 0.875rem;
        }

        .btn-delete {
          flex: 1;
          background: #dc3545;
          color: white;
          border: none;
          padding: 0.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          font-size: 0.875rem;
        }

        .chart-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 2rem;
        }

        .chart-card {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        .chart-card h3 {
          margin: 0 0 1.5rem 0;
          font-size: 1.25rem;
          color: #212529;
        }

        .chart-placeholder {
          min-height: 250px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .empty-chart {
          color: #6c757d;
          font-style: italic;
        }

        .bar-chart {
          display: flex;
          align-items: flex-end;
          justify-content: space-around;
          height: 250px;
          width: 100%;
          gap: 0.5rem;
        }

        .bar-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .bar {
          width: 100%;
          background: linear-gradient(135deg, #007bff, #0056b3);
          border-radius: 8px 8px 0 0;
          position: relative;
          min-height: 30px;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 0.5rem;
          transition: all 0.3s;
        }

        .bar:hover {
          background: linear-gradient(135deg, #0056b3, #004085);
        }

        .bar-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: white;
        }

        .bar-date {
          font-size: 0.75rem;
          color: #6c757d;
          text-align: center;
        }

        .monthly-stats {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .monthly-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 10px;
          transition: all 0.3s;
        }

        .monthly-item:hover {
          background: #e9ecef;
          transform: translateX(5px);
        }

        .monthly-month {
          font-weight: 600;
          color: #212529;
        }

        .monthly-revenue {
          font-size: 1.1rem;
          font-weight: 700;
          color: #28a745;
        }

        .monthly-orders {
          font-size: 0.875rem;
          color: #6c757d;
        }

        @media (max-width: 768px) {
          .dashboard-header {
            padding: 1.5rem 1rem;
          }

          .header-content {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }

          .stats-grid {
            padding: 0 1rem;
            grid-template-columns: 1fr;
          }

          .tabs-container {
            padding: 0 1rem;
            overflow-x: auto;
          }

          .content-container {
            padding: 0 1rem 2rem 1rem;
          }

          .section-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .table-responsive {
            overflow-x: scroll;
          }

          .data-table {
            min-width: 800px;
          }

          .chart-grid {
            grid-template-columns: 1fr;
          }

          .products-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}