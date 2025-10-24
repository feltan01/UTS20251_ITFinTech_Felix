// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/router';
// import Link from 'next/link';

// export default function AdminDashboard() {
//   const router = useRouter();
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('overview');

//   const [orders, setOrders] = useState([]);
//   const [ordersLoading, setOrdersLoading] = useState(false);

//   const [products, setProducts] = useState([]);
//   const [productsLoading, setProductsLoading] = useState(false);
//   const [showProductForm, setShowProductForm] = useState(false);
//   const [editingProduct, setEditingProduct] = useState(null);
//   const [productForm, setProductForm] = useState({
//     name: '',
//     price: '',
//     description: '',
//     image: '',
//     stock: ''
//   });

//   const [analytics, setAnalytics] = useState({
//     totalRevenue: 0,
//     totalOrders: 0,
//     paidOrders: 0,
//     pendingPayments: 0,
//     dailyStats: [],
//     monthlyStats: [],
//     topProducts: [],
//     conversionRate: '0%',
//     averageOrderValue: 0
//   });

//   useEffect(() => {
//     const storedUser = localStorage.getItem('user');
//     if (!storedUser) {
//       router.push('/');
//       return;
//     }

//     const userData = JSON.parse(storedUser);
//     if (userData.role !== 'admin') {
//       alert('⛔ Akses ditolak! Anda bukan admin.');
//       router.push('/');
//       return;
//     }

//     setUser(userData);
//     setLoading(false);
//     loadAllData();
//   }, []);

//   const loadAllData = async () => {
//     await Promise.all([loadOrders(), loadProducts(), loadAnalytics()]);
//   };

//   const loadOrders = async () => {
//     setOrdersLoading(true);
//     try {
//       const res = await fetch(`/api/admin/orders?_t=${Date.now()}`, {
//         method: "GET",
//         headers: {
//           "Cache-Control": "no-cache",
//           "Pragma": "no-cache",
//         },
//       });

//       if (!res.ok) throw new Error("Gagal memuat orders");

//       const data = await res.json();
//       setOrders(data.orders || data || []);
//     } catch (error) {
//       console.error("❌ Error loading orders:", error);
//     } finally {
//       setOrdersLoading(false);
//     }
//   };

//   const loadProducts = async () => {
//     setProductsLoading(true);
//     try {
//       const res = await fetch('/api/admin/products');
//       const data = await res.json();
//       if (res.ok && data.products) {
//         setProducts(data.products);
//       }
//     } catch (error) {
//       console.error('Error loading products:', error);
//     } finally {
//       setProductsLoading(false);
//     }
//   };

//   const loadAnalytics = async () => {
//     try {
//       const res = await fetch('/api/admin/analytics');
//       const data = await res.json();
//       if (res.ok) {
//         setAnalytics(data);
//       }
//     } catch (error) {
//       console.error('Error loading analytics:', error);
//     }
//   };

//   const handleProductSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const url = editingProduct 
//         ? `/api/admin/products/${editingProduct._id}`
//         : '/api/admin/products';
      
//       const method = editingProduct ? 'PUT' : 'POST';

//       const res = await fetch(url, {
//         method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(productForm)
//       });

//       const data = await res.json();

//       if (res.ok) {
//         alert(editingProduct ? '✅ Produk berhasil diupdate!' : '✅ Produk berhasil ditambahkan!');
//         setShowProductForm(false);
//         setEditingProduct(null);
//         setProductForm({ name: '', price: '', description: '', image: '', stock: '' });
//         loadProducts();
//         loadAnalytics();
//       } else {
//         alert('❌ ' + (data.error || 'Gagal menyimpan produk'));
//       }
//     } catch (error) {
//       alert('❌ Terjadi kesalahan');
//     }
//   };

//   const handleEditProduct = (product) => {
//     setEditingProduct(product);
//     setProductForm({
//       name: product.name,
//       price: product.price,
//       description: product.description,
//       image: product.image || '',
//       stock: product.stock || 0
//     });
//     setShowProductForm(true);
//   };

//   const handleDeleteProduct = async (productId) => {
//     if (!confirm('Yakin ingin menghapus produk ini?')) return;

//     try {
//       const res = await fetch(`/api/admin/products/${productId}`, {
//         method: 'DELETE'
//       });

