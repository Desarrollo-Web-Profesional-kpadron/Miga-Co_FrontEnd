import { useState } from "react";
import "./ChatButton.css";

export default function ChatButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <p className="demo-label">hover · click</p>

      <button
        className={`chat-btn ${open ? "is-open" : ""}`}
        onClick={() => setOpen(!open)}
        aria-label="Abrir chat"
      >
        <span className="chat-btn__icon">
          {open ? "✕" : "✿"}
        </span>
        <span className="chat-btn__label">
          {open ? "Cerrar" : "Hablemos"}
        </span>
      </button>
    </>
  );
}