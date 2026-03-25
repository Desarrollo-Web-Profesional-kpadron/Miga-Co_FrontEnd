import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios"; 
import "./Login.css";

export default function LoginMigaCo() {
  const navigate = useNavigate();
  
  // Estados de la UI
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false); // Estado para el modal de éxito

  // Estado del Formulario
  const [formData, setFormData] = useState({
    name: "", // Este se mapeará a 'nombre' en el envío
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(""); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setShowSuccess(false);

    try {
      if (isLogin) {
        // --- INICIO DE SESIÓN ---
        const response = await api.post("/auth/login", {
          email: formData.email,
          password: formData.password,
        });

        const { token } = response.data;
        localStorage.setItem("token", token);
        navigate("/");
        
      } else {
        // --- REGISTRO ---
        // Validación manual de contraseñas antes de enviar
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Las contraseñas no coinciden");
        }

        await api.post("/auth/registro", {
          nombre: formData.name, // Mapeo de 'name' a 'nombre' para el Backend
          email: formData.email,
          password: formData.password,
        });

        // Mostrar éxito y limpiar campos sensibles
        setShowSuccess(true);
        setFormData({ ...formData, password: "", confirmPassword: "" });

        // Esperar un momento y cambiar a la pestaña de Login
        setTimeout(() => {
          setShowSuccess(false);
          setIsLogin(true);
        }, 3500);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Error de conexión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mc-root">
      <div className="mc-grid">
        
        {/* PANEL IZQUIERDO */}
        <motion.div 
          className="mc-left"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mc-brand">
            <div className="mc-brand-name">Miga<em>-Co</em></div>
            <p className="mc-brand-tagline">Pastelería artesanal</p>
          </div>
          <div className="mc-left-body">
            <h2>Aquí, el amor<br/>nunca sobra.</h2>
            <p>Queremos ser el invitado especial de todas tus celebraciones. Entra a tu cuenta y descubre nuestras creaciones.</p>
          </div>
          <div className="mc-perks">
            {["Pasteles a medida", "Envíos a domicilio", "Más de 200 diseños"].map((p) => (
              <div className="mc-perk" key={p}>
                <div className="mc-perk-dot">✦</div>
                <span>{p}</span>
              </div>
            ))}
          </div>
          <img className="mc-cake-img" src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&q=80" alt="Pastel" />
        </motion.div>

        {/* PANEL DERECHO */}
        <motion.div 
          className="mc-right"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mc-tabs">
            <button className={`mc-tab ${isLogin ? "active" : ""}`} onClick={() => {setIsLogin(true); setError(""); setShowSuccess(false);}}>Iniciar sesión</button>
            <button className={`mc-tab ${!isLogin ? "active" : ""}`} onClick={() => {setIsLogin(false); setError("");}}>Registrarse</button>
          </div>

          {/* Notificación de Éxito Custom */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mc-success-toast"
              >
                <span className="mc-success-icon">✦</span>
                <div className="mc-success-content">
                  <strong>¡Registro completado!</strong>
                  <p>Bienvenido a la familia. Ya puedes iniciar sesión.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div 
              key={isLogin ? "h-login" : "h-reg"}
              className="mc-form-head"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <h2>{isLogin ? <>¡Bienvenido <em>de nuevo</em>!</> : <>Crea tu <em>cuenta</em></>}</h2>
              <p>{isLogin ? "Ingresa tus credenciales" : "Únete a Miga-Co hoy mismo"}</p>
            </motion.div>
          </AnimatePresence>

          {/* Errores del Backend */}
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mc-error-msg">
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mc-fields">
              {!isLogin && (
                <div className="mc-field">
                  <label>Nombre completo</label>
                  <input required type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Tu nombre" />
                </div>
              )}
              <div className="mc-field">
                <label>Email</label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="tu@email.com" />
              </div>
              <div className="mc-field">
                <label>Contraseña</label>
                <div className="mc-field-pw">
                  <input 
                    required 
                    type={showPassword ? "text" : "password"} 
                    name="password" 
                    value={formData.password} 
                    onChange={handleChange} 
                    placeholder="••••••••" 
                  />
                  <button type="button" className="mc-pw-toggle" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
              </div>
              {!isLogin && (
                <div className="mc-field">
                  <label>Confirmar contraseña</label>
                  <input 
                    required 
                    type={showPassword ? "text" : "password"} 
                    name="confirmPassword" 
                    value={formData.confirmPassword} 
                    onChange={handleChange} 
                    placeholder="••••••••" 
                  />
                </div>
              )}
            </div>

            <motion.button 
              type="submit" 
              className="mc-submit" 
              disabled={isLoading}
              whileHover={{ scale: 1.01 }} 
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? <span className="mc-loader"></span> : isLogin ? "Iniciar sesión" : "Crear cuenta"}
            </motion.button>
          </form>

          <p className="mc-footer-text">
            {isLogin ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
            <button type="button" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Regístrate aquí" : "Inicia sesión"}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}