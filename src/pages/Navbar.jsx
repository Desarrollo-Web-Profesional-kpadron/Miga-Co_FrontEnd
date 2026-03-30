import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, isAdmin, logout, loading } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="nav-container">
        <nav className="nav" style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "rgba(232,244,220,0.95)",
          backdropFilter: "blur(12px)",
        }}>
          <Link to="/" className="nav-logo" onClick={closeMenu}>
            Miga<span>-Co</span>
          </Link>
        </nav>
      </div>
    );
  }

  const getNavLinks = () => {
    const links = [];

    links.push(
      <li key="home">
        <Link to="/">Inicio</Link>
      </li>
    );

    links.push(
      <li key="products">
        <Link to="/productos">Productos</Link>
      </li>
    );

    if (isAuthenticated && !isAdmin) {
      links.push(
        <li key="cart">
          <Link to="/carrito">Carrito</Link>
        </li>
      );
      links.push(
        <li key="profile">
          <Link to="/perfil">Perfil</Link>
        </li>
      );
    }

    if (isAdmin) {
      links.push(
        <li key="admin-pedidos">
          <Link to="/admin/pedidos" className="admin-link"> Pedidos</Link>
        </li>
      );
      links.push(
        <li key="admin-productos">
          <Link to="/admin/productos" className="admin-link"> Productos</Link>
        </li>
      );
    }

    if (isAuthenticated) {
      links.push(
        <li key="logout" className="logout-item">
          <button onClick={handleLogout} className="logout-btn">
            Cerrar Sesión
          </button>
        </li>
      );
    } else {
      links.push(
        <li key="login" className="login-item">
          <Link to="/login" className="login-link">
            Iniciar Sesión
          </Link>
        </li>
      );
    }

    return links;
  };

  const getMobileLinks = () => {
    const links = [];

    links.push(
      <li key="mobile-home" onClick={closeMenu}>
        <Link to="/">Inicio</Link>
      </li>
    );

    links.push(
      <li key="mobile-products" onClick={closeMenu}>
        <Link to="/productos">Productos</Link>
      </li>
    );

    if (isAuthenticated && !isAdmin) {
      links.push(
        <li key="mobile-cart" onClick={closeMenu}>
          <Link to="/carrito">Carrito</Link>
        </li>
      );
      links.push(
        <li key="mobile-profile" onClick={closeMenu}>
          <Link to="/perfil">Perfil</Link>
        </li>
      );
    }

    if (isAdmin) {
      links.push(
        <li key="mobile-admin-pedidos" onClick={closeMenu}>
          <Link to="/admin/pedidos">📦 Pedidos</Link>
        </li>
      );
      links.push(
        <li key="mobile-admin-productos" onClick={closeMenu}>
          <Link to="/admin/productos">📝 Productos</Link>
        </li>
      );
    }

    if (isAuthenticated) {
      links.push(
        <li key="mobile-logout" onClick={handleLogout} className="mobile-logout-item">
          <button className="mobile-logout-btn">Cerrar Sesión</button>
        </li>
      );
    } else {
      links.push(
        <li key="mobile-login" onClick={closeMenu} className="mobile-login-item">
          <Link to="/login" className="mobile-login-link">
            Iniciar Sesión
          </Link>
        </li>
      );
    }

    return links;
  };

  return (
    <div className="nav-container">
      <nav
        className="nav"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "rgba(232,244,220,0.95)",
          backdropFilter: "blur(12px)",
        }}
      >
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          Miga<span>-Co</span>
        </Link>

        <ul className="nav-links">{getNavLinks()}</ul>

        <button className="hamburger" onClick={toggleMenu} aria-label="Menú">
          {menuOpen ? "✕" : "☰"}
        </button>
      </nav>

      <ul className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        {getMobileLinks()}
      </ul>
    </div>
  );
}