//       if (res.ok) {
//         alert('✅ Produk berhasil dihapus!');
//         loadProducts();
//         loadAnalytics();
//       } else {
//         alert('❌ Gagal menghapus produk');
//       }
//     } catch (error) {
//       alert('❌ Terjadi kesalahan');
//     }
//   };

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('id-ID', {
//       style: 'currency',
//       currency: 'IDR',
//       minimumFractionDigits: 0
//     }).format(amount);
//   };

//   const formatDate = (date) => {
//     return new Date(date).toLocaleDateString('id-ID', {
//       day: 'numeric',
//       month: 'short',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const getStatusBadge = (status) => {
//     const normalized = status?.toUpperCase() || 'PENDING';
    
//     if (normalized === 'PAID') {
//       return { text: '✅ Lunas', class: 'status-paid' };
//     }
//     return { text: '⏳ Menunggu Pembayaran', class: 'status-pending' };
//   };

//   if (loading) {
//     return (
//       <div className="loading-screen">
//         <div className="spinner"></div>
//         <p>Loading...</p>
//         <style jsx>{`
//           .loading-screen {
//             display: flex;
//             flex-direction: column;
//             align-items: center;
//             justify-content: center;
//             min-height: 100vh;
//             gap: 1rem;
//           }
//           .spinner {
//             width: 50px;
//             height: 50px;
//             border: 4px solid #e9ecef;
//             border-top-color: #007bff;
//             border-radius: 50%;
//             animation: spin 1s linear infinite;
//           }
//           @keyframes spin {
//             to { transform: rotate(360deg); }
//           }
//         `}</style>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="dashboard-container">
//         <header className="dashboard-header">
//           <div className="header-content">
//             <div>
//               <h1>📊 Admin Dashboard</h1>
//             </div>
//             <Link href="/">
//               <button className="btn-back">← Kembali ke Home</button>
//             </Link>
//           </div>
//         </header>

//         <div className="stats-grid">
//           <div className="stat-card stat-blue">
//             <div className="stat-icon">💰</div>
//             <div className="stat-info">
//               <p className="stat-label">Total Revenue (Paid)</p>
//               <h2 className="stat-value">{formatCurrency(analytics.totalRevenue)}</h2>
//               <small className="stat-note">Avg: {formatCurrency(analytics.averageOrderValue)}/order</small>
//             </div>
//           </div>

//           <div className="stat-card stat-green">
//             <div className="stat-icon">📦</div>
//             <div className="stat-info">
//               <p className="stat-label">Total Orders</p>
//               <h2 className="stat-value">{analytics.totalOrders}</h2>
//               <small className="stat-note">{analytics.paidOrders} lunas, {analytics.pendingPayments} pending</small>
//             </div>
//           </div>

//           <div className="stat-card stat-orange">
//             <div className="stat-icon">⏳</div>
//             <div className="stat-info">
//               <p className="stat-label">Pending Payments</p>
//               <h2 className="stat-value">{analytics.pendingPayments}</h2>
//               <small className="stat-note">Conversion: {analytics.conversionRate}</small>
//             </div>
//           </div>

//           <div className="stat-card stat-purple">
//             <div className="stat-icon">🛍️</div>
//             <div className="stat-info">
//               <p className="stat-label">Total Products</p>
//               <h2 className="stat-value">{products.length}</h2>
//               <small className="stat-note">Aktif di katalog</small>
//             </div>
//           </div>
//         </div>

//         <div className="tabs-container">
//           <button
//             className={`tab ${activeTab === 'overview' ? 'tab-active' : ''}`}
//             onClick={() => setActiveTab('overview')}
//           >
//             📊 Overview
//           </button>
//           <button
//             className={`tab ${activeTab === 'orders' ? 'tab-active' : ''}`}
//             onClick={() => setActiveTab('orders')}
//           >
//             📋 Orders ({orders.length})
//           </button>
//           <button
//             className={`tab ${activeTab === 'products' ? 'tab-active' : ''}`}
//             onClick={() => setActiveTab('products')}
//           >
//             🛍️ Products ({products.length})
//           </button>
//           <button
//             className={`tab ${activeTab === 'analytics' ? 'tab-active' : ''}`}
//             onClick={() => setActiveTab('analytics')}
//           >
//             📈 Analytics
//           </button>
//         </div>

//         <div className="content-container">
//           {/* Overview Tab */}
//           {activeTab === 'overview' && (
//             <div className="overview-section">
//               <h2 className="section-title">📊 Dashboard Overview</h2>
              
//               <div className="overview-grid">
//                 <div className="overview-card">
//                   <h3>🔥 Recent Orders (5 Terakhir)</h3>
//                   {orders.slice(0, 5).map(order => (
//                     <div key={order._id} className="mini-order-card">
//                       <div>
//                         <strong>{order.customerEmail}</strong>
//                         <p className="text-sm">{formatCurrency(order.amount)}</p>
//                       </div>
//                       <span className={`badge ${getStatusBadge(order.status).class}`}>
//                         {getStatusBadge(order.status).text}
//                       </span>
//                     </div>
//                   ))}
//                   {orders.length === 0 && <p className="empty-text">Belum ada order</p>}
//                 </div>

//                 <div className="overview-card">
//                   <h3>📈 Top 5 Products</h3>
//                   {analytics.topProducts?.slice(0, 5).map((product, idx) => (
//                     <div key={idx} className="mini-product-card">
//                       <div>
//                         <strong>{product.name}</strong>
//                         <p className="text-sm">{product.qty} terjual</p>
//                       </div>
//                       <span className="revenue-text">{formatCurrency(product.revenue)}</span>
//                     </div>
//                   ))}
//                   {(!analytics.topProducts || analytics.topProducts.length === 0) && (
//                     <p className="empty-text">Belum ada data penjualan</p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Orders Tab */}
//           {activeTab === 'orders' && (
//             <div className="orders-section">
//               <h2 className="section-title">📋 Daftar Pesanan</h2>
//               {ordersLoading ? (
//                 <div className="loading">Loading orders...</div>
//               ) : orders.length === 0 ? (
//                 <div className="empty-state">
//                   <p>📭 Belum ada pesanan</p>
//                 </div>
//               ) : (
//                 <div className="table-responsive">
//                   <table className="data-table">
//                     <thead>
//                       <tr>
//                         <th>Order ID</th>
//                         <th>Customer</th>
//                         <th>Products</th>
//                         <th>Total</th>
//                         <th>Status</th>
//                         <th>Payment Method</th>
//                         <th>Date</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {orders.map((order) => {
//                         const statusInfo = getStatusBadge(order.status);
//                         return (
//                           <tr key={order._id}>
//                             <td className="mono">{order.orderId}</td>
//                             <td>
//                               <div className="customer-info">
//                                 <strong>{order.customerName}</strong>
//                                 <br />
//                                 <small>{order.customerEmail}</small>
//                               </div>
//                             </td>
//                             <td>
//                               {order.items?.map((item, idx) => (
//                                 <div key={idx} className="order-item">
//                                   {item.name} x{item.qty || item.quantity || 1}
//                                 </div>
//                               ))}
//                             </td>
//                             <td className="amount">{formatCurrency(order.amount)}</td>
//                             <td>
//                               <span className={`status-badge ${statusInfo.class}`}>
//                                 {statusInfo.text}
//                               </span>
//                             </td>
//                             <td>{order.paymentMethod}</td>
//                             <td className="text-sm">{formatDate(order.createdAt)}</td>
//                           </tr>
//                         );
//                       })}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Products Tab */}
//           {activeTab === 'products' && (
//             <div className="products-section">
//               <div className="section-header">
//                 <h2 className="section-title">🛍️ Manajemen Produk</h2>
//                 <button
//                   className="btn-primary"
//                   onClick={() => {
//                     setShowProductForm(true);
//                     setEditingProduct(null);
//                     setProductForm({ name: '', price: '', description: '', image: '', stock: '' });
//                   }}
//                 >
//                   ➕ Tambah Produk
//                 </button>
//               </div>

//               {showProductForm && (
//                 <div className="modal-overlay" onClick={() => setShowProductForm(false)}>
//                   <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//                     <button className="modal-close" onClick={() => setShowProductForm(false)}>✕</button>
//                     <h3>{editingProduct ? '✏️ Edit Produk' : '➕ Tambah Produk Baru'}</h3>
                    
//                     <form onSubmit={handleProductSubmit}>
//                       <div className="form-group">
//                         <label>Nama Produk</label>
//                         <input
//                           type="text"
//                           value={productForm.name}
//                           onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
//                           required
//                         />
//                       </div>

//                       <div className="form-group">
//                         <label>Harga (IDR)</label>
//                         <input
//                           type="number"
//                           value={productForm.price}
//                           onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
//                           required
//                         />
//                       </div>

//                       <div className="form-group">
//                         <label>Stok</label>
//                         <input
//                           type="number"
//                           value={productForm.stock}
//                           onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
//                         />
//                       </div>

//                       <div className="form-group">
//                         <label>Deskripsi</label>
//                         <textarea
//                           value={productForm.description}
//                           onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
//                           rows="3"
//                         />
//                       </div>

//                       <div className="form-group">
//                         <label>URL Gambar</label>
//                         <input
//                           type="text"
//                           value={productForm.image}
//                           onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
//                           placeholder="https://example.com/image.jpg"
//                         />
//                       </div>

//                       <button type="submit" className="btn-primary btn-full">
//                         {editingProduct ? '💾 Update Produk' : '➕ Tambah Produk'}
//                       </button>
//                     </form>
//                   </div>
//                 </div>
//               )}

//               {productsLoading ? (
//                 <div className="loading">Loading products...</div>
//               ) : products.length === 0 ? (
//                 <div className="empty-state">
//                   <p>📭 Belum ada produk</p>
//                 </div>
//               ) : (
//                 <div className="products-grid">
//                   {products.map((product) => (
//                     <div key={product._id} className="product-card">
//                       {product.image && (
//                         <img src={product.image} alt={product.name} className="product-image" />
//                       )}
//                       <div className="product-info">
//                         <h4>{product.name}</h4>
//                         <p className="product-price">{formatCurrency(product.price)}</p>
//                         <p className="product-stock">Stok: {product.stock || 0}</p>
//                         <p className="product-description">{product.description}</p>
//                         <div className="product-actions">
//                           <button className="btn-edit" onClick={() => handleEditProduct(product)}>
//                             ✏️ Edit
//                           </button>
//                           <button className="btn-delete" onClick={() => handleDeleteProduct(product._id)}>
//                             🗑️ Delete
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Analytics Tab */}
//           {activeTab === 'analytics' && (
//             <div className="analytics-section">
//               <h2 className="section-title">📈 Analytics & Reports</h2>
              
//               <div className="chart-grid">
//                 <div className="chart-card">
//                   <h3>📊 Penjualan Harian (7 Hari Terakhir)</h3>
//                   <div className="chart-placeholder">
//                     {analytics.dailyStats.length > 0 ? (
//                       <div className="line-chart-container">
//                         <svg className="line-chart" viewBox="0 0 800 300" preserveAspectRatio="none">
//                           <defs>
//                             <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
//                               <stop offset="0%" stopColor="#667eea" stopOpacity="0.3" />
//                               <stop offset="100%" stopColor="#764ba2" stopOpacity="0.05" />
//                             </linearGradient>
//                           </defs>
                          
//                           {(() => {
//                             const maxRevenue = Math.max(...analytics.dailyStats.map(s => s.revenue));
//                             const padding = 20;
//                             const chartHeight = 300 - padding * 2;
//                             const chartWidth = 800;
//                             const pointSpacing = chartWidth / (analytics.dailyStats.length - 1 || 1);
                            
//                             const points = analytics.dailyStats.map((stat, idx) => {
//                               const x = idx * pointSpacing;
//                               const y = padding + chartHeight - (stat.revenue / maxRevenue * chartHeight);
//                               return { x, y, stat };
//                             });
                            
//                             const pathD = points.map((p, i) => 
//                               `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`
//                             ).join(' ');
                            
//                             const areaD = `${pathD} L ${points[points.length - 1].x},${300} L 0,${300} Z`;
                            
//                             return (
//                               <>
//                                 <path d={areaD} fill="url(#lineGradient)" />
//                                 <path 
//                                   d={pathD} 
//                                   fill="none" 
//                                   stroke="#667eea" 
//                                   strokeWidth="3" 
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                 />
//                                 {points.map((point, idx) => (
//                                   <g key={idx}>
//                                     <circle 
//                                       cx={point.x} 
//                                       cy={point.y} 
//                                       r="6" 
//                                       fill="white" 
//                                       stroke="#667eea" 
//                                       strokeWidth="3"
//                                       className="chart-point"
//                                     />
//                                   </g>
//                                 ))}
//                               </>
//                             );
//                           })()}
//                         </svg>
                        
//                         <div className="chart-labels">
//                           {analytics.dailyStats.map((stat, idx) => (
//                             <div key={idx} className="chart-label-item">
//                               <div className="label-date">{stat.date}</div>
//                               <div className="label-revenue">
//                                 {stat.revenue >= 1000000 
//                                   ? `${(stat.revenue/1000000).toFixed(1)}jt` 
//                                   : stat.revenue >= 1000
//                                   ? `${(stat.revenue/1000).toFixed(0)}rb`
//                                   : formatCurrency(stat.revenue)}
//                               </div>
//                               <div className="label-orders">{stat.paidOrders || 0} orders</div>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     ) : (
//                       <p className="empty-chart">Belum ada data penjualan</p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="chart-card">
//                   <h3>📅 Penjualan Bulanan (6 Bulan Terakhir)</h3>
//                   <div className="chart-placeholder">
//                     {analytics?.monthlyStats?.length > 0 ? (
//                       <div className="monthly-stats">
//                         {analytics.monthlyStats.map((stat, idx) => (
//                           <div key={idx} className="monthly-item">
//                             <div className="monthly-month">{stat.month}</div>
//                             <div className="monthly-revenue">{formatCurrency(stat.revenue)}</div>
//                             <div className="monthly-orders">{stat.paidOrders} paid / {stat.orders} total</div>
//                           </div>
//                         ))}
//                       </div>
//                     ) : (
//                       <p className="empty-chart">Belum ada data penjualan bulanan</p>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       <style jsx>{`
//         * {
//           box-sizing: border-box;
//         }

//         .dashboard-container {
//           min-height: 100vh;
//           background: #f8f9fa;
//           font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
//         }

//         .dashboard-header {
//           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//           color: white;
//           padding: 5rem;
//           box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
//         }

//         .header-content {
//           max-width: 1400px;
//           margin: 0 auto;
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//         }

//         .dashboard-header h1 {
//           font-size: 2rem;
//           margin: 0 0 0.5rem 0;
//           font-weight: 700;
//         }

//         .subtitle {
//           margin: 0;
//           opacity: 0.9;
//           font-size: 1rem;
//         }

//         .btn-back {
//           background: rgba(255, 255, 255, 0.2);
//           color: white;
//           border: 2px solid white;
//           padding: 0.75rem 1.5rem;
//           border-radius: 10px;
//           font-weight: 600;
//           cursor: pointer;
//           transition: all 0.3s;
//         }

//         .btn-back:hover {
//           background: white;
//           color: #667eea;
//         }

//         .stats-grid {
//           max-width: 1400px;
//           margin: -3rem auto 2rem auto;
//           padding: 0 2rem;
//           display: grid;
//           grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
//           gap: 1.5rem;
//         }

//         .stat-card {
//           background: white;
//           padding: 1.5rem;
//           border-radius: 16px;
//           display: flex;
//           align-items: center;
//           gap: 1rem;
//           box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
//           transition: transform 0.3s;
//         }

//         .stat-card:hover {
//           transform: translateY(-5px);
//         }

//         .stat-icon {
//           font-size: 2.5rem;
//           width: 70px;
//           height: 70px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           border-radius: 12px;
//         }

//         .stat-blue .stat-icon { background: #e3f2fd; }
//         .stat-green .stat-icon { background: #e8f5e9; }
//         .stat-orange .stat-icon { background: #fff3e0; }
//         .stat-purple .stat-icon { background: #f3e5f5; }

//         .stat-info {
//           flex: 1;
//         }

//         .stat-label {
//           color: #6c757d;
//           font-size: 0.875rem;
//           margin: 0 0 0.25rem 0;
//           font-weight: 500;
//         }

//         .stat-value {
//           font-size: 1.75rem;
//           font-weight: 700;
//           margin: 0 0 0.25rem 0;
//           color: #212529;
//         }

//         .stat-note {
//           color: #6c757d;
//           font-size: 0.75rem;
//         }

//         .tabs-container {
//           max-width: 1400px;
//           margin: 0 auto 2rem auto;
//           padding: 0 2rem;
//           display: flex;
//           gap: 1rem;
//           border-bottom: 2px solid #e9ecef;
//         }

//         .tab {
//           background: none;
//           border: none;
//           padding: 1rem 1.5rem;
//           font-weight: 600;
//           color: #6c757d;
//           cursor: pointer;
//           border-bottom: 3px solid transparent;
//           transition: all 0.3s;
//           font-size: 1rem;
//         }

//         .tab:hover {
//           color: #007bff;
//         }

//         .tab-active {
//           color: #007bff;
//           border-bottom-color: #007bff;
//         }

//         .content-container {
//           max-width: 1400px;
//           margin: 0 auto;
//           padding: 0 2rem 4rem 2rem;
//         }

//         .section-title {
//           font-size: 1.5rem;
//           font-weight: 700;
//           margin: 0 0 1.5rem 0;
//           color: #212529;
//         }

//         .section-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 1.5rem;
//         }

//         .loading, .empty-state {
//           text-align: center;
//           padding: 3rem;
//           color: #6c757d;
//           font-size: 1.1rem;
//         }

//         .overview-grid {
//           display: grid;
//           grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
//           gap: 2rem;
//         }

//         .overview-card {
//           background: white;
//           padding: 1.5rem;
//           border-radius: 16px;
//           box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
//         }

//         .overview-card h3 {
//           margin: 0 0 1rem 0;
//           font-size: 1.1rem;
//           color: #212529;
//         }

//         .mini-order-card, .mini-product-card {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           padding: 0.75rem;
//           margin-bottom: 0.5rem;
//           background: #f8f9fa;
//           border-radius: 8px;
//           transition: all 0.2s;
//         }

//         .mini-order-card:hover, .mini-product-card:hover {
//           background: #e9ecef;
//         }

//         .text-sm {
//           font-size: 0.875rem;
//           color: #6c757d;
//           margin: 0.25rem 0 0 0;
//         }

//         .badge {
//           padding: 0.25rem 0.75rem;
//           border-radius: 12px;
//           font-size: 0.75rem;
//           font-weight: 600;
//         }

//         .revenue-text {
//           font-weight: 700;
//           color: #28a745;
//         }

//         .empty-text {
//           color: #6c757d;
//           font-style: italic;
//           text-align: center;
//           padding: 2rem;
//         }

//         .table-responsive {
//           background: white;
//           border-radius: 16px;
//           box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
//           overflow-x: auto;
//         }

//         .data-table {
//           width: 100%;
//           border-collapse: collapse;
//         }

//         .data-table thead {
//           background: #f8f9fa;
//         }

//         .data-table th {
//           padding: 1rem;
//           text-align: left;
//           font-weight: 600;
//           color: #495057;
//           font-size: 0.875rem;
//           text-transform: uppercase;
//           letter-spacing: 0.5px;
//         }

//         .data-table td {
//           padding: 1rem;
//           border-top: 1px solid #e9ecef;
//           color: #212529;
//         }

//         .data-table tbody tr:hover {
//           background: #f8f9fa;
//         }

//         .mono {
//           font-family: 'Courier New', monospace;
//           font-size: 0.9rem;
//           color: #6c757d;
//         }

//         .customer-info strong {
//           display: block;
//           margin-bottom: 0.25rem;
//         }

//         .customer-info small {
//           color: #6c757d;
//         }

//         .order-item {
//           font-size: 0.875rem;
//           margin-bottom: 0.25rem;
//         }

//         .amount {
//           font-weight: 600;
//           color: #28a745;
//         }

//         .status-badge {
//           display: inline-block;
//           padding: 0.375rem 0.75rem;
//           border-radius: 20px;
//           font-size: 0.75rem;
//           font-weight: 600;
//         }

//         .status-paid {
//           background: #d4edda;
//           color: #155724;
//         }

//         .status-pending {
//           background: #fff3cd;
//           color: #856404;
//         }

//         .btn-primary {
//           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//           color: white;
//           border: none;
//           padding: 0.75rem 1.5rem;
//           border-radius: 10px;
//           font-weight: 600;
//           cursor: pointer;
//           transition: all 0.3s;
//         }

//         .btn-primary:hover {
//           transform: translateY(-2px);
//           box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
//         }

//         .btn-full {
//           width: 100%;
//         }

//         .modal-overlay {
//           position: fixed;
//           top: 0;
//           left: 0;
//           right: 0;
//           bottom: 0;
//           background: rgba(0, 0, 0, 0.5);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           z-index: 1000;
//           padding: 1rem;
//         }

//         .modal-content {
//           background: white;
//           padding: 2rem;
//           border-radius: 16px;
//           max-width: 500px;
//           width: 100%;
//           max-height: 90vh;
//           overflow-y: auto;
//           position: relative;
//         }

//         .modal-close {
//           position: absolute;
//           top: 1rem;
//           right: 1rem;
//           background: #f8f9fa;
//           border: none;
//           width: 32px;
//           height: 32px;
//           border-radius: 50%;
//           cursor: pointer;
//           font-size: 1.2rem;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           transition: all 0.3s;
//         }

//         .modal-close:hover {
//           background: #e9ecef;
//         }

//         .modal-content h3 {
//           margin: 0 0 1.5rem 0;
//           font-size: 1.5rem;
//           color: #212529;
//         }

//         .form-group {
//           margin-bottom: 1.25rem;
//         }

//         .form-group label {
//           display: block;
//           margin-bottom: 0.5rem;
//           font-weight: 600;
//           color: #495057;
//           font-size: 0.9rem;
//         }

//         .form-group input,
//         .form-group textarea {
//           width: 100%;
//           padding: 0.75rem;
//           border: 2px solid #e9ecef;
//           border-radius: 8px;
//           font-size: 1rem;
//           transition: all 0.3s;
//           font-family: inherit;
//         }

//         .form-group input:focus,
//         .form-group textarea:focus {
//           outline: none;
//           border-color: #667eea;
//           box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
//         }

//         .products-grid {
//           display: grid;
//           grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
//           gap: 1.5rem;
//         }

//         .product-card {
//           background: white;
//           border-radius: 16px;
//           overflow: hidden;
//           box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
//           transition: all 0.3s;
//         }

//         .product-card:hover {
//           transform: translateY(-5px);
//           box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
//         }

//         .product-image {
//           width: 100%;
//           height: 200px;
//           object-fit: cover;
//           background: #f8f9fa;
//         }

//         .product-info {
//           padding: 1.25rem;
//         }

//         .product-info h4 {
//           margin: 0 0 0.5rem 0;
//           font-size: 1.1rem;
//           color: #212529;
//         }

//         .product-price {
//           font-size: 1.25rem;
//           font-weight: 700;
//           color: #28a745;
//           margin: 0.5rem 0;
//         }

//         .product-stock {
//           font-size: 0.875rem;
//           color: #6c757d;
//           margin: 0.25rem 0;
//         }

//         .product-description {
//           font-size: 0.875rem;
//           color: #6c757d;
//           margin: 0.75rem 0 1rem 0;
//           line-height: 1.5;
//         }

//         .product-actions {
//           display: flex;
//           gap: 0.75rem;
//         }

//         .btn-edit,
//         .btn-delete {
//           flex: 1;
//           padding: 0.625rem;
//           border: none;
//           border-radius: 8px;
//           font-weight: 600;
//           cursor: pointer;
//           transition: all 0.3s;
//           font-size: 0.875rem;
//         }

//         .btn-edit {
//           background: #e3f2fd;
//           color: #1976d2;
//         }

//         .btn-edit:hover {
//           background: #1976d2;
//           color: white;
//         }

//         .btn-delete {
//           background: #ffebee;
//           color: #c62828;
//         }

//         .btn-delete:hover {
//           background: #c62828;
//           color: white;
//         }

//         .chart-grid {
//           display: grid;
//           grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
//           gap: 2rem;
//         }

//         .chart-card {
//           background: white;
//           padding: 1.5rem;
//           border-radius: 16px;
//           box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
//         }

//         .chart-card h3 {
//           margin: 0 0 1.5rem 0;
//           font-size: 1.1rem;
//           color: #212529;
//         }

//         .chart-placeholder {
//           min-height: 300px;
//           background: linear-gradient(135deg, #fafbfc 0%, #ffffff 100%);
//           border-radius: 12px;
//           padding: 1rem;
//         }

//         .bar-chart {
//           display: flex;
//           align-items: flex-end;
//           justify-content: space-between;
//           height: 320px;
//           gap: 0.75rem;
//           padding: 2rem 0.5rem 0 0.5rem;
//           position: relative;
//         }

//         .bar-item {
//           flex: 1;
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           gap: 0.5rem;
//           min-width: 60px;
//         }

//         .bar {
//           width: 100%;
//           background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
//           border-radius: 12px 12px 4px 4px;
//           position: relative;
//           transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
//           cursor: pointer;
//           min-height: 30px;
//           box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
//           display: flex;
//           align-items: flex-start;
//           justify-content: center;
//           padding-top: 0.5rem;
//         }

//         .bar:hover {
//           transform: translateY(-4px);
//           box-shadow: 0 8px 20px rgba(102, 126, 234, 0.35);
//           background: linear-gradient(180deg, #764ba2 0%, #667eea 100%);
//         }

//         .bar-label {
//           font-size: 0.7rem;
//           font-weight: 700;
//           color: white;
//           white-space: nowrap;
//           text-shadow: 0 1px 2px rgba(0,0,0,0.2);
//         }

//         .bar-date {
//           font-size: 0.75rem;
//           color: #495057;
//           font-weight: 600;
//           margin-top: 0.25rem;
//         }

//         .bar-orders {
//           font-size: 0.7rem;
//           color: #28a745;
//           font-weight: 600;
//           background: #e8f5e9;
//           padding: 0.125rem 0.5rem;
//           border-radius: 10px;
//         }

//         .line-chart-container {
//           position: relative;
//           width: 100%;
//           height: 100%;
//         }

//         .line-chart {
//           width: 100%;
//           height: 300px;
//           margin-bottom: 1rem;
//         }

//         .chart-point {
//           cursor: pointer;
//           transition: all 0.3s;
//         }

//         .chart-point:hover {
//           r: 8;
//           filter: drop-shadow(0 4px 8px rgba(102, 126, 234, 0.4));
//         }

//         .chart-labels {
//           display: flex;
//           justify-content: space-between;
//           gap: 0.5rem;
//           padding: 0 0.5rem;
//         }

//         .chart-label-item {
//           flex: 1;
//           text-align: center;
//           display: flex;
//           flex-direction: column;
//           gap: 0.25rem;
//         }

//         .label-date {
//           font-size: 0.75rem;
//           color: #495057;
//           font-weight: 600;
//         }

//         .label-revenue {
//           font-size: 0.8rem;
//           color: #667eea;
//           font-weight: 700;
//         }

//         .label-orders {
//           font-size: 0.7rem;
//           color: #28a745;
//           font-weight: 600;
//           background: #e8f5e9;
//           padding: 0.125rem 0.5rem;
//           border-radius: 10px;
//           display: inline-block;
//         }

//         .monthly-stats {
//           display: flex;
//           flex-direction: column;
//           gap: 0.75rem;
//         }

//         .monthly-item {
//           display: grid;
//           grid-template-columns: 120px 1fr auto;
//           align-items: center;
//           gap: 1rem;
//           padding: 1.25rem;
//           background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
//           border-radius: 12px;
//           transition: all 0.3s;
//           border-left: 4px solid #667eea;
//           box-shadow: 0 2px 8px rgba(0,0,0,0.04);
//         }

//         .monthly-item:hover {
//           background: linear-gradient(135deg, #e3f2fd 0%, #f8f9fa 100%);
//           transform: translateX(8px);
//           box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
//           border-left-color: #764ba2;
//         }

//         .monthly-month {
//           font-weight: 700;
//           color: #212529;
//           font-size: 1rem;
//         }

//         .monthly-revenue {
//           font-weight: 700;
//           color: #28a745;
//           font-size: 1.25rem;
//           text-align: right;
//         }

//         .monthly-orders {
//           font-size: 0.8rem;
//           color: white;
//           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//           padding: 0.375rem 0.75rem;
//           border-radius: 20px;
//           font-weight: 600;
//           white-space: nowrap;
//           box-shadow: 0 2px 8px rgba(102, 126, 234, 0.25);
//         }

//         .empty-chart {
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           height: 300px;
//           color: #6c757d;
//           font-style: italic;
//         }

//         @media (max-width: 768px) {
//           .header-content {
//             flex-direction: column;
//             gap: 1rem;
//             text-align: center;
//           }

//           .stats-grid {
//             grid-template-columns: 1fr;
//             margin-top: 1rem;
//           }

//           .tabs-container {
//             overflow-x: auto;
//             padding-bottom: 0.5rem;
//           }

//           .tab {
//             white-space: nowrap;
//           }

//           .overview-grid {
//             grid-template-columns: 1fr;
//           }

//           .table-responsive {
//             overflow-x: scroll;
//           }

//           .products-grid {
//             grid-template-columns: 1fr;
//           }

//           .chart-grid {
//             grid-template-columns: 1fr;
//           }

//           .bar-chart {
//             overflow-x: auto;
//           }

//           .line-chart-container {
//             overflow-x: auto;
//           }

//           .chart-labels {
//             flex-wrap: nowrap;
//             overflow-x: auto;
//           }

//           .section-header {
//             flex-direction: column;
//             align-items: flex-start;
//             gap: 1rem;
//           }

//           .btn-primary {
//             width: 100%;
//           }

//           .monthly-item {
//             grid-template-columns: 1fr;
//             text-align: center;
//             gap: 0.5rem;
//           }

//           .monthly-revenue {
//             text-align: center;
//           }
//         }
//       `}</style>
//     </>
//   );
// }

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    description: '',
    imageUrl: '', // ✅ UBAH: dari 'image' menjadi 'imageUrl'
    stock: ''
  });

  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    paidOrders: 0,
    pendingPayments: 0,
    dailyStats: [],
    monthlyStats: [],
    topProducts: [],
    conversionRate: '0%',
    averageOrderValue: 0
  });

  useEffect(() => {
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
    loadAllData();
  }, []);

  const loadAllData = async () => {
    await Promise.all([loadOrders(), loadProducts(), loadAnalytics()]);
  };

  const loadOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch(`/api/admin/orders?_t=${Date.now()}`, {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache",
          "Pragma": "no-cache",
        },
      });

      if (!res.ok) throw new Error("Gagal memuat orders");

      const data = await res.json();
      setOrders(data.orders || data || []);
    } catch (error) {
      console.error("❌ Error loading orders:", error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const loadProducts = async () => {
  setProductsLoading(true);
  try {
    const res = await fetch('/api/admin/products');
    const data = await res.json();
    if (res.ok && data.products) {
      console.log('📦 Products loaded:', data.products);
      data.products.forEach(p => {
        console.log(`Product: ${p.name}, imageUrl: ${p.imageUrl}`);
      });
      setProducts(data.products);
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

  const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Validasi tipe file
  if (!file.type.startsWith('image/')) {
    alert('❌ File harus berupa gambar');
    return;
  }

  // Validasi ukuran (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('❌ Ukuran file maksimal 5MB');
    return;
  }

  setUploadingImage(true);

  try {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();

    if (res.ok && data.imageUrl) {
      setProductForm({ ...productForm, imageUrl: data.imageUrl });
      setImagePreview(data.imageUrl);
      alert('✅ Gambar berhasil diupload!');
    } else {
      alert('❌ ' + (data.error || 'Gagal upload gambar'));
    }
  } catch (error) {
    console.error('Upload error:', error);
    alert('❌ Terjadi kesalahan saat upload');
  } finally {
    setUploadingImage(false);
  }
};

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingProduct 
        ? `/api/admin/products/${editingProduct._id}`
        : '/api/admin/products';
      
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productForm)
      });

      const data = await res.json();

      if (res.ok) {
        alert(editingProduct ? '✅ Produk berhasil diupdate!' : '✅ Produk berhasil ditambahkan!');
        setShowProductForm(false);
        setEditingProduct(null);
        setProductForm({ name: '', price: '', description: '', imageUrl: '', stock: '' });
        loadProducts();
        loadAnalytics();
      } else {
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
      imageUrl: product.imageUrl || product.image || '', // ✅ Support kedua field
      stock: product.stock || 0
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

  const getStatusBadge = (status) => {
    const normalized = status?.toUpperCase() || 'PENDING';
    
    if (normalized === 'PAID') {
      return { text: '✅ Lunas', class: 'status-paid' };
    }
    return { text: '⏳ Menunggu Pembayaran', class: 'status-pending' };
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading...</p>
        <style jsx>{`
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
        `}</style>
      </div>
    );
  }

  return (
    <>
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div className="header-content">
            <div>
              <h1>📊 Admin Dashboard</h1>
            </div>
            <Link href="/">
              <button className="btn-back">← Kembali ke Home</button>
            </Link>
          </div>
        </header>

        <div className="stats-grid">
          <div className="stat-card stat-blue">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <p className="stat-label">Total Revenue (Paid)</p>
              <h2 className="stat-value">{formatCurrency(analytics.totalRevenue)}</h2>
              <small className="stat-note">Avg: {formatCurrency(analytics.averageOrderValue)}/order</small>
            </div>
          </div>

          <div className="stat-card stat-green">
            <div className="stat-icon">📦</div>
            <div className="stat-info">
              <p className="stat-label">Total Orders</p>
              <h2 className="stat-value">{analytics.totalOrders}</h2>
              <small className="stat-note">{analytics.paidOrders} lunas, {analytics.pendingPayments} pending</small>
            </div>
          </div>

          <div className="stat-card stat-orange">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <p className="stat-label">Pending Payments</p>
              <h2 className="stat-value">{analytics.pendingPayments}</h2>
              <small className="stat-note">Conversion: {analytics.conversionRate}</small>
            </div>
          </div>

          <div className="stat-card stat-purple">
            <div className="stat-icon">🛍️</div>
            <div className="stat-info">
              <p className="stat-label">Total Products</p>
              <h2 className="stat-value">{products.length}</h2>
              <small className="stat-note">Aktif di katalog</small>
            </div>
          </div>
        </div>

        <div className="tabs-container">
          <button
            className={`tab ${activeTab === 'overview' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button
            className={`tab ${activeTab === 'orders' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            📋 Orders ({orders.length})
          </button>
          <button
            className={`tab ${activeTab === 'products' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            🛍️ Products ({products.length})
          </button>
          <button
            className={`tab ${activeTab === 'analytics' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            📈 Analytics
          </button>
        </div>

        <div className="content-container">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="overview-section">
              <h2 className="section-title">📊 Dashboard Overview</h2>
              
              <div className="overview-grid">
                <div className="overview-card">
                  <h3>🔥 Recent Orders (5 Terakhir)</h3>
                  {orders.slice(0, 5).map(order => (
                    <div key={order._id} className="mini-order-card">
                      <div>
                        <strong>{order.customerEmail}</strong>
                        <p className="text-sm">{formatCurrency(order.amount)}</p>
                      </div>
                      <span className={`badge ${getStatusBadge(order.status).class}`}>
                        {getStatusBadge(order.status).text}
                      </span>
                    </div>
                  ))}
                  {orders.length === 0 && <p className="empty-text">Belum ada order</p>}
                </div>

                <div className="overview-card">
                  <h3>📈 Top 5 Products</h3>
                  {analytics.topProducts?.slice(0, 5).map((product, idx) => (
                    <div key={idx} className="mini-product-card">
                      <div>
                        <strong>{product.name}</strong>
                        <p className="text-sm">{product.qty} terjual</p>
                      </div>
                      <span className="revenue-text">{formatCurrency(product.revenue)}</span>
                    </div>
                  ))}
                  {(!analytics.topProducts || analytics.topProducts.length === 0) && (
                    <p className="empty-text">Belum ada data penjualan</p>
                  )}
                </div>
              </div>
            </div>
          )}

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
                        <th>Payment Method</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => {
                        const statusInfo = getStatusBadge(order.status);
                        return (
                          <tr key={order._id}>
                            <td className="mono">{order.orderId}</td>
                            <td>
                              <div className="customer-info">
                                <strong>{order.customerName}</strong>
                                <br />
                                <small>{order.customerEmail}</small>
                              </div>
                            </td>
                            <td>
                              {order.items?.map((item, idx) => (
                                <div key={idx} className="order-item">
                                  {item.name} x{item.qty || item.quantity || 1}
                                </div>
                              ))}
                            </td>
                            <td className="amount">{formatCurrency(order.amount)}</td>
                            <td>
                              <span className={`status-badge ${statusInfo.class}`}>
                                {statusInfo.text}
                              </span>
                            </td>
                            <td>{order.paymentMethod}</td>
                            <td className="text-sm">{formatDate(order.createdAt)}</td>
                          </tr>
                        );
                      })}
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
                    setProductForm({ name: '', price: '', description: '', imageUrl: '', stock: '' });
                  }}
                >
                  ➕ Tambah Produk
                </button>
              </div>

              {showProductForm && (
                <div className="modal-overlay" onClick={() => setShowProductForm(false)}>
                  <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <button className="modal-close" onClick={() => setShowProductForm(false)}>✕</button>
                    <h3>{editingProduct ? '✏️ Edit Produk' : '➕ Tambah Produk Baru'}</h3>
                    
                    <form onSubmit={handleProductSubmit}>
                      <div className="form-group">
                        <label>Nama Produk *</label>
                        <input
                          type="text"
                          value={productForm.name}
                          onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                          required
                          placeholder="Contoh: iPhone 15 Pro"
                        />
                      </div>

                      <div className="form-group">
                        <label>Harga (IDR) *</label>
                        <input
                          type="number"
                          value={productForm.price}
                          onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                          required
                          placeholder="50000"
                          min="0"
                        />
                      </div>

                      <div className="form-group">
                        <label>Stok</label>
                        <input
                          type="number"
                          value={productForm.stock}
                          onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                          placeholder="100"
                          min="0"
                        />
                      </div>

                      {/* ✅ TAMBAHAN: Form untuk URL gambar dengan preview */}
                      <div className="form-group">
                        <label>Gambar Produk</label>
                        <div className="file-upload-wrapper">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploadingImage}
                            id="product-image"
                            className="file-input"
                          />
                          <label htmlFor="product-image" className="file-label">
                            {uploadingImage ? (
                              <>
                                <span className="upload-spinner"></span>
                                <span>Uploading...</span>
                              </>
                            ) : (
                              <>
                                <span className="upload-icon">📁</span>
                                <span>Pilih Gambar dari Komputer</span>
                              </>
                            )}
                          </label>
                        </div>
                        <small className="form-hint">
                          💡 Format: JPG, PNG, GIF (Max 5MB)
                        </small>
                        
                        {/* Preview gambar */}
                        {(productForm.imageUrl || imagePreview) && (
                          <div className="image-preview-container">
                            <p className="preview-label">Preview Gambar:</p>
                            <div className="image-preview">
                              <img 
                                src={productForm.imageUrl || imagePreview} 
                                alt="Preview"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextElementSibling.style.display = 'flex';
                                }}
                              />
                              <div className="image-error" style={{display: 'none'}}>
                                <span>❌ Gambar tidak dapat dimuat</span>
                              </div>
                            </div>
                            <button 
                              type="button"
                              className="btn-remove-image"
                              onClick={() => {
                                setProductForm({ ...productForm, imageUrl: '' });
                                setImagePreview('');
                              }}
                            >
                              🗑️ Hapus Gambar
                            </button>
                          </div>
                        )}
                      </div>


                      <div className="form-group">
                        <label>Deskripsi</label>
                        <textarea
                          value={productForm.description}
                          onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                          rows="3"
                          placeholder="Deskripsi produk..."
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
      {/* ✅ FIX: Tampilkan gambar dengan path yang benar */}
      <div className="product-image-wrapper">
        {(product.imageUrl || product.image) ? (
          <img 
            src={product.imageUrl || product.image} 
            alt={product.name} 
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
          style={{display: (product.imageUrl || product.image) ? 'none' : 'flex'}}
        >
          <span className="placeholder-icon">📦</span>
        </div>
      </div>
      
      <div className="product-info">
        <h4>{product.name}</h4>
        <p className="product-price">{formatCurrency(product.price)}</p>
        <p className="product-stock">Stok: {product.stock || 0}</p>
        {product.description && (
          <p className="product-description">{product.description}</p>
        )}
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
                      <div className="line-chart-container">
                        <svg className="line-chart" viewBox="0 0 800 300" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#667eea" stopOpacity="0.3" />
                              <stop offset="100%" stopColor="#764ba2" stopOpacity="0.05" />
                            </linearGradient>
                          </defs>
                          
                          {(() => {
                            const maxRevenue = Math.max(...analytics.dailyStats.map(s => s.revenue));
                            const padding = 20;
                            const chartHeight = 300 - padding * 2;
                            const chartWidth = 800;
                            const pointSpacing = chartWidth / (analytics.dailyStats.length - 1 || 1);
                            
                            const points = analytics.dailyStats.map((stat, idx) => {
                              const x = idx * pointSpacing;
                              const y = padding + chartHeight - (stat.revenue / maxRevenue * chartHeight);
                              return { x, y, stat };
                            });
                            
                            const pathD = points.map((p, i) => 
                              `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`
                            ).join(' ');
                            
                            const areaD = `${pathD} L ${points[points.length - 1].x},${300} L 0,${300} Z`;
                            
                            return (
                              <>
                                <path d={areaD} fill="url(#lineGradient)" />
                                <path 
                                  d={pathD} 
                                  fill="none" 
                                  stroke="#667eea" 
                                  strokeWidth="3" 
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                {points.map((point, idx) => (
                                  <g key={idx}>
                                    <circle 
                                      cx={point.x} 
                                      cy={point.y} 
                                      r="6" 
                                      fill="white" 
                                      stroke="#667eea" 
                                      strokeWidth="3"
                                      className="chart-point"
                                    />
                                  </g>
                                ))}
                              </>
                            );
                          })()}
                        </svg>
                        
                        <div className="chart-labels">
                          {analytics.dailyStats.map((stat, idx) => (
                            <div key={idx} className="chart-label-item">
                              <div className="label-date">{stat.date}</div>
                              <div className="label-revenue">
                                {stat.revenue >= 1000000 
                                  ? `${(stat.revenue/1000000).toFixed(1)}jt` 
                                  : stat.revenue >= 1000
                                  ? `${(stat.revenue/1000).toFixed(0)}rb`
                                  : formatCurrency(stat.revenue)}
                              </div>
                              <div className="label-orders">{stat.paidOrders || 0} orders</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="empty-chart">Belum ada data penjualan</p>
                    )}
                  </div>
                </div>

                <div className="chart-card">
                  <h3>📅 Penjualan Bulanan (6 Bulan Terakhir)</h3>
                  <div className="chart-placeholder">
                    {analytics?.monthlyStats?.length > 0 ? (
                      <div className="monthly-stats">
                        {analytics.monthlyStats.map((stat, idx) => (
                          <div key={idx} className="monthly-item">
                            <div className="monthly-month">{stat.month}</div>
                            <div className="monthly-revenue">{formatCurrency(stat.revenue)}</div>
                            <div className="monthly-orders">{stat.paidOrders} paid / {stat.orders} total</div>
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
          margin: 0 0 0.25rem 0;
          color: #212529;
        }

        .stat-note {
          color: #6c757d;
          font-size: 0.75rem;
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
        }

        .tab:hover {
          color: #667eea;
        }

        .tab-active {
          color: #667eea;
          border-bottom-color: #667eea;
        }

        .content-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem 2rem 2rem;
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0 0 1.5rem 0;
          color: #212529;
        }

        .file-upload-wrapper {
  position: relative;
}

.file-input {
  display: none;
}

.file-label {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem;
  border: 2px dashed #e9ecef;
  border-radius: 8px;
  background: #f8f9fa;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 600;
  color: #495057;
}

.file-label:hover {
  border-color: #667eea;
  background: #f0f4ff;
  color: #667eea;
}

.upload-icon {
  font-size: 1.5rem;
}

.upload-spinner {
  width: 20px;
  height: 20px;
  border: 3px solid #e9ecef;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.btn-remove-image {
  margin-top: 0.75rem;
  width: 100%;
  padding: 0.5rem;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-remove-image:hover {
  background: #c82333;
  transform: translateY(-2px);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
        }

        .btn-full {
          width: 100%;
        }

        /* Overview Section */
        .overview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 1.5rem;
        }

        .overview-card {
          background: white;
          padding: 1.5rem;
          border-radius: 16px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
        }

        .overview-card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.125rem;
          color: #212529;
        }

        .mini-order-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          border-bottom: 1px solid #e9ecef;
        }

        .mini-order-card:last-child {
          border-bottom: none;
        }

        .mini-product-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          border-bottom: 1px solid #e9ecef;
        }

        .mini-product-card:last-child {
          border-bottom: none;
        }

        .text-sm {
          font-size: 0.875rem;
          color: #6c757d;
          margin: 0.25rem 0 0 0;
        }

        .revenue-text {
          font-weight: 600;
          color: #667eea;
        }

        .badge {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .status-paid {
          background: #d4edda;
          color: #155724;
        }

        .status-pending {
          background: #fff3cd;
          color: #856404;
        }

        .empty-text {
          text-align: center;
          color: #6c757d;
          padding: 2rem;
        }

        /* Orders Section */
        .table-responsive {
          overflow-x: auto;
          background: white;
          border-radius: 16px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
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
          border-bottom: 2px solid #e9ecef;
        }

        .data-table td {
          padding: 1rem;
          border-bottom: 1px solid #e9ecef;
        }

        .data-table tbody tr:hover {
          background: #f8f9fa;
        }

        .mono {
          font-family: 'Courier New', monospace;
          font-size: 0.875rem;
          color: #667eea;
          font-weight: 600;
        }

        .customer-info strong {
          display: block;
          color: #212529;
        }

        .customer-info small {
          color: #6c757d;
        }

        .order-item {
          font-size: 0.875rem;
          color: #495057;
          padding: 0.25rem 0;
        }

        .amount {
          font-weight: 600;
          color: #212529;
        }

        .status-badge {
          padding: 0.375rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          display: inline-block;
        }

        /* Products Section */
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .product-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
          transition: transform 0.3s;
        }

        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
        }

        .product-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }

        .product-image-placeholder {
          width: 100%;
          height: 200px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .placeholder-icon {
          font-size: 4rem;
          opacity: 0.7;
        }

        .product-info {
          padding: 1.25rem;
        }

        .product-info h4 {
          margin: 0 0 0.5rem 0;
          font-size: 1.125rem;
          color: #212529;
        }

        .product-price {
          font-size: 1.25rem;
          font-weight: 700;
          color: #667eea;
          margin: 0.5rem 0;
        }

        .product-stock {
          font-size: 0.875rem;
          color: #6c757d;
          margin: 0.25rem 0;
        }

        .product-description {
          font-size: 0.875rem;
          color: #495057;
          margin: 0.75rem 0;
          line-height: 1.5;
        }

        .product-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .btn-edit,
        .btn-delete {
          flex: 1;
          padding: 0.625rem;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-edit {
          background: #e3f2fd;
          color: #1976d2;
        }

        .btn-edit:hover {
          background: #1976d2;
          color: white;
        }

        .btn-delete {
          background: #ffebee;
          color: #c62828;
        }

        .btn-delete:hover {
          background: #c62828;
          color: white;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }

        .modal-content {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          max-width: 600px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
        }

        .modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: #f8f9fa;
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
        }

        .modal-close:hover {
          background: #e9ecef;
        }

        .modal-content h3 {
          margin: 0 0 1.5rem 0;
          font-size: 1.5rem;
          color: #212529;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #495057;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.3s;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #667eea;
        }

        .form-hint {
          display: block;
          margin-top: 0.5rem;
          font-size: 0.875rem;
          color: #6c757d;
        }

        .image-preview-container {
          margin-top: 1rem;
        }

        .preview-label {
          font-size: 0.875rem;
          color: #495057;
          margin-bottom: 0.5rem;
        }

        .image-preview {
          border: 2px dashed #e9ecef;
          border-radius: 8px;
          padding: 1rem;
          background: #f8f9fa;
        }

        .image-preview img {
          width: 100%;
          max-height: 200px;
          object-fit: contain;
          border-radius: 4px;
        }

        .image-error {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          color: #dc3545;
          text-align: center;
        }

        .image-error span {
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .image-error small {
          font-size: 0.875rem;
        }

        /* Analytics Section */
        .chart-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
          gap: 1.5rem;
        }

        .chart-card {
          background: white;
          padding: 1.5rem;
          border-radius: 16px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
        }

        .chart-card h3 {
          margin: 0 0 1.5rem 0;
          font-size: 1.125rem;
          color: #212529;
        }

        .line-chart-container {
          padding: 1rem 0;
        }

        .line-chart {
          width: 100%;
          height: 300px;
          margin-bottom: 1rem;
        }

        .chart-point {
          cursor: pointer;
          transition: all 0.3s;
        }

        .chart-point:hover {
          r: 8;
        }

        .chart-labels {
          display: flex;
          justify-content: space-between;
          padding: 0 1rem;
        }

        .chart-label-item {
          text-align: center;
          font-size: 0.75rem;
        }

        .label-date {
          font-weight: 600;
          color: #495057;
          margin-bottom: 0.25rem;
        }

        .label-revenue {
          color: #667eea;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }

        .label-orders {
          color: #6c757d;
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
          border-radius: 8px;
        }

        .monthly-month {
          font-weight: 600;
          color: #495057;
          flex: 1;
        }

        .monthly-revenue {
          font-weight: 700;
          color: #667eea;
          flex: 1;
          text-align: center;
        }

        .monthly-orders {
          font-size: 0.875rem;
          color: #6c757d;
          flex: 1;
          text-align: right;
        }

        .empty-chart {
          text-align: center;
          color: #6c757d;
          padding: 3rem;
        }

        .loading,
        .empty-state {
          text-align: center;
          padding: 3rem;
          color: #6c757d;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .tabs-container {
            overflow-x: auto;
            padding-bottom: 0.5rem;
          }

          .tab {
            white-space: nowrap;
          }

          .overview-grid {
            grid-template-columns: 1fr;
          }

          .chart-grid {
            grid-template-columns: 1fr;
          }

          .products-grid {
            grid-template-columns: 1fr;
          }

          .table-responsive {
            font-size: 0.875rem;
          }

          .data-table th,
          .data-table td {
            padding: 0.75rem 0.5rem;
          }
        }
      `}</style>
    </>
  );
}