export default function ProductCard({ product, onAdd }) {
  return (
    <div style={{border:'1px solid #ddd',padding:12,borderRadius:6}}>
      <img src={product.image || '/placeholder.png'} alt={product.name} style={{width:'100%',height:140,objectFit:'cover'}} />
      <h3>{product.name}</h3>
      <p>Rp {product.price?.toLocaleString()}</p>
      <button onClick={() => onAdd(product)}>Tambah</button>
    </div>
  );
}
