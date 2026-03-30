/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../Api/axios";
import "./AdminPedidos.css";

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("todos");
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    cargarPedidos();
  }, []);

  const cargarPedidos = async () => {
    try {
      setLoading(true);
      const response = await api.get("/pedidos");
      setPedidos(response.data);
    } catch (error) {
      console.error("Error al cargar pedidos:", error);
      showToast("Error al cargar pedidos");
    } finally {
      setLoading(false);
    }
  };

  const actualizarEstado = async (id, nuevoEstado) => {
    try {
      await api.put(`/pedidos/${id}/estado`, { estado: nuevoEstado });
      showToast(`Pedido actualizado a ${nuevoEstado}`);
      cargarPedidos();
    } catch (error) {
      console.error("Error al actualizar pedido:", error);
      showToast("Error al actualizar pedido");
    }
  };

  const getEstadoColor = (estado) => {
    const colores = {
      pendiente: "#f39c12",
      confirmado: "#3498db",
      preparando: "#9b59b6",
      enviado: "#1abc9c",
      entregado: "#27ae60",
      cancelado: "#e74c3c"
    };
    return colores[estado] || "#95a5a6";
  };

  const pedidosFiltrados = filter === "todos" 
    ? pedidos 
    : pedidos.filter(p => p.estado === filter);

  return (
    <div className="admin-pedidos-container">
      <div className="admin-header">
        <h1>Gestión de Pedidos</h1>
      </div>

      <div className="filtros">
        <button className={filter === "todos" ? "active" : ""} onClick={() => setFilter("todos")}>
          Todos
        </button>
        <button className={filter === "pendiente" ? "active" : ""} onClick={() => setFilter("pendiente")}>
          Pendientes
        </button>
        <button className={filter === "confirmado" ? "active" : ""} onClick={() => setFilter("confirmado")}>
          Confirmados
        </button>
        <button className={filter === "preparando" ? "active" : ""} onClick={() => setFilter("preparando")}>
          Preparando
        </button>
        <button className={filter === "enviado" ? "active" : ""} onClick={() => setFilter("enviado")}>
          Enviados
        </button>
        <button className={filter === "entregado" ? "active" : ""} onClick={() => setFilter("entregado")}>
          Entregados
        </button>
        <button className={filter === "cancelado" ? "active" : ""} onClick={() => setFilter("cancelado")}>
          Cancelados
        </button>
      </div>

      {loading ? (
        <div className="loading-spinner">Cargando pedidos...</div>
      ) : (
        <div className="pedidos-list">
          {pedidosFiltrados.length === 0 ? (
            <div className="empty-state">No hay pedidos en esta categoría</div>
          ) : (
            pedidosFiltrados.map((pedido) => (
              <motion.div
                key={pedido._id}
                className="pedido-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="pedido-header">
                  <div>
                    <h3>Pedido #{pedido._id.slice(-6)}</h3>
                    <p className="fecha">{new Date(pedido.fecha).toLocaleDateString()}</p>
                  </div>
                  <div className="estado" style={{ backgroundColor: getEstadoColor(pedido.estado) }}>
                    {pedido.estado.toUpperCase()}
                  </div>
                </div>

                <div className="pedido-info">
                  <p><strong>Cliente:</strong> {pedido.cliente?.nombre || "Cliente"}</p>
                  <p><strong>Email:</strong> {pedido.cliente?.email || "N/A"}</p>
                  <p><strong>Total:</strong> ${pedido.total}</p>
                </div>

                <div className="pedido-productos">
                  <strong>Productos:</strong>
                  {pedido.productos?.map((item, idx) => (
                    <div key={idx} className="producto-item">
                      {item.cantidad}x {item.producto?.nombre || "Producto"}
                    </div>
                  ))}
                </div>

                <div className="pedido-actions">
                  <select 
                    value={pedido.estado}
                    onChange={(e) => actualizarEstado(pedido._id, e.target.value)}
                    className="estado-select"
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="confirmado">Confirmado</option>
                    <option value="preparando">Preparando</option>
                    <option value="enviado">Enviado</option>
                    <option value="entregado">Entregado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}