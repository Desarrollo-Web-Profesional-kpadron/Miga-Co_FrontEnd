import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';
import api from '../Api/axios';
import './Carrito.css';

export default function Carrito() {
  const { carrito, loading, error, actualizarCantidad, eliminarItem, vaciarCarrito } = useCarrito();
  const [validando, setValidando] = useState(false);
  const [validacion, setValidacion] = useState(null);
  const [creandoPedido, setCreandoPedido] = useState(false);
  const [pedidoExitoso, setPedidoExitoso] = useState(null);
  const navigate = useNavigate();

  const items = carrito?.items || [];
  const subtotal = carrito?.subtotal || 0;

  const handleValidar = async () => {
    try {
      setValidando(true);
      setValidacion(null);
      const res = await api.get('/carrito/validar');
      setValidacion(res.data);
    } catch (err) {
      setValidacion({ valido: false, error: err.response?.data?.message || 'Error al validar' });
    } finally {
      setValidando(false);
    }
  };

  const handleCrearPedido = async () => {
    try {
      setCreandoPedido(true);
      const itemsParaPedido = items.map((item) => ({
        producto_id: item.producto_id._id,
        cantidad: item.cantidad,
        precio_unitario: item.personalizacion_id?.costos?.total ?? item.precio_unitario,
        personalizacion: item.personalizacion_id
          ? {
              mensaje: item.personalizacion_id.opciones?.mensaje || '',
              relleno: item.personalizacion_id.opciones?.rellenos?.join(', ') || '',
            }
          : {},
      }));

      const res = await api.post('/pedidos', {
        items: itemsParaPedido,
        logistica: { metodo_envio: 'domicilio' },
        pago: { metodo: 'pendiente', estado: 'pendiente' },
      });

      await vaciarCarrito();
      setPedidoExitoso(res.data);
    } catch (err) {
      setValidacion({ valido: false, error: err.response?.data?.message || 'Error al crear el pedido' });
    } finally {
      setCreandoPedido(false);
    }
  };

  if (pedidoExitoso) {
    return (
      <div className="carrito-container">
        <div className="pedido-exitoso">
          <div className="pedido-icono">✅</div>
          <h2>¡Pedido creado con éxito!</h2>
          <p>Tu pedido ha sido registrado y está en proceso.</p>
          <p className="pedido-id">ID: {pedidoExitoso._id}</p>
          <div className="pedido-exitoso-actions">
            <button className="btn-ver-perfil" onClick={() => navigate('/perfil')}>
              Ver mis pedidos
            </button>
            <button className="btn-seguir" onClick={() => navigate('/productos')}>
              Seguir comprando
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading && !carrito) {
    return (
      <div className="carrito-container">
        <div className="carrito-loading">Cargando carrito...</div>
      </div>
    );
  }

  return (
    <div className="carrito-container">
      <h1 className="carrito-titulo">Mi Carrito</h1>

      {error && <div className="carrito-error">{error}</div>}

      {items.length === 0 ? (
        <div className="carrito-vacio">
          <div className="carrito-vacio-icono">🛒</div>
          <h3>Tu carrito está vacío</h3>
          <p>Agrega productos desde el catálogo para comenzar.</p>
          <button className="btn-ir-catalogo" onClick={() => navigate('/productos')}>
            Ir al catálogo
          </button>
        </div>
      ) : (
        <div className="carrito-contenido">
          <div className="carrito-items">
            {items.map((item) => {
              const producto = item.producto_id;
              const pers = item.personalizacion_id;
              const precioItem = pers?.costos?.total ?? item.precio_unitario;

              return (
                <div key={item._id} className="carrito-item">
                  <img
                    src={
                      producto?.multimedia?.fotos_exterior?.[0] ||
                      'https://via.placeholder.com/80?text=Producto'
                    }
                    alt={producto?.nombre}
                    className="item-imagen"
                  />

                  <div className="item-info">
                    <h4 className="item-nombre">{producto?.nombre}</h4>
                    <p className="item-precio-unit">
                      ${item.precio_unitario?.toLocaleString()} c/u
                    </p>

                    {pers && (
                      <div className="item-personalizacion">
                        {pers.opciones?.rellenos?.length > 0 && (
                          <span>Relleno: {pers.opciones.rellenos.join(', ')}</span>
                        )}
                        {pers.opciones?.coberturas?.length > 0 && (
                          <span>Cobertura: {pers.opciones.coberturas.join(', ')}</span>
                        )}
                        {pers.opciones?.mensaje && (
                          <span>Mensaje: "{pers.opciones.mensaje}"</span>
                        )}
                        <span className="item-extra">
                          +${(precioItem - item.precio_unitario).toLocaleString()} extras
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="item-controles">
                    <div className="cantidad-controles">
                      <button
                        className="btn-cantidad"
                        onClick={() => actualizarCantidad(item._id, item.cantidad - 1)}
                        disabled={item.cantidad <= 1}
                      >
                        −
                      </button>
                      <span className="cantidad-valor">{item.cantidad}</span>
                      <button
                        className="btn-cantidad"
                        onClick={() => actualizarCantidad(item._id, item.cantidad + 1)}
                      >
                        +
                      </button>
                    </div>

                    <p className="item-subtotal">
                      ${(precioItem * item.cantidad).toLocaleString()}
                    </p>

                    <button
                      className="btn-eliminar"
                      onClick={() => eliminarItem(item._id)}
                      title="Eliminar producto"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="carrito-resumen">
            <h3>Resumen del pedido</h3>

            <div className="resumen-linea">
              <span>Productos ({items.reduce((a, i) => a + i.cantidad, 0)})</span>
              <span>${subtotal.toLocaleString()}</span>
            </div>
            <div className="resumen-linea resumen-total">
              <strong>Total</strong>
              <strong>${subtotal.toLocaleString()}</strong>
            </div>

            {validacion && (
              <div className={`validacion-resultado ${validacion.valido ? 'ok' : 'error'}`}>
                {validacion.valido ? (
                  <p>✅ Todos los productos están disponibles</p>
                ) : (
                  <>
                    <p>⚠️ Algunos productos no tienen stock suficiente:</p>
                    {validacion.items
                      ?.filter((i) => !i.disponible)
                      .map((i) => (
                        <p key={i.item_id} className="validacion-item-error">
                          {i.nombre}: pediste {i.cantidad_pedida}, disponible {i.stock_disponible}
                        </p>
                      ))}
                    {validacion.error && <p>{validacion.error}</p>}
                  </>
                )}
              </div>
            )}

            <div className="resumen-acciones">
              <button
                className="btn-validar"
                onClick={handleValidar}
                disabled={validando}
              >
                {validando ? 'Validando...' : 'Verificar disponibilidad'}
              </button>

              <button
                className="btn-pedir"
                onClick={handleCrearPedido}
                disabled={creandoPedido || (validacion && !validacion.valido)}
              >
                {creandoPedido ? 'Procesando...' : 'Realizar pedido'}
              </button>

              <button className="btn-vaciar" onClick={vaciarCarrito}>
                Vaciar carrito
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
