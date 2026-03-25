import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="nav-container">
      <nav className="nav">
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          Miga<span>-Co</span>
        </Link>

        <ul className="nav-links">
          <li>
            <Link to="/">Inicio</Link>
          </li>
          <li>
            <Link to="/productos">Productos</Link>
          </li>
          <li>
            <a href="#sucursales">Sucursales</a>
          </li>
          <li>
            <a href="#creaciones">Creaciones</a>
          </li>
          <li className="login-item">
            <Link to="/login" className="login-link">Iniciar Sesión</Link>
          </li>
        </ul>

        <button className="hamburger" onClick={toggleMenu} aria-label="Menú">
          {menuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {/* Menú Móvil */}
      <ul className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <li onClick={closeMenu}>
          <Link to="/">Inicio</Link>
        </li>
        <li onClick={closeMenu}>
          <Link to="/productos">Productos</Link>
        </li>
        <li onClick={closeMenu}>
          <a href="#sucursales">Sucursales</a>
        </li>
        <li onClick={closeMenu}>
          <a href="#creaciones">Creaciones</a>
        </li>
        <li onClick={closeMenu} className="mobile-login-item">
          <Link to="/login" className="mobile-login-link">Iniciar Sesión</Link>
        </li>
      </ul>
    </div>
  );
}