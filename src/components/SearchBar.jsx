import { useState, useEffect } from "react";
import "./SearchBar.css";

export default function SearchBar({ onSearch, produtosDisponibles = [] }) {
  const [query, setQuery] = useState("");
  const [sugerencias, setSugerencias] = useState([]);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setSugerencias([]);
      setMostrarSugerencias(false);
      return;
    }

    const queryLower = query.toLowerCase();
    const sugerenciasFiltered = produtosDisponibles
      .filter(
        (p) =>
          p.nombre.toLowerCase().includes(queryLower) ||
          p.tags?.some((t) => t.toLowerCase().includes(queryLower)) ||
          p.categoria.toLowerCase().includes(queryLower),
      )
      .slice(0, 6)
      .map((p) => ({
        id: p._id,
        nombre: p.nombre,
        tipo: p.tags?.[0] || p.categoria,
      }));

    setSugerencias(sugerenciasFiltered);
    setMostrarSugerencias(true);
  }, [query, produtosDisponibles]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      setMostrarSugerencias(false);
    }
  };

  const handleSugerencia = (sugerencia) => {
    setQuery(sugerencia.nombre);
    onSearch(sugerencia.nombre);
    setMostrarSugerencias(false);
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder="Busca por nombre, ingredientes o tipo..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn">
            🔍
          </button>
        </div>

        {mostrarSugerencias && sugerencias.length > 0 && (
          <div className="sugerencias-dropdown">
            {sugerencias.map((sugerencia) => (
              <div
                key={sugerencia.id}
                className="sugerencia-item"
                onClick={() => handleSugerencia(sugerencia)}
              >
                <span className="sugerencia-nombre">{sugerencia.nombre}</span>
                <span className="sugerencia-tipo">{sugerencia.tipo}</span>
              </div>
            ))}
          </div>
        )}
      </form>
    </div>
  );
}
