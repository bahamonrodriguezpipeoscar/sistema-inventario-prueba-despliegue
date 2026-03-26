import React, { useEffect } from "react";
import "./toast.css";

/**
 * Toast simple (mensaje flotante).
 * - Se auto-cierra a los 3 segundos.
 */
export default function Toast({ message, type = "info", onClose }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => onClose?.(), 3000);
    return () => clearTimeout(t);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className={`toast ${type}`}>
      <div className="toast-inner">{message}</div>
    </div>
  );
}
