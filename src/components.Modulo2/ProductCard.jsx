import "./ProductCard.css";
import { useState } from "react";

export default function ProductCard({ product, onSelectProduct }) {
  const [imageError, setImageError] = useState(false);

  const esPersonalizable =
    product.personalizable?.permite_mensaje ||
    product.personalizable?.rellenos_disponibles?.length > 0 ||
    product.personalizable?.coberturas_disponibles?.length > 0;

  const primeraFoto =
    product.multimedia?.fotos_exterior?.[0] ||
    "https://via.placeholder.com/300?text=Sin+imagen";
  const stock = product.stock?.sucursal_centro || 0;
  const disponible = stock > 0;

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img
          src={
            imageError
              ? "https://via.placeholder.com/300?text=Error"
              : primeraFoto
          }
          alt={product.nombre}
          className="product-image"
          onError={() => setImageError(true)}
        />
        {!disponible && <div className="badge-agotado">Agotado</div>}
        {esPersonalizable && (
          <div className="badge-personalizable">Personalizable</div>
        )}
      </div>

      <div className="product-info">
        <div className="product-categoria">{product.categoria}</div>
        <h3 className="product-nombre">{product.nombre}</h3>

        <p className="product-descripcion">
          {product.descripcion?.substring(0, 80)}...
        </p>

        <div className="product-tags">
          {product.tags?.slice(0, 2).map((tag, i) => (
            <span key={i} className="tag">
              {tag}
            </span>
          ))}
        </div>

        <div className="product-footer">
          <div className="product-precio">
            ${product.precio.toLocaleString()}
          </div>
          <button className="btn-agregar" disabled={!disponible}>
            {disponible ? "Agregar" : "Agotado"}
          </button>
        </div>

        <div className="product-stock">Stock: {stock} unidades</div>

        <button
          className="btn-vermas"
          onClick={() => onSelectProduct && onSelectProduct(product)}
        >
          Ver más
        </button>
      </div>
    </div>
  );
}
