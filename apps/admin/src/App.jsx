import React, { useState, useEffect } from 'react';

const INITIAL_BURGERS = [
  {
    id: 1,
    name: 'Rey de las hamburguesas a la parrilla',
    category: 'A la Parrilla',
    level: 'Master Grill ⭐⭐⭐',
    price: 14.99,
    stock: 45,
    salesThisMonth: 642,
    status: 'Alta Demanda 🔥'
  },
  {
    id: 2,
    name: 'Hamburguesa Real',
    category: 'A la Parrilla',
    level: 'Clásico Imperial ⭐⭐',
    price: 11.50,
    stock: 60,
    salesThisMonth: 518,
    status: 'Disponible ✅'
  },
  {
    id: 3,
    name: 'Hamburguesa Royal Crispy',
    category: 'Pollo Crispy',
    level: 'Crujiente Extremo ⭐⭐',
    price: 12.99,
    stock: 35,
    salesThisMonth: 412,
    status: 'Disponible ✅'
  },
  {
    id: 4,
    name: 'HamburguesaDouble Whopper',
    category: 'Gigantes XXL',
    level: 'Doble Fuego XXL ⭐⭐⭐',
    price: 15.50,
    stock: 18,
    salesThisMonth: 322,
    status: 'Pocas Unidades ⚠️'
  }
];

