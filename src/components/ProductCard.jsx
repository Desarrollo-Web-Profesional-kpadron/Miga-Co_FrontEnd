import "./ProductCard.css";
import { useState } from "react";

export default function ProductCard({ producto }) {
  const [imagenError, setImagenError] = useState(false);

  const stockDisponible =
    producto.stock?.sucursal_centro > 0 || producto.stock?.sucursal_norte > 0;

  const foto = producto.multimedia?.fotos_exterior?.[0] || "/placeholder.jpg";

  return (
    <div className="product-card">
      <div className="product-image">
        <img
          src={foto}
          alt={producto.nombre}
          onError={(e) => {
            setImagenError(true);
            e.target.src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23E8F4DC' width='100' height='100'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='%23728156' font-size='12'%3EImagen no disponible%3C/text%3E%3C/svg%3E";
          }}
        />
        {!stockDisponible && <div className="stock-agotado">Agotado</div>}
        {stockDisponible && <div className="stock-disponible">En stock</div>}
      </div>

      <div className="product-content">
        <div className="product-category">
          {producto.subcategoria || producto.categoria}
        </div>

        <h3 className="product-name">{producto.nombre}</h3>

        <p className="product-description">
          {producto.descripcion?.substring(0, 80)}...
        </p>

        <div className="product-tags">
          {producto.tags?.slice(0, 2).map((tag, idx) => (
            <span key={idx} className="tag">
              {tag}
            </span>
          ))}
        </div>

        <div className="product-footer">
          <div className="product-price">
            <span className="price-amount">
              ${producto.precio?.toLocaleString()}
            </span>
          </div>
          <button className="btn-ver-mas">Ver más</button>
        </div>

        {producto.personalizable?.permite_mensaje && (
          <div className="personalizable-badge">✨ Personalizable</div>
        )}
      </div>
    </div>
  );
}
