import React from 'react';
import './Hero.css';

export default function Hero() {
  return (
    <section className="hero-section">
      {/* Elementos Decorativos */}
      <div 
        className="deco-circle" 
        style={{ width: 300, height: 300, top: "10%", left: "35%", opacity: 0.4 }} 
      />
      <div 
        className="deco-circle" 
        style={{ width: 180, height: 180, top: "60%", left: "42%", opacity: 0.25 }} 
      />

      {/* Contenido Izquierda */}
      <div className="hero-left">
        <p className="hero-eyebrow fade-in">Pastelería artesanal</p>

        <h1 className="hero-title fade-in-delay">
          Aquí,<br />
          <em>el amor</em>
          <span className="outlined">nunca</span>
          sobra
        </h1>

        <p className="hero-desc fade-in-delay2">
          Queremos ser el invitado especial<br />
          de todas tus celebraciones.
        </p>

        <a href="#" className="hero-cta fade-in-delay2">
          Explorar pasteles →
        </a>
      </div>

      {/* Contenido Derecha */}
      <div className="hero-right">
        <div className="hero-img-wrap">
          <img
            src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80"
            alt="Pastel de Miga-Co"
          />
        </div>
        <div className="hero-img-badge">
          <strong>+200</strong>
          <span>Diseños únicos</span>
        </div>
      </div>
    </section>
  );
}