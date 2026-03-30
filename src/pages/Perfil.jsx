import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../Api/axios";
import "./Perfil.css";
import {
  IconHome,
  IconUser,
  IconEdit,
  IconTrash,
  IconPlus,
  IconStar,
  IconLogout,
  IconSave,
  IconOrders
} from "../utils/perfilUtils";

export default function PerfilMigaCo() {
  const { logout, user: authUser, loading: authLoading } = useAuth();
  
  const [activeTab, setActiveTab] = useState("direcciones");
  const [direcciones, setDirecciones] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [loadingPedidos, setLoadingPedidos] = useState(false);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({
    etiqueta: "Hogar",
    calle: "",
    ciudad: "",
    codigo_postal: "",
    referencias: "",
    es_principal: false
  });
  const [profileForm, setProfileForm] = useState({
    nombre: "",
    email: ""
  });
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  // Cargar direcciones del usuario
  useEffect(() => {
    if (authUser) {
      // Inicializar el formulario de perfil con los datos del usuario
      setProfileForm({
        nombre: authUser.nombre || "",
        email: authUser.email || ""
      });
      // Cargar direcciones desde el perfil del usuario
      if (authUser.perfil && authUser.perfil.direcciones) {
        setDirecciones(authUser.perfil.direcciones);
      }
      // Cargar pedidos del usuario
      cargarPedidos();
      setLoading(false);
    } else if (!authLoading) {
      // Si no hay usuario autenticado y ya terminó de cargar, redirigir
      window.location.href = "/login";
    }
  }, [authUser, authLoading]);

  // Función para cargar los pedidos del usuario
  const cargarPedidos = async () => {
    try {
      setLoadingPedidos(true);
      const response = await api.get('/pedidos/mis-pedidos');
      setPedidos(response.data);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
      showToast("Error al cargar tus pedidos");
    } finally {
      setLoadingPedidos(false);
    }
  };

  // Función para obtener el estado en español
  const getEstadoEnEspanol = (estado) => {
    const estados = {
      'pendiente': 'Pendiente',
      'confirmado': 'Confirmado',
      'preparando': 'Preparando',
      'enviado': 'Enviado',
      'entregado': 'Entregado',
      'cancelado': 'Cancelado'
    };
    return estados[estado] || estado;
  };

  // Función para obtener el color del estado
  const getEstadoColor = (estado) => {
    const colores = {
      'pendiente': '#f39c12',
      'confirmado': '#3498db',
      'preparando': '#9b59b6',
      'enviado': '#1abc9c',
      'entregado': '#27ae60',
      'cancelado': '#e74c3c'
    };
    return colores[estado] || '#95a5a6';
  };

  // Formatear fecha
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Función para cargar las direcciones desde el backend
  const cargarDirecciones = async () => {
    try {
      setLoading(true);
      const response = await api.get('/usuarios/perfil');
      if (response.data.perfil && response.data.perfil.direcciones) {
        setDirecciones(response.data.perfil.direcciones);
      }
    } catch (error) {
      console.error('Error al cargar direcciones:', error);
      showToast("Error al cargar las direcciones");
    } finally {
      setLoading(false);
    }
  };

  // Agregar nueva dirección
  const agregarDireccion = async (direccionData) => {
    try {
      const response = await api.post('/usuarios/direcciones', direccionData);
      
      console.log('Respuesta del servidor:', response.data);
      
      if (response.data.usuario && response.data.usuario.perfil?.direcciones) {
        setDirecciones(response.data.usuario.perfil.direcciones);
        showToast("✦ Dirección agregada exitosamente");
        return true;
      } 
      else if (response.data.direccion) {
        setDirecciones(prev => [...prev, response.data.direccion]);
        showToast("✦ Dirección agregada exitosamente");
        return true;
      }
      else if (response.data._id) {
        setDirecciones(prev => [...prev, response.data]);
        showToast("✦ Dirección agregada exitosamente");
        return true;
      }
      else if (response.data.perfil?.direcciones) {
        setDirecciones(response.data.perfil.direcciones);
        showToast("✦ Dirección agregada exitosamente");
        return true;
      }
      else {
        console.error('Estructura de respuesta no reconocida:', response.data);
        showToast("Error: Estructura de respuesta no válida");
        return false;
      }
    } catch (error) {
      console.error('Error al agregar dirección:', error);
      showToast(error.response?.data?.message || "Error al agregar dirección");
      return false;
    }
  };

  // Actualizar dirección existente
  const actualizarDireccion = async (direccionId, direccionData) => {
    try {
      const response = await api.put(`/usuarios/direcciones/${direccionId}`, direccionData);
      
      console.log('Respuesta de actualización:', response.data);
      
      if (response.data.usuario && response.data.usuario.perfil?.direcciones) {
        setDirecciones(response.data.usuario.perfil.direcciones);
        showToast("✦ Dirección actualizada exitosamente");
        return true;
      }
      else if (response.data.direccion) {
        setDirecciones(prev => prev.map(d => 
          d._id === direccionId ? response.data.direccion : d
        ));
        showToast("✦ Dirección actualizada exitosamente");
        return true;
      }
      else if (response.data._id) {
        setDirecciones(prev => prev.map(d => 
          d._id === direccionId ? response.data : d
        ));
        showToast("✦ Dirección actualizada exitosamente");
        return true;
      }
      else if (response.data.perfil?.direcciones) {
        setDirecciones(response.data.perfil.direcciones);
        showToast("✦ Dirección actualizada exitosamente");
        return true;
      }
      else {
        console.error('Estructura de respuesta no reconocida:', response.data);
        showToast("Error: Estructura de respuesta no válida");
        return false;
      }
    } catch (error) {
      console.error('Error al actualizar dirección:', error);
      showToast(error.response?.data?.message || "Error al actualizar dirección");
      return false;
    }
  };

  // Eliminar dirección
  const eliminarDireccion = async (direccionId) => {
    try {
      const response = await api.delete(`/usuarios/direcciones/${direccionId}`);
      
      console.log('Respuesta de eliminación:', response.data);
      
      if (response.data.usuario && response.data.usuario.perfil?.direcciones) {
        setDirecciones(response.data.usuario.perfil.direcciones);
        showToast("✦ Dirección eliminada exitosamente");
        return true;
      }
      else if (response.data.message) {
        setDirecciones(prev => prev.filter(d => d._id !== direccionId));
        showToast("✦ Dirección eliminada exitosamente");
        return true;
      }
      else {
        setDirecciones(prev => prev.filter(d => d._id !== direccionId));
        showToast("✦ Dirección eliminada exitosamente");
        return true;
      }
    } catch (error) {
      console.error('Error al eliminar dirección:', error);
      showToast(error.response?.data?.message || "Error al eliminar dirección");
      return false;
    }
  };

  // Actualizar perfil
  const actualizarPerfil = async (datos) => {
    try {
      await api.put('/usuarios/perfil', datos);
      showToast("✦ Perfil actualizado exitosamente");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      return true;
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      showToast(error.response?.data?.message || "Error al actualizar perfil");
      return false;
    }
  };

  const openAdd = () => { 
    setForm({
      etiqueta: "Hogar",
      calle: "",
      ciudad: "",
      codigo_postal: "",
      referencias: "",
      es_principal: false
    }); 
    setModal({ type: "add" }); 
  };
  
  const openEdit = (addr) => { 
    setForm({ ...addr }); 
    setModal({ type: "edit", data: addr }); 
  };
  
  const openDelete = (addr) => setModal({ type: "delete", data: addr });
  
  const openEditProfile = () => {
    setProfileForm({ 
      nombre: authUser?.nombre || "", 
      email: authUser?.email || "" 
    });
    setModal({ type: "editProfile" });
  };
  
  const closeModal = () => setModal(null);

  const handleSave = async () => {
    let success = false;

    if (modal.type === "add") {
      const nuevaDireccion = {
        etiqueta: form.etiqueta,
        calle: form.calle,
        ciudad: form.ciudad,
        codigo_postal: form.codigo_postal,
        referencias: form.referencias,
        es_principal: form.es_principal
      };
      success = await agregarDireccion(nuevaDireccion);
    } else {
      const direccionActualizada = {
        etiqueta: form.etiqueta,
        calle: form.calle,
        ciudad: form.ciudad,
        codigo_postal: form.codigo_postal,
        referencias: form.referencias,
        es_principal: form.es_principal
      };
      success = await actualizarDireccion(modal.data._id, direccionActualizada);
    }

    if (success) {
      closeModal();
    }
  };

  const handleSaveProfile = async () => {
    const success = await actualizarPerfil({
      nombre: profileForm.nombre,
      email: profileForm.email
    });
    
    if (success) {
      closeModal();
    }
  };

  const handleDelete = async () => {
    const success = await eliminarDireccion(modal.data._id);
    if (success) {
      closeModal();
    }
  };

  const handleLogout = () => {
    logout();
    showToast("✦ Sesión cerrada");
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  };

  // Mostrar loading mientras se cargan los datos
  if (authLoading || loading) {
    return (
      <div className="pf-root">
        <div className="loading-container">
          <div className="loading-spinner">Cargando perfil...</div>
        </div>
      </div>
    );
  }

  // Si no hay usuario autenticado, redirigir
  if (!authUser) {
    return null;
  }

  // Acceder de forma segura a las propiedades del usuario
  const nombreCompleto = authUser.nombre || "Usuario";
  const emailUsuario = authUser.email || "";
  const fechaRegistro = authUser.fecha_registro || new Date().toISOString();
  
  const initials = nombreCompleto
    .split(" ")
    .map(w => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
    
  const fechaFormateada = fechaRegistro
    ? new Date(fechaRegistro).toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : "";

  return (
    <div className="pf-root">
      <div className="pf-layout">
        <aside className="pf-sidebar">
          <div className="pf-card">
            <div className="pf-avatar-wrap">
              <div className="pf-avatar">{initials}</div>
              <div className="pf-sidebar-name">{nombreCompleto}</div>
              <div className="pf-sidebar-email">{emailUsuario}</div>
              <div className="pf-sidebar-since">
                Miembro desde {fechaFormateada}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <button className={`pf-nav-item ${activeTab === "perfil" ? "active" : ""}`} onClick={() => setActiveTab("perfil")}>
                <IconUser /> Mis datos
              </button>
              <button className={`pf-nav-item ${activeTab === "direcciones" ? "active" : ""}`} onClick={() => setActiveTab("direcciones")}>
                <IconHome /> Direcciones ({direcciones.length})
              </button>
              <button className={`pf-nav-item ${activeTab === "pedidos" ? "active" : ""}`} onClick={() => setActiveTab("pedidos")}>
                <IconOrders /> Mis pedidos ({pedidos.length})
              </button>
              <button className="pf-nav-item pf-logout-btn" onClick={handleLogout}>
                <IconLogout /> Cerrar sesión
              </button>
            </div>
          </div>
        </aside>

        <main className="pf-main">
          <AnimatePresence mode="wait">
            {activeTab === "direcciones" && (
              <motion.div
                key="dir"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
                style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
              >
                <div className="pf-header-section">
                  <div>
                    <h2 className="pf-section-title">Mis <em>direcciones</em></h2>
                    <p className="pf-section-sub">Gestiona tus domicilios de entrega</p>
                  </div>
                  <button className="pf-add-btn-mobile" onClick={openAdd}>
                    <IconPlus /> Agregar
                  </button>
                </div>

                <div className="pf-addr-grid">
                  {direcciones.length === 0 ? (
                    <div className="pf-empty-state">
                      <p>No tienes direcciones guardadas</p>
                      <button onClick={openAdd} className="pf-empty-btn">
                        Agregar tu primera dirección
                      </button>
                    </div>
                  ) : (
                    direcciones.map((addr) => (
                      <motion.div
                        key={addr._id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className={`pf-addr-card ${addr.es_principal ? "principal" : ""}`}
                      >
                        <div className="pf-addr-icon-col">
                          {addr.etiqueta === "Hogar" ? "🏠" : addr.etiqueta === "Trabajo" ? "💼" : "📍"}
                        </div>
                        <div className="pf-addr-body">
                          <div className="pf-addr-top-row">
                            <span className="pf-addr-badge">
                              {addr.etiqueta}
                            </span>
                            {addr.es_principal && (
                              <span className="pf-addr-badge main-badge">
                                <IconStar /> Principal
                              </span>
                            )}
                          </div>
                          <div className="pf-addr-label">{addr.calle}</div>
                          <div className="pf-addr-text">{addr.ciudad}, CP {addr.codigo_postal}</div>
                          {addr.referencias && <div className="pf-addr-ref">📌 {addr.referencias}</div>}
                        </div>
                        <div className="pf-addr-actions">
                          <motion.button whileTap={{ scale: 0.95 }} className="pf-btn-icon pf-btn-edit" onClick={() => openEdit(addr)}>
                            <IconEdit /> Editar
                          </motion.button>
                          <motion.button whileTap={{ scale: 0.95 }} className="pf-btn-icon pf-btn-delete" onClick={() => openDelete(addr)}>
                            <IconTrash /> Eliminar
                          </motion.button>
                        </div>
                      </motion.div>
                    ))
                  )}

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="pf-addr-add" onClick={openAdd}>
                    <IconPlus />
                    <span>Nueva dirección</span>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {activeTab === "perfil" && (
              <motion.div
                key="per"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
                style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
              >
                <div>
                  <h2 className="pf-section-title">Mis <em>datos</em></h2>
                  <p className="pf-section-sub">Información de tu cuenta</p>
                </div>
                <div className="pf-card pf-profile-card">
                  <div className="pf-info-grid">
                    {[
                      { label: "Nombre completo", val: nombreCompleto },
                      { label: "Email", val: emailUsuario },
                      { label: "Miembro desde", val: fechaFormateada },
                      { label: "Direcciones guardadas", val: direcciones.length },
                    ].map(f => (
                      <div className="pf-info-field" key={f.label}>
                        <label>{f.label}</label>
                        <div className="val">{f.val}</div>
                      </div>
                    ))}
                  </div>
                  <div className="pf-profile-actions">
                    <motion.button whileTap={{ scale: 0.95 }} className="pf-edit-profile-btn" onClick={openEditProfile}>
                      <IconEdit /> Editar información
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "pedidos" && (
              <motion.div
                key="ped"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
                style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
              >
                <div>
                  <h2 className="pf-section-title">Mis <em>pedidos</em></h2>
                  <p className="pf-section-sub">Historial de tus compras</p>
                </div>

                {loadingPedidos ? (
                  <div className="loading-container">
                    <div className="loading-spinner">Cargando pedidos...</div>
                  </div>
                ) : pedidos.length === 0 ? (
                  <div className="pf-empty-state">
                    <div className="empty-icon">🛒</div>
                    <p>No tienes pedidos aún</p>
                    <button className="pf-empty-btn" onClick={() => window.location.href = "/productos"}>
                      Explorar productos
                    </button>
                  </div>
                ) : (
                  <div className="pf-pedidos-grid">
                    {pedidos.map((pedido) => (
                      <motion.div
                        key={pedido._id}
                        className="pf-pedido-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="pf-pedido-header">
                          <div>
                            <span className="pf-pedido-numero">Pedido #{pedido._id.slice(-6)}</span>
                            <span className="pf-pedido-fecha">{formatearFecha(pedido.fecha)}</span>
                          </div>
                          <div className="pf-pedido-estado" style={{ backgroundColor: getEstadoColor(pedido.logistica?.estado) }}>
                            {getEstadoEnEspanol(pedido.logistica?.estado || 'pendiente')}
                          </div>
                        </div>

                        <div className="pf-pedido-items">
                          {pedido.items?.slice(0, 3).map((item, idx) => (
                            <div key={idx} className="pf-pedido-item">
                              <span className="pf-pedido-item-cantidad">{item.cantidad}x</span>
                              <span className="pf-pedido-item-nombre">
                                {item.producto_id?.nombre || "Producto"}
                              </span>
                              <span className="pf-pedido-item-precio">
                                ${(item.precio_unitario * item.cantidad).toLocaleString()}
                              </span>
                            </div>
                          ))}
                          {pedido.items?.length > 3 && (
                            <div className="pf-pedido-mas">
                              + {pedido.items.length - 3} producto(s) más
                            </div>
                          )}
                        </div>

                        <div className="pf-pedido-footer">
                          <div className="pf-pedido-total">
                            Total: <strong>${pedido.total?.toLocaleString() || 0}</strong>
                          </div>
                          <div className="pf-pedido-pago" style={{ 
                            color: pedido.pago?.estado === 'pagado' ? '#27ae60' : '#f39c12' 
                          }}>
                            Pago: {pedido.pago?.estado === 'pagado' ? 'Pagado' : 'Pendiente'}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Modales - mantienen el mismo código */}
      <AnimatePresence>
        {(modal?.type === "add" || modal?.type === "edit") && (
          <motion.div className="pf-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal}>
            <motion.div
              className="pf-modal"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.28 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="pf-modal-head">
                <h3 className="pf-modal-title">
                  {modal.type === "add" ? <>Nueva <em>dirección</em></> : <>Editar <em>dirección</em></>}
                </h3>
                <button className="pf-modal-close" onClick={closeModal}>✕</button>
              </div>

              <div className="pf-form-grid">
                <div className="pf-field pf-form-full">
                  <label>Etiqueta</label>
                  <select value={form.etiqueta} onChange={e => setForm({ ...form, etiqueta: e.target.value })}>
                    <option>Hogar</option>
                    <option>Trabajo</option>
                    <option>Otro</option>
                  </select>
                </div>
                <div className="pf-field pf-form-full">
                  <label>Calle y número</label>
                  <input placeholder="Av. Reforma 100, Col. Centro" value={form.calle} onChange={e => setForm({ ...form, calle: e.target.value })} />
                </div>
                <div className="pf-field">
                  <label>Ciudad</label>
                  <input placeholder="Ciudad de México" value={form.ciudad} onChange={e => setForm({ ...form, ciudad: e.target.value })} />
                </div>
                <div className="pf-field">
                  <label>Código Postal</label>
                  <input placeholder="06600" value={form.codigo_postal} onChange={e => setForm({ ...form, codigo_postal: e.target.value })} />
                </div>
                <div className="pf-field pf-form-full">
                  <label>Referencias</label>
                  <input placeholder="Color de fachada, número de dpto…" value={form.referencias} onChange={e => setForm({ ...form, referencias: e.target.value })} />
                </div>
                <div className="pf-form-full">
                  <label className="pf-checkbox-row">
                    <input type="checkbox" checked={form.es_principal} onChange={e => setForm({ ...form, es_principal: e.target.checked })} />
                    Establecer como dirección principal
                  </label>
                </div>
              </div>

              <div className="pf-modal-footer">
                <button className="pf-btn-cancel" onClick={closeModal}>Cancelar</button>
                <motion.button whileTap={{ scale: 0.97 }} className="pf-btn-save" onClick={handleSave}>
                  {modal.type === "add" ? "Agregar dirección" : "Guardar cambios"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {modal?.type === "editProfile" && (
          <motion.div className="pf-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal}>
            <motion.div
              className="pf-modal"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.28 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="pf-modal-head">
                <h3 className="pf-modal-title">Editar <em>información</em></h3>
                <button className="pf-modal-close" onClick={closeModal}>✕</button>
              </div>

              <div className="pf-form-grid">
                <div className="pf-field pf-form-full">
                  <label>Nombre completo</label>
                  <input 
                    placeholder="Tu nombre" 
                    value={profileForm.nombre} 
                    onChange={e => setProfileForm({ ...profileForm, nombre: e.target.value })} 
                  />
                </div>
                <div className="pf-field pf-form-full">
                  <label>Correo electrónico</label>
                  <input 
                    type="email"
                    placeholder="tu@email.com" 
                    value={profileForm.email} 
                    onChange={e => setProfileForm({ ...profileForm, email: e.target.value })} 
                  />
                </div>
              </div>

              <div className="pf-modal-footer">
                <button className="pf-btn-cancel" onClick={closeModal}>Cancelar</button>
                <motion.button whileTap={{ scale: 0.97 }} className="pf-btn-save" onClick={handleSaveProfile}>
                  <IconSave /> Guardar cambios
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {modal?.type === "delete" && (
          <motion.div className="pf-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal}>
            <motion.div
              className="pf-modal"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.28 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="pf-confirm-body">
                <div className="pf-confirm-icon">🗑️</div>
                <h3>¿Eliminar dirección?</h3>
                <p>Se eliminará <strong>{modal.data.etiqueta}</strong> — {modal.data.calle}. Esta acción no se puede deshacer.</p>
              </div>
              <div className="pf-modal-footer">
                <button className="pf-btn-cancel" onClick={closeModal}>Cancelar</button>
                <motion.button whileTap={{ scale: 0.97 }} className="pf-btn-danger" onClick={handleDelete}>
                  Sí, eliminar
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            className="pf-toast"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}