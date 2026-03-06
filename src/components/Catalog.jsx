import { useState, useMemo } from "react";
import { useProductos } from "../hooks/useProductos";
import SearchBar from "./SearchBar";
import CategoryFilter from "./CategoryFilter";
import AdvancedFilters from "./AdvancedFilters";
import ProductCard from "./ProductCard";
import "./Catalog.css";

export default function Catalog() {
  const { productos, loading, error } = useProductos();
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    precioMin: 0,
    precioMax: 500,
    tipo: "",
    disponibleSolo: false,
  });

  const filteredProducts = useMemo(() => {
    let result = productos;

    // Filtrir por categoría
    if (selectedCategory !== "todos") {
      result = result.filter((p) => p.categoria === selectedCategory);
    }

    // Filtrar por búsqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.nombre.toLowerCase().includes(query) ||
          p.tags?.some((t) => t.toLowerCase().includes(query)) ||
          p.categoria.toLowerCase().includes(query) ||
          p.descripcion?.toLowerCase().includes(query),
      );
    }

    // Filtrar por precio
    result = result.filter(
      (p) => p.precio >= filters.precioMin && p.precio <= filters.precioMax,
    );

    // Filtrar por tipo
    if (filters.tipo) {
      result = result.filter((p) => p.tipo_producto === filters.tipo);
    }

    // Filtrer por disponibilidad
    if (filters.disponibleSolo) {
      result = result.filter(
        (p) =>
          (p.stock?.sucursal_centro || 0) > 0 ||
          (p.stock?.sucursal_norte || 0) > 0,
      );
    }

    return result;
  }, [productos, selectedCategory, searchQuery, filters]);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="catalog-container">
      <SearchBar onSearch={handleSearch} produtosDisponibles={productos} />
      <CategoryFilter
        onCategoryChange={handleCategoryChange}
        selectedCategory={selectedCategory}
      />
      <AdvancedFilters onFiltersChange={handleFiltersChange} />

      <div className="catalog-content">
        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Cargando productos...</p>
          </div>
        )}

        {error && (
          <div className="error-state">
            <p>❌ Error al cargar productos: {error}</p>
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="empty-state">
            <p className="empty-icon">🔍</p>
            <p className="empty-title">No encontramos productos</p>
            <p className="empty-message">
              Intenta cambiar los filtros o la búsqueda
            </p>
          </div>
        )}

        {!loading && filteredProducts.length > 0 && (
          <>
            <div className="results-info">
              <p>
                Mostrando <strong>{filteredProducts.length}</strong> de{" "}
                <strong>{productos.length}</strong> productos
              </p>
            </div>

            <div className="products-grid">
              {filteredProducts.map((producto) => (
                <ProductCard key={producto._id} producto={producto} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
