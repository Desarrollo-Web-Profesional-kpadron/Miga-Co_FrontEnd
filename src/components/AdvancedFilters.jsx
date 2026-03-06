import { useState } from "react";
import "./AdvancedFilters.css";

export default function AdvancedFilters({ onFiltersChange }) {
  const [precioMin, setPrecioMin] = useState(0);
  const [precioMax, setPrecioMax] = useState(500);
  const [tipo, setTipo] = useState("");
  const [disponibleSolo, setDisponibleSolo] = useState(false);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const handleApplyFilters = () => {
    onFiltersChange({
      precioMin,
      precioMax,
      tipo,
      disponibleSolo,
    });
  };

  const handleReset = () => {
    setPrecioMin(0);
    setPrecioMax(500);
    setTipo("");
    setDisponibleSolo(false);
    onFiltersChange({
      precioMin: 0,
      precioMax: 500,
      tipo: "",
      disponibleSolo: false,
    });
  };

  return (
    <div className="advanced-filters">
      <button
        className="filters-toggle"
        onClick={() => setMostrarFiltros(!mostrarFiltros)}
      >
        <span>⚙️ Filtros Avanzados</span>
        <span className={`toggle-icon ${mostrarFiltros ? "open" : ""}`}>▼</span>
      </button>

      <div className={`filters-content ${mostrarFiltros ? "visible" : ""}`}>
        <div className="filter-group">
          <label className="filter-label">Rango de Precio</label>
          <div className="price-range">
            <input
              type="range"
              min="0"
              max="500"
              value={precioMin}
              onChange={(e) => setPrecioMin(Number(e.target.value))}
              className="range-input"
            />
            <input
              type="range"
              min="0"
              max="500"
              value={precioMax}
              onChange={(e) => setPrecioMax(Number(e.target.value))}
              className="range-input"
            />
            <div className="price-display">
              <span>${precioMin}</span>
              <span>-</span>
              <span>${precioMax}</span>
            </div>
          </div>
        </div>

        <div className="filter-group">
          <label className="filter-label">Tipo de Producto</label>
          <div className="tipo-options">
            <label className="checkbox-label">
              <input
                type="radio"
                name="tipo"
                value=""
                checked={tipo === ""}
                onChange={(e) => setTipo(e.target.value)}
              />
              Todos
            </label>
            <label className="checkbox-label">
              <input
                type="radio"
                name="tipo"
                value="preparado"
                checked={tipo === "preparado"}
                onChange={(e) => setTipo(e.target.value)}
              />
              Preparados
            </label>
            <label className="checkbox-label">
              <input
                type="radio"
                name="tipo"
                value="materia_prima"
                checked={tipo === "materia_prima"}
                onChange={(e) => setTipo(e.target.value)}
              />
              Materias Primas
            </label>
          </div>
        </div>

        <div className="filter-group">
          <label className="checkbox-label large">
            <input
              type="checkbox"
              checked={disponibleSolo}
              onChange={(e) => setDisponibleSolo(e.target.checked)}
            />
            Solo productos en stock
          </label>
        </div>

        <div className="filter-actions">
          <button className="btn-apply" onClick={handleApplyFilters}>
            Aplicar Filtros
          </button>
          <button className="btn-reset" onClick={handleReset}>
            Limpiar
          </button>
        </div>
      </div>
    </div>
  );
}