export default function App() {
  const [dbHealth, setDbHealth] = useState(null);
  const [burgers, setBurgers] = useState(INITIAL_BURGERS);
  const [searchFilter, setSearchFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'consumers' | 'system'
  
  // Formulario nueva hamburguesa
  const [newBurger, setNewBurger] = useState({
    name: '',
    category: 'A la Parrilla',
    level: 'Master Grill ⭐⭐⭐',
    price: '',
    stock: 30
  });

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setDbHealth(data))
      .catch((err) => console.error('Error consultando /api/health:', err));
  }, []);

  const handleSimulateSale = (id) => {
    setBurgers((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          const nextStock = Math.max(0, b.stock - 1);
          return {
            ...b,
            stock: nextStock,
            salesThisMonth: b.salesThisMonth + 1,
            status: nextStock === 0 ? 'Agotado ❌' : nextStock < 20 ? 'Pocas Unidades ⚠️' : b.status
          };
        }
        return b;
      })
    );
  };

  const handleRestock = (id) => {
    setBurgers((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          const nextStock = b.stock + 20;
          return {
            ...b,
            stock: nextStock,
            status: 'Disponible ✅'
          };
        }
        return b;
      })
    );
  };

  const handleAddBurger = (e) => {
    e.preventDefault();
    if (!newBurger.name || !newBurger.price) return;

    const item = {
      id: Date.now(),
      name: newBurger.name,
      category: newBurger.category,
      level: newBurger.level,
      price: parseFloat(newBurger.price),
      stock: parseInt(newBurger.stock, 10) || 30,
      salesThisMonth: 0,
      status: 'Disponible ✅'
    };

    setBurgers([item, ...burgers]);
    setNewBurger({ name: '', category: 'A la Parrilla', level: 'Master Grill ⭐⭐⭐', price: '', stock: 30 });
    setIsModalOpen(false);
  };

  const filteredBurgers = burgers.filter(
    (b) =>
      b.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      b.category.toLowerCase().includes(searchFilter.toLowerCase()) ||
      b.level.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const totalRevenue = burgers.reduce((acc, b) => acc + b.price * b.salesThisMonth, 0);
  const totalSalesUnits = burgers.reduce((acc, b) => acc + b.salesThisMonth, 0);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#090d16',
      color: '#f8fafc',
      fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
      padding: '24px 32px'
    }}>
      {/* Top Navbar */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '20px',
        borderBottom: '1px solid #1e293b',
        marginBottom: '28px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.4rem'
          }}>
            🍔
          </div>
          <div>
            <div style={{ fontSize: '1.35rem', fontWeight: '800', lineHeight: '1.2' }}>
              NextCollege <span style={{ color: '#f59e0b' }}>Rapid</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Panel de Administración &bull; Métricas de Consumo
            </div>
          </div>
        </div>

        {/* Status de Base de Datos */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <div style={{
            background: '#131b2e',
            border: '1px solid #1e293b',
            borderRadius: '12px',
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <div style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: dbHealth?.database?.connected ? '#10b981' : '#f59e0b',
              boxShadow: dbHealth?.database?.connected ? '0 0 10px #10b981' : '0 0 10px #f59e0b'
            }} />
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '700' }}>
                BASE DE DATOS
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: '800', color: 'white' }}>
                {dbHealth?.database?.mode === 'mysql' ? '🐬 MySQL Activo (Dokploy)' : '⚡ In-Memory Resiliente'}
              </div>
            </div>
          </div>

          <a
            href="/"
            style={{
              background: '#1e293b',
              border: '1px solid #334155',
              color: 'white',
              textDecoration: 'none',
              padding: '8px 14px',
              borderRadius: '10px',
              fontSize: '0.85rem',
              fontWeight: '600'
            }}
          >
            🌐 E-commerce
          </a>

          <a
            href="/app"
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
              color: 'white',
              textDecoration: 'none',
              padding: '8px 16px',
              borderRadius: '10px',
              fontSize: '0.85rem',
              fontWeight: '700'
            }}
          >
            📱 Abrir PWA
          </a>
        </div>
      </header>

      {/* KPI Cards Row */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '18px',
        marginBottom: '32px'
      }}>
        <div style={{ background: '#131b2e', border: '1px solid #1e293b', borderRadius: '16px', padding: '20px' }}>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>
            Facturación Mensual
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: '900', color: '#f59e0b', margin: '4px 0' }}>
            ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: '600' }}>
            ↗ +18.4% vs mes anterior
          </div>
        </div>

        <div style={{ background: '#131b2e', border: '1px solid #1e293b', borderRadius: '16px', padding: '20px' }}>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>
            Hamburguesas Vendidas
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: '900', color: 'white', margin: '4px 0' }}>
            {totalSalesUnits.toLocaleString()} uds
          </div>
          <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: '600' }}>
            🔥 4 Obras Maestras activas
          </div>
        </div>

        <div style={{ background: '#131b2e', border: '1px solid #1e293b', borderRadius: '16px', padding: '20px' }}>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>
            Consumidores Registrados
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: '900', color: '#10b981', margin: '4px 0' }}>
            2,382 clientes
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600' }}>
            Segmentados por consumo
          </div>
        </div>

        <div style={{ background: '#131b2e', border: '1px solid #1e293b', borderRadius: '16px', padding: '20px' }}>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>
            Tiempo Promedio Parrilla
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: '900', color: '#ef4444', margin: '4px 0' }}>
            11.4 min
          </div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: '600' }}>
            ⚡ Dentro del SLA de 15 min
          </div>
        </div>
      </section>

      {/* Tabs Selector */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '24px',
        borderBottom: '1px solid #1e293b',
        paddingBottom: '12px'
      }}>
        <button
          onClick={() => setActiveTab('inventory')}
          style={{
            background: activeTab === 'inventory' ? '#f59e0b' : '#131b2e',
            color: activeTab === 'inventory' ? '#090d16' : '#cbd5e1',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '10px',
            fontWeight: '800',
            fontSize: '0.9rem',
            cursor: 'pointer'
          }}
        >
          🍔 Catálogo de Hamburguesas ({burgers.length})
        </button>

        <button
          onClick={() => setActiveTab('consumers')}
          style={{
            background: activeTab === 'consumers' ? '#f59e0b' : '#131b2e',
            color: activeTab === 'consumers' ? '#090d16' : '#cbd5e1',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '10px',
            fontWeight: '800',
            fontSize: '0.9rem',
            cursor: 'pointer'
          }}
        >
          👥 Métricas de Consumidores por Consumo
        </button>
      </div>

      {/* ==================== VISTA 1: CATÁLOGO DE HAMBURGUESAS ==================== */}
      {activeTab === 'inventory' && (
        <section style={{
          background: '#111827',
          border: '1px solid #1f2937',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '14px'
          }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'white' }}>
                Disponibilidad en la Parrilla
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                Control de inventario, stock crítico y volumen de ventas en tiempo real.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="🔍 Filtrar por nombre, categoría o nivel..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                style={{
                  background: '#1f2937',
                  border: '1px solid #374151',
                  color: 'white',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  width: '280px'
                }}
              />

              <button
                onClick={() => setIsModalOpen(true)}
                style={{
                  background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                + Registrar Hamburguesa
              </button>
            </div>
          </div>

          {/* Tabla de Productos */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #1f2937', color: '#94a3b8', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 14px' }}>Hamburguesa</th>
                  <th style={{ padding: '12px 14px' }}>Categoría</th>
                  <th style={{ padding: '12px 14px' }}>Nivel</th>
                  <th style={{ padding: '12px 14px' }}>Precio</th>
                  <th style={{ padding: '12px 14px' }}>Stock</th>
                  <th style={{ padding: '12px 14px' }}>Ventas Mes</th>
                  <th style={{ padding: '12px 14px' }}>Estado</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>Acciones Demo</th>
                </tr>
              </thead>
              <tbody>
                {filteredBurgers.map((b) => (
                  <tr key={b.id} style={{ borderBottom: '1px solid #1f2937', fontSize: '0.88rem' }}>
                    <td style={{ padding: '14px', fontWeight: '800', color: 'white' }}>
                      {b.name}
                    </td>
                    <td style={{ padding: '14px', color: '#cbd5e1' }}>
                      {b.category}
                    </td>
                    <td style={{ padding: '14px' }}>
                      <span style={{
                        background: 'rgba(245, 158, 11, 0.1)',
                        color: '#f59e0b',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: '700'
                      }}>
                        {b.level}
                      </span>
                    </td>
                    <td style={{ padding: '14px', fontWeight: '800', color: '#f59e0b' }}>
                      ${b.price.toFixed(2)}
                    </td>
                    <td style={{ padding: '14px', fontWeight: '700', color: b.stock < 20 ? '#ef4444' : '#10b981' }}>
                      {b.stock} uds
                    </td>
                    <td style={{ padding: '14px', color: '#cbd5e1' }}>
                      {b.salesThisMonth} uds
                    </td>
                    <td style={{ padding: '14px' }}>
                      <span style={{
                        background: '#1e293b',
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '700'
                      }}>
                        {b.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => handleSimulateSale(b.id)}
                          title="Simular 1 venta (descuenta stock y suma a métricas)"
                          style={{
                            background: '#1e293b',
                            border: '1px solid #334155',
                            color: '#f59e0b',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            cursor: 'pointer'
                          }}
                        >
                          +1 Venta
                        </button>
                        <button
                          onClick={() => handleRestock(b.id)}
                          title="Añadir +20 al stock de parrilla"
                          style={{
                            background: '#1e293b',
                            border: '1px solid #334155',
                            color: '#10b981',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            cursor: 'pointer'
                          }}
                        >
                          +20 Stock
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ==================== VISTA 2: MÉTRICAS DE CONSUMIDORES ==================== */}
      {activeTab === 'consumers' && (
        <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Segmentación por Consumo */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {/* VIP Heavy Consumers */}
            <div style={{
              background: '#111827',
              border: '1px solid #f59e0b',
              borderRadius: '16px',
              padding: '24px',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(245, 158, 11, 0.15)',
                color: '#f59e0b',
                padding: '4px 10px',
                borderRadius: '9999px',
                fontSize: '0.72rem',
                fontWeight: '800'
              }}>
                58% DE INGRESOS
              </div>

              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>👑</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'white', marginBottom: '4px' }}>
                Consumidores VIP / Heavy
              </h3>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '18px' }}>
                Frecuencia: &gt; 5 pedidos por mes
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1f2937', paddingBottom: '8px' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Total Clientes:</span>
                  <span style={{ fontWeight: '800', color: 'white' }}>384 consumidores</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1f2937', paddingBottom: '8px' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Ticket Promedio:</span>
                  <span style={{ fontWeight: '800', color: '#f59e0b' }}>$54.20 USD</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1f2937', paddingBottom: '8px' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Hamburguesa Favorita:</span>
                  <span style={{ fontWeight: '700', color: '#cbd5e1' }}>Rey de la parrilla</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Retención / Fidelidad:</span>
                  <span style={{ fontWeight: '800', color: '#10b981' }}>94.2%</span>
                </div>
              </div>
            </div>

            {/* Consumidores Frecuentes */}
            <div style={{
              background: '#111827',
              border: '1px solid #1f2937',
              borderRadius: '16px',
              padding: '24px',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(56, 189, 248, 0.15)',
                color: '#38bdf8',
                padding: '4px 10px',
                borderRadius: '9999px',
                fontSize: '0.72rem',
                fontWeight: '800'
              }}>
                31% DE INGRESOS
              </div>

              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🍔</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'white', marginBottom: '4px' }}>
                Consumidores Frecuentes
              </h3>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '18px' }}>
                Frecuencia: 2 a 4 pedidos por mes
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1f2937', paddingBottom: '8px' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Total Clientes:</span>
                  <span style={{ fontWeight: '800', color: 'white' }}>812 consumidores</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1f2937', paddingBottom: '8px' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Ticket Promedio:</span>
                  <span style={{ fontWeight: '800', color: '#38bdf8' }}>$29.50 USD</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1f2937', paddingBottom: '8px' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Hamburguesa Favorita:</span>
                  <span style={{ fontWeight: '700', color: '#cbd5e1' }}>Hamburguesa Real</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Retención / Fidelidad:</span>
                  <span style={{ fontWeight: '800', color: '#10b981' }}>72.6%</span>
                </div>
              </div>
            </div>

            {/* Nuevos / Ocasionales */}
            <div style={{
              background: '#111827',
              border: '1px solid #1f2937',
              borderRadius: '16px',
              padding: '24px',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                padding: '4px 10px',
                borderRadius: '9999px',
                fontSize: '0.72rem',
                fontWeight: '800'
              }}>
                11% DE INGRESOS
              </div>

              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🌱</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'white', marginBottom: '4px' }}>
                Nuevos & Ocasionales
              </h3>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '18px' }}>
                Frecuencia: 1 pedido (En onboarding)
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1f2937', paddingBottom: '8px' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Total Clientes:</span>
                  <span style={{ fontWeight: '800', color: 'white' }}>1,186 consumidores</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1f2937', paddingBottom: '8px' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Ticket Promedio:</span>
                  <span style={{ fontWeight: '800', color: '#10b981' }}>$14.80 USD</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1f2937', paddingBottom: '8px' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Hamburguesa Entrada:</span>
                  <span style={{ fontWeight: '700', color: '#cbd5e1' }}>Royal Crispy</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Tasa de Conversión:</span>
                  <span style={{ fontWeight: '800', color: '#f59e0b' }}>38.4% recompra</span>
                </div>
              </div>
            </div>
          </div>

          {/* Gráfico de Distribución de Ventas por Categoría */}
          <div style={{
            background: '#111827',
            border: '1px solid #1f2937',
            borderRadius: '16px',
            padding: '24px'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'white', marginBottom: '16px' }}>
              Participación de Ventas por Estilo de Hamburguesa
            </h3>

            <div style={{
              height: '24px',
              background: '#1f2937',
              borderRadius: '9999px',
              overflow: 'hidden',
              display: 'flex',
              marginBottom: '16px'
            }}>
              <div style={{ width: '48%', background: '#f59e0b' }} title="A la Parrilla: 48%" />
              <div style={{ width: '26%', background: '#10b981' }} title="Pollo Crispy: 26%" />
              <div style={{ width: '18%', background: '#ef4444' }} title="Gigantes XXL: 18%" />
              <div style={{ width: '8%', background: '#38bdf8' }} title="Bebidas & Extras: 8%" />
            </div>

            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '12px', height: '12px', background: '#f59e0b', borderRadius: '3px' }} />
                <span>A la Parrilla (48%)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '12px', height: '12px', background: '#10b981', borderRadius: '3px' }} />
                <span>Pollo Crispy (26%)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '12px', height: '12px', background: '#ef4444', borderRadius: '3px' }} />
                <span>Gigantes XXL (18%)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '12px', height: '12px', background: '#38bdf8', borderRadius: '3px' }} />
                <span>Bebidas & Extras (8%)</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Modal para Crear Nueva Hamburguesa */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div style={{
            background: '#111827',
            border: '1px solid #1f2937',
            borderRadius: '16px',
            maxWidth: '460px',
            width: '100%',
            padding: '24px',
            boxShadow: '0 25px 50px rgba(0,0,0,0.7)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'white' }}>
                Registrar Nueva Hamburguesa
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.25rem', cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddBurger} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px' }}>
                  Nombre de la Hamburguesa:
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej. Hamburguesa Trufada al Carbón"
                  value={newBurger.name}
                  onChange={(e) => setNewBurger({ ...newBurger, name: e.target.value })}
                  style={{ width: '100%', background: '#1f2937', border: '1px solid #374151', color: 'white', padding: '10px', borderRadius: '8px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px' }}>
                    Categoría:
                  </label>
                  <select
                    value={newBurger.category}
                    onChange={(e) => setNewBurger({ ...newBurger, category: e.target.value })}
                    style={{ width: '100%', background: '#1f2937', border: '1px solid #374151', color: 'white', padding: '10px', borderRadius: '8px' }}
                  >
                    <option value="A la Parrilla">A la Parrilla</option>
                    <option value="Pollo Crispy">Pollo Crispy</option>
                    <option value="Gigantes XXL">Gigantes XXL</option>
                    <option value="Gourmet Edición">Gourmet Edición</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px' }}>
                    Nivel:
                  </label>
                  <select
                    value={newBurger.level}
                    onChange={(e) => setNewBurger({ ...newBurger, level: e.target.value })}
                    style={{ width: '100%', background: '#1f2937', border: '1px solid #374151', color: 'white', padding: '10px', borderRadius: '8px' }}
                  >
                    <option value="Master Grill ⭐⭐⭐">Master Grill ⭐⭐⭐</option>
                    <option value="Clásico Imperial ⭐⭐">Clásico Imperial ⭐⭐</option>
                    <option value="Crujiente Extremo ⭐⭐">Crujiente Extremo ⭐⭐</option>
                    <option value="Doble Fuego XXL ⭐⭐⭐">Doble Fuego XXL ⭐⭐⭐</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px' }}>
                    Precio ($ USD):
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="13.50"
                    value={newBurger.price}
                    onChange={(e) => setNewBurger({ ...newBurger, price: e.target.value })}
                    style={{ width: '100%', background: '#1f2937', border: '1px solid #374151', color: 'white', padding: '10px', borderRadius: '8px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px' }}>
                    Stock Inicial:
                  </label>
                  <input
                    type="number"
                    value={newBurger.stock}
                    onChange={(e) => setNewBurger({ ...newBurger, stock: e.target.value })}
                    style={{ width: '100%', background: '#1f2937', border: '1px solid #374151', color: 'white', padding: '10px', borderRadius: '8px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ flex: 1, background: '#1f2937', border: '1px solid #374151', color: 'white', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{ flex: 1, background: 'linear-gradient(135deg, #f59e0b, #ef4444)', border: 'none', color: 'white', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: '800' }}
                >
                  Guardar Hamburguesa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
