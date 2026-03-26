import "./CategoryFilter.css";

const CATEGORIAS = [
  { id: "todos", nombre: "Todos", icon: "🎂" },
  { id: "Pasteles", nombre: "Pasteles", icon: "🍰" },
  { id: "Repostería y Galletas", nombre: "Repostería", icon: "🍪" },
  { id: "Reposteria Saludable", nombre: "Reposteria Saludable", icon: "🌿" },
  { id: "Panadería", nombre: "Panadería", icon: "🥐" },
  { id: "Gelatinas", nombre: "Gelatinas", icon: "✨" },
  { id: "Materias Primas", nombre: "Materias Primas", icon: "🥄" },
];

export default function CategoryFilter({ onCategoryChange, selectedCategory }) {
  return (
    <div className="category-filter">
      <div className="filter-header">
        <h3>Categorías</h3>
      </div>

      <div className="categories-grid">
        {CATEGORIAS.map((cat) => (
          <button
            key={cat.id}
            className={`category-btn ${
              selectedCategory === cat.id ? "active" : ""
            }`}
            onClick={() => onCategoryChange(cat.id)}
          >
            <span className="category-icon">{cat.icon}</span>
            <span className="category-name">{cat.nombre}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
