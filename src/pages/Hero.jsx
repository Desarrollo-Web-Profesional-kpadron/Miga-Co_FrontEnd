import React from 'react';
import './Hero.css';

export default function Hero() {
  return (
    <section className="hero-section">

      {/* Elementos Decorativos */}
      <div className="deco-circle" style={{ width: 300, height: 300, top: '10%', left: '35%', opacity: 0.4 }} />
      <div className="deco-circle" style={{ width: 180, height: 180, top: '60%', left: '42%', opacity: 0.25 }} />

      {/* Contenido Izquierda */}
      <div className="hero-left">
        <p className="hero-eyebrow">Reposteria Miga-Co</p>

        <h1 className="hero-title">
          Aquí,<br />
          <em>el amor</em>
          <span className="outlined">nunca</span>
          sobra
        </h1>

        <p className="hero-desc">
          Queremos ser el invitado especial<br />
          de todas tus celebraciones.
        </p>

        <a href="/productos" className="hero-cta">
          Explorar pasteles →
        </a>
      </div>

      {/* Contenido Derecha — Escena 3D */}
      <div className="hero-right">
        <div className="scene">
          <div className="cake-3d">

            {/* Anillos orbitales */}
            <div className="orbit orb1">
              <div className="dot" />
              <div className="dot" />
            </div>
            <div className="orbit orb2">
              <div className="dot" />
              <div className="dot" />
            </div>

            {/* Imagen del pastel */}
            <div className="img-frame">
              <img
                src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80"
                alt="Pastel de Miga-Co"
              />
            </div>

            {/* Sombra de piso */}
            <div className="shadow-ground" />
          </div>

          {/* Pétalos flotantes */}
          <div className="petal" />
          <div className="petal" />
          <div className="petal" />
        </div>

        {/* Badge */}
        <div className="hero-img-badge">
          <strong>+200</strong>
          <span>Diseños únicos</span>
        </div>
      </div>

    </section>
  );
}