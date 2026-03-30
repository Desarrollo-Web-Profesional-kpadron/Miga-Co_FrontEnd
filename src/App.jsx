import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./pages/Navbar";
import Home from "./pages/Home";
import CatalogoPage from "./pages/CatalogoPage";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/Login";
import PerfilMigaCo from "./pages/Perfil";
import AdminProductos from "./pages/AdminProductos";
import AdminPedidos from "./pages/AdminPedidos";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  
  if (loading) {
    return <div className="loading-spinner">Cargando...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/productos" element={<CatalogoPage />} />
      <Route path="/producto/:id" element={<ProductDetail />} />
      
      {/* Rutas de usuario normal */}
      <Route 
        path="/perfil" 
        element={
          <ProtectedRoute>
            <PerfilMigaCo />
          </ProtectedRoute>
        } 
      />
      
      {/* Rutas de administrador */}
      <Route 
        path="/admin/productos" 
        element={
          <ProtectedRoute adminOnly={true}>
            <AdminProductos />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/pedidos" 
        element={
          <ProtectedRoute adminOnly={true}>
            <AdminPedidos />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;