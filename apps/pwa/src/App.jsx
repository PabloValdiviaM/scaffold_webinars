import React, { useState, useEffect } from 'react';

const MENU_ITEMS = [
  {
    id: 'rey-parrilla',
    name: 'Rey de las hamburguesas a la parrilla',
    category: 'parrilla',
    categoryName: 'A la Parrilla',
    level: 'Master Grill ⭐⭐⭐',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80',
    desc: 'Carne Angus flameada a la leña, cheddar inglés, cebolla caramelizada y salsa BBQ secreta.'
  },
  {
    id: 'hamburguesa-real',
    name: 'Hamburguesa Real',
    category: 'parrilla',
    categoryName: 'A la Parrilla',
    level: 'Clásico Imperial ⭐⭐',
    price: 11.50,
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500&auto=format&fit=crop&q=80',
    desc: 'Doble carne smash jugosa, doble queso americano fundido y salsa Real secreta.'
  },
  {
    id: 'royal-crispy',
    name: 'Hamburguesa Royal Crispy',
    category: 'crispy',
    categoryName: 'Pollo Crispy',
    level: 'Crujiente Extremo ⭐⭐',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=500&auto=format&fit=crop&q=80',
    desc: 'Pechuga marinada en buttermilk 24h, ensalada coleslaw de manzana y miel mostaza.'
  },
  {
    id: 'double-whopper',
    name: 'HamburguesaDouble Whopper',
    category: 'gigantes',
    categoryName: 'Gigantes XXL',
    level: 'Doble Fuego XXL ⭐⭐⭐',
    price: 15.50,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&auto=format&fit=crop&q=80',
    desc: 'Doble medallón gigante al carbón, lechuga romana, tomate y salsa tártara ahumada.'
  },
  {
    id: 'papas-rusticas',
    name: 'Papas Rústicas al Romero',
    category: 'extras',
    categoryName: 'Acompañamientos',
    level: 'Complemento Gold',
    price: 3.99,
    image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=500&auto=format&fit=crop&q=80',
    desc: 'Papas cortadas a mano con piel, sal marina gruesa, romero fresco y dip de ajo asado.'
  },
  {
    id: 'gaseosa-artesanal',
    name: 'Limonada de Frutos Rojos',
    category: 'extras',
    categoryName: 'Bebidas',
    level: 'Refresco Gourmet',
    price: 2.99,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=80',
    desc: 'Limonada natural con infusión de frambuesas, moras y menta fresca.'
  }
];

