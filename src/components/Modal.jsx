import React from "react";
import "./Modal.css"; // we will define CSS separately

export default function Modal({
  show,
  title,
  message,
  type = "info",
  onClose,
  onConfirm,
}) {
  if (!show) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        {title && <h2 className={`modal-title modal-${type}`}>{title}</h2>}
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          {type === "confirm" ? (
            <>
              <button className="btn btn-danger" onClick={onConfirm}>
                Yes
              </button>
              <button className="btn" onClick={onClose}>
                No
              </button>
            </>
          ) : (
            <button className="btn btn-ok" onClick={onClose}>
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