const PROMOTIONS = [
  {
    code: 'RAPIDPARRILLA',
    title: '🔥 20% OFF en Parrilla',
    discountPercent: 20,
    desc: 'Aplica en todo tu pedido si incluye al menos una hamburguesa a la leña.',
    minSpend: 15
  },
  {
    code: 'BURGERFEST',
    title: '🍔 Cupón Fuego $5 OFF',
    discountFixed: 5.0,
    desc: 'Descuento directo de $5.00 en pedidos superiores a $20.',
    minSpend: 20
  },
  {
    code: 'ENVIOGRATIS',
    title: '🛵 Delivery Sin Costo',
    freeShipping: true,
    desc: 'Costo de envío $0.00 en cualquier pedido de la app.',
    minSpend: 10
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('menu'); // 'menu' | 'deals' | 'orders' | 'profile'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [orderSuccessMsg, setOrderSuccessMsg] = useState(null);

  // Lista de órdenes simuladas
  const [orders, setOrders] = useState([
    {
      id: 'NCR-9182',
      date: 'Hoy, hace 25 min',
      items: [
        { name: 'Rey de las hamburguesas a la parrilla', qty: 1, price: 14.99 },
        { name: 'Papas Rústicas al Romero', qty: 1, price: 3.99 }
      ],
      total: 18.98,
      status: 'En camino 🛵',
      step: 3
    }
  ]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const handleInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleInstallPrompt);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert('Para instalar la PWA: Abre el menú de tu navegador y pulsa "Instalar aplicación" o "Agregar a pantalla de inicio".');
      return;
    }
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      discount = (subtotal * appliedCoupon.discountPercent) / 100;
    } else if (appliedCoupon.discountFixed) {
      discount = Math.min(appliedCoupon.discountFixed, subtotal);
    }
  }

  const shipping = subtotal > 0 ? (appliedCoupon?.freeShipping ? 0 : 2.5) : 0;
  const grandTotal = Math.max(0, subtotal - discount + shipping);
  const totalCartCount = cart.reduce((acc, item) => acc + item.qty, 0);

  const handleApplyCoupon = (coupon) => {
    if (subtotal < coupon.minSpend) {
      alert(`Este cupón requiere un consumo mínimo de $${coupon.minSpend.toFixed(2)}.`);
      return;
    }
    setAppliedCoupon(coupon);
    alert(`¡Cupón "${coupon.code}" aplicado con éxito!`);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;

    const newOrder = {
      id: `NCR-${Math.floor(1000 + Math.random() * 9000)}`,
      date: 'Justo ahora',
      items: [...cart],
      total: grandTotal,
      status: 'En la parrilla 🔥',
      step: 2
    };

    setOrders([newOrder, ...orders]);
    setCart([]);
    setAppliedCoupon(null);
    setIsCartOpen(false);
    setActiveTab('orders');
    setOrderSuccessMsg(`¡Orden #${newOrder.id} recibida! El chef ya la tiene en la parrilla.`);
    setTimeout(() => setOrderSuccessMsg(null), 5000);
  };

  const filteredItems =
    selectedCategory === 'all'
      ? MENU_ITEMS
      : MENU_ITEMS.filter((item) => item.category === selectedCategory);

  return (
    <div style={{
      maxWidth: '480px',
      margin: '0 auto',
      minHeight: '100vh',
      background: '#090d16',
      color: '#f8fafc',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      boxShadow: '0 0 50px rgba(0,0,0,0.8)'
    }}>
      {/* Top Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        background: 'rgba(9, 13, 22, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #1e293b',
        padding: '14px 18px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.4rem' }}>🍔</span>
          <div>
            <div style={{ fontWeight: '800', fontSize: '1.05rem', lineHeight: '1.2' }}>
              NextCollege <span style={{ color: '#f59e0b' }}>Rapid</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>PWA Mobile &bull; Delivery Express</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: '0.7rem',
            padding: '4px 8px',
            borderRadius: '9999px',
            fontWeight: '700',
            background: isOnline ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            color: isOnline ? '#10b981' : '#ef4444'
          }}>
            {isOnline ? '🟢 Online' : '🔴 Offline'}
          </span>

          <button
            onClick={() => setIsCartOpen(true)}
            style={{
              position: 'relative',
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '50%',
              width: '38px',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'white'
            }}
          >
            🛒
            {totalCartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: '#ef4444',
                color: 'white',
                fontSize: '0.65rem',
                fontWeight: '800',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {totalCartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Success Notification Banner */}
      {orderSuccessMsg && (
        <div style={{
          background: 'linear-gradient(90deg, #10b981, #059669)',
          color: 'white',
          padding: '10px 16px',
          fontSize: '0.85rem',
          fontWeight: '700',
          textAlign: 'center',
          animation: 'fadeIn 0.3s ease'
        }}>
          {orderSuccessMsg}
        </div>
      )}

      {/* Main Tab Content */}
      <main style={{ flex: 1, padding: '16px', paddingBottom: '90px', overflowY: 'auto' }}>
        
        {/* ==================== TAB: MENÚ ==================== */}
        {activeTab === 'menu' && (
          <div>
            {/* Banner Saludo */}
            <div style={{
              background: 'linear-gradient(135deg, #1e293b 0%, #131b2e 100%)',
              border: '1px solid #334155',
              borderRadius: '16px',
              padding: '16px',
              marginBottom: '16px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ color: '#f59e0b', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase' }}>
                  Fuego Vivo &bull; 100% Angus
                </div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginTop: '2px', marginBottom: '4px' }}>
                  ¿Qué se te antoja hoy?
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '0.82rem' }}>
                  Asadas a la leña de roble al momento de tu orden.
                </p>
              </div>
            </div>

            {/* Categorías */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '8px' }}>
              {[
                { id: 'all', label: '🔥 Todas' },
                { id: 'parrilla', label: '🥩 A la Parrilla' },
                { id: 'crispy', label: '🍗 Pollo Crispy' },
                { id: 'gigantes', label: '👑 Gigantes XXL' },
                { id: 'extras', label: '🍟 Extras' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    whiteSpace: 'nowrap',
                    padding: '8px 14px',
                    borderRadius: '9999px',
                    border: selectedCategory === cat.id ? '1px solid #f59e0b' : '1px solid #1e293b',
                    background: selectedCategory === cat.id ? '#f59e0b' : '#131b2e',
                    color: selectedCategory === cat.id ? '#090d16' : '#cbd5e1',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Grid de Productos */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: '#131b2e',
                    border: '1px solid #1e293b',
                    borderRadius: '16px',
                    padding: '12px',
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'center'
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: '90px',
                      height: '90px',
                      borderRadius: '12px',
                      objectFit: 'cover'
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.68rem', color: '#f59e0b', fontWeight: '800' }}>
                      {item.level}
                    </div>
                    <div style={{ fontWeight: '800', fontSize: '0.98rem', color: 'white', lineHeight: '1.25', margin: '2px 0 4px' }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: '1.3', marginBottom: '8px' }}>
                      {item.desc}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '1.15rem', fontWeight: '900', color: '#f59e0b' }}>
                        ${item.price.toFixed(2)}
                      </span>
                      <button
                        onClick={() => addToCart(item)}
                        style={{
                          background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                          color: 'white',
                          border: 'none',
                          padding: '6px 14px',
                          borderRadius: '8px',
                          fontWeight: '700',
                          fontSize: '0.8rem',
                          cursor: 'pointer'
                        }}
                      >
                        + Agregar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB: OFERTAS ==================== */}
        {activeTab === 'deals' && (
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '6px' }}>
              Promociones & Cupones Fuego 🔥
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.82rem', marginBottom: '16px' }}>
              Aplica estos códigos al simular tu pedido para descuentos instantáneos.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {PROMOTIONS.map((promo) => (
                <div
                  key={promo.code}
                  style={{
                    background: '#131b2e',
                    border: '1px dashed #f59e0b',
                    borderRadius: '16px',
                    padding: '16px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div style={{ fontSize: '1.05rem', fontWeight: '800', color: 'white' }}>
                      {promo.title}
                    </div>
                    <span style={{
                      background: 'rgba(245, 158, 11, 0.15)',
                      color: '#f59e0b',
                      fontWeight: '800',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '0.75rem'
                    }}>
                      {promo.code}
                    </span>
                  </div>

                  <p style={{ color: '#94a3b8', fontSize: '0.82rem', marginBottom: '14px', lineHeight: '1.4' }}>
                    {promo.desc}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      Min. consumo: ${promo.minSpend.toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleApplyCoupon(promo)}
                      style={{
                        background: appliedCoupon?.code === promo.code ? '#10b981' : '#1e293b',
                        border: '1px solid #334155',
                        color: 'white',
                        padding: '6px 14px',
                        borderRadius: '8px',
                        fontSize: '0.78rem',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      {appliedCoupon?.code === promo.code ? '✓ Aplicado' : 'Usar Cupón'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Banner 2x1 */}
            <div style={{
              marginTop: '20px',
              background: 'linear-gradient(135deg, #b45309, #7f1d1d)',
              borderRadius: '16px',
              padding: '18px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '6px' }}>👑</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'white' }}>
                ¡Jueves de Doble Corona!
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#fed7aa', margin: '6px 0 12px' }}>
                Compra un "Rey de las hamburguesas a la parrilla" y llévate unas Papas Rústicas gratis.
              </p>
              <button
                onClick={() => {
                  addToCart(MENU_ITEMS[0]);
                  addToCart(MENU_ITEMS[4]);
                  setIsCartOpen(true);
                }}
                style={{
                  background: 'white',
                  color: '#b45309',
                  border: 'none',
                  padding: '8px 18px',
                  borderRadius: '9999px',
                  fontWeight: '800',
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                Agregar Combo al Carrito &rarr;
              </button>
            </div>
          </div>
        )}

        {/* ==================== TAB: ORDENES ==================== */}
        {activeTab === 'orders' && (
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '6px' }}>
              Seguimiento de Órdenes 📦
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.82rem', marginBottom: '16px' }}>
              Monitorea el fuego de la parrilla y el trayecto del repartidor.
            </p>

            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 16px', background: '#131b2e', borderRadius: '16px' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🍽️</div>
                <div style={{ fontWeight: '700', fontSize: '1rem', marginBottom: '6px' }}>No tienes órdenes activas</div>
                <p style={{ color: '#94a3b8', fontSize: '0.82rem', marginBottom: '16px' }}>
                  Explora nuestro menú y simula tu primer pedido parrillero.
                </p>
                <button
                  onClick={() => setActiveTab('menu')}
                  style={{
                    background: '#f59e0b',
                    color: '#090d16',
                    border: 'none',
                    padding: '8px 20px',
                    borderRadius: '8px',
                    fontWeight: '800',
                    cursor: 'pointer'
                  }}
                >
                  Ir al Menú
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    style={{
                      background: '#131b2e',
                      border: '1px solid #1e293b',
                      borderRadius: '16px',
                      padding: '16px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div>
                        <div style={{ fontWeight: '800', fontSize: '1rem', color: 'white' }}>
                          Orden #{ord.id}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{ord.date}</div>
                      </div>
                      <span style={{
                        background: 'rgba(245, 158, 11, 0.15)',
                        color: '#f59e0b',
                        fontWeight: '800',
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        fontSize: '0.75rem'
                      }}>
                        {ord.status}
                      </span>
                    </div>

                    {/* Barra de progreso de la orden */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: '#090d16',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      marginBottom: '14px',
                      fontSize: '0.72rem',
                      fontWeight: '700'
                    }}>
                      <div style={{ color: ord.step >= 1 ? '#10b981' : '#64748b' }}>✓ Recibido</div>
                      <div style={{ color: '#475569' }}>&bull;</div>
                      <div style={{ color: ord.step >= 2 ? '#f59e0b' : '#64748b' }}>🔥 Parrilla</div>
                      <div style={{ color: '#475569' }}>&bull;</div>
                      <div style={{ color: ord.step >= 3 ? '#38bdf8' : '#64748b' }}>🛵 En camino</div>
                      <div style={{ color: '#475569' }}>&bull;</div>
                      <div style={{ color: ord.step >= 4 ? '#10b981' : '#64748b' }}>🍽️ Entregado</div>
                    </div>

                    {/* Resumen de items */}
                    <div style={{ borderTop: '1px solid #1e293b', paddingTop: '10px', marginBottom: '12px' }}>
                      {ord.items.map((it, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '4px' }}>
                          <span>{it.qty}x {it.name}</span>
                          <span>${(it.price * it.qty).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #1e293b', paddingTop: '10px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>Total Pagado</span>
                      <span style={{ fontSize: '1.15rem', fontWeight: '900', color: '#f59e0b' }}>
                        ${ord.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB: PERFIL ==================== */}
        {activeTab === 'profile' && (
          <div>
            {/* Header del Perfil */}
            <div style={{
              background: '#131b2e',
              border: '1px solid #1e293b',
              borderRadius: '16px',
              padding: '20px',
              textAlign: 'center',
              marginBottom: '16px'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem',
                margin: '0 auto 10px',
                color: 'white',
                fontWeight: '800'
              }}>
                PV
              </div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'white' }}>Pablo Valdivia</h2>
              <div style={{ fontSize: '0.78rem', color: '#f59e0b', fontWeight: '700', marginTop: '2px' }}>
                👑 Miembro Master Grill VIP
              </div>
            </div>

            {/* Puntos y Fidelidad */}
            <div style={{
              background: 'linear-gradient(135deg, #1e293b, #0f172a)',
              border: '1px solid #334155',
              borderRadius: '16px',
              padding: '16px',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '700' }}>NEXTRAPID POINTS</span>
                <span style={{ fontSize: '1.25rem', fontWeight: '900', color: '#f59e0b' }}>1,450 pts</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: '1.4' }}>
                Estás a solo 50 puntos de canjear una <strong>"Hamburguesa Real"</strong> totalmente gratis.
              </p>
              <div style={{ background: '#090d16', height: '6px', borderRadius: '4px', marginTop: '10px', overflow: 'hidden' }}>
                <div style={{ background: '#f59e0b', width: '96%', height: '100%' }}></div>
              </div>
            </div>

            {/* Ajustes y Opciones */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              <div style={{ background: '#131b2e', border: '1px solid #1e293b', borderRadius: '12px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.85rem' }}>📍 Dirección Guardada</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Av. Principal 1024, Lima</div>
                </div>
                <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: '600' }}>Editar</span>
              </div>

              {deferredPrompt && (
                <button
                  onClick={handleInstallClick}
                  style={{
                    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '14px',
                    fontWeight: '700',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  📲 Instalar PWA en Pantalla de Inicio
                </button>
              )}
            </div>

            {/* Accesos Rápidos */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <a
                href="/"
                style={{
                  flex: 1,
                  background: '#1e293b',
                  color: 'white',
                  textDecoration: 'none',
                  padding: '12px',
                  borderRadius: '10px',
                  textAlign: 'center',
                  fontSize: '0.82rem',
                  fontWeight: '700',
                  border: '1px solid #334155'
                }}
              >
                🌐 Web E-commerce
              </a>
              <a
                href="/admin"
                style={{
                  flex: 1,
                  background: '#1e293b',
                  color: 'white',
                  textDecoration: 'none',
                  padding: '12px',
                  borderRadius: '10px',
                  textAlign: 'center',
                  fontSize: '0.82rem',
                  fontWeight: '700',
                  border: '1px solid #334155'
                }}
              >
                ⚙️ Panel Admin
              </a>
            </div>
          </div>
        )}
      </main>

      {/* Floating Cart Button (visible on Menu if items exist) */}
      {activeTab === 'menu' && totalCartCount > 0 && !isCartOpen && (
        <div style={{
          position: 'fixed',
          bottom: '75px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 32px)',
          maxWidth: '448px',
          zIndex: 45
        }}>
          <button
            onClick={() => setIsCartOpen(true)}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
              color: 'white',
              border: 'none',
              borderRadius: '14px',
              padding: '14px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontWeight: '800',
              fontSize: '0.95rem',
              boxShadow: '0 10px 25px rgba(239, 68, 68, 0.45)',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>🛒</span>
              <span>Ver Carrito ({totalCartCount})</span>
            </div>
            <span>${subtotal.toFixed(2)} &rarr;</span>
          </button>
        </div>
      )}

      {/* Cart Modal / Drawer */}
      {isCartOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(6px)',
          zIndex: 60,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center'
        }}>
          <div style={{
            background: '#111827',
            borderTop: '1px solid #1f2937',
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
            width: '100%',
            maxWidth: '480px',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            padding: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'white' }}>
                Tu Pedido Parrillero 🛒
              </h3>
              <button
                onClick={() => setIsCartOpen(false)}
                style={{
                  background: '#1f2937',
                  border: 'none',
                  color: '#94a3b8',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  cursor: 'pointer'
                }}
              >
                &times;
              </button>
            </div>

            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 0', color: '#94a3b8' }}>
                Tu carrito está vacío. ¡Elige una hamburguesa del menú!
              </div>
            ) : (
              <>
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: '#172033',
                        padding: '10px 14px',
                        borderRadius: '12px'
                      }}
                    >
                      <div style={{ flex: 1, marginRight: '10px' }}>
                        <div style={{ fontWeight: '700', fontSize: '0.88rem', color: 'white' }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#f59e0b' }}>
                          ${item.price.toFixed(2)} c/u
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          style={{
                            background: '#1e293b',
                            border: '1px solid #334155',
                            color: 'white',
                            width: '26px',
                            height: '26px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                          }}
                        >
                          -
                        </button>
                        <span style={{ fontWeight: '700', fontSize: '0.9rem', minWidth: '18px', textAlign: 'center' }}>
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          style={{
                            background: '#1e293b',
                            border: '1px solid #334155',
                            color: 'white',
                            width: '26px',
                            height: '26px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cupón activo */}
                {appliedCoupon && (
                  <div style={{
                    background: 'rgba(245, 158, 11, 0.1)',
                    border: '1px dashed #f59e0b',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '0.75rem',
                    color: '#f59e0b',
                    marginBottom: '14px',
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}>
                    <span>Cupón: {appliedCoupon.code}</span>
                    <button
                      onClick={() => setAppliedCoupon(null)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      Quitar
                    </button>
                  </div>
                )}

                {/* Totales */}
                <div style={{ borderTop: '1px solid #1f2937', paddingTop: '12px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '4px' }}>
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#10b981', marginBottom: '4px' }}>
                      <span>Descuento:</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '4px' }}>
                    <span>Envío Express:</span>
                    <span>{shipping === 0 ? 'GRATIS' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: '900', color: 'white', marginTop: '8px' }}>
                    <span>Total a Pagar:</span>
                    <span style={{ color: '#f59e0b' }}>${grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    border: 'none',
                    padding: '14px',
                    borderRadius: '12px',
                    fontWeight: '800',
                    fontSize: '1rem',
                    cursor: 'pointer'
                  }}
                >
                  Confirmar Pedido 🚀
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Bottom Navigation Bar */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '480px',
        background: '#090d16',
        borderTop: '1px solid #1e293b',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '10px 0',
        zIndex: 50
      }}>
        {[
          { id: 'menu', label: 'Menú', icon: '🍔' },
          { id: 'deals', label: 'Ofertas', icon: '🏷️' },
          { id: 'orders', label: 'Ordenes', icon: '📦', badge: orders.length },
          { id: 'profile', label: 'Perfil', icon: '👤' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: 'none',
              border: 'none',
              color: activeTab === tab.id ? '#f59e0b' : '#94a3b8',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.75rem',
              fontWeight: '700',
              cursor: 'pointer',
              position: 'relative'
            }}
          >
            <span style={{ fontSize: '1.25rem' }}>{tab.icon}</span>
            <span>{tab.label}</span>
            {tab.badge && tab.badge > 0 ? (
              <span style={{
                position: 'absolute',
                top: '-2px',
                right: '4px',
                background: '#f59e0b',
                color: '#090d16',
                fontSize: '0.62rem',
                fontWeight: '900',
                padding: '2px 5px',
                borderRadius: '9999px'
              }}>
                {tab.badge}
              </span>
            ) : null}
          </button>
        ))}
      </nav>
    </div>
  );
}
