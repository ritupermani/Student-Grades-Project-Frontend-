import React, { useState } from "react";
import Modal from "./Modal";

const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:5000/api/students";

export default function UploadForm({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({
    show: false,
    title: "",
    message: "",
    type: "info",
    onConfirm: null,
  });

  const showModal = (options) => setModal({ show: true, ...options });
  const hideModal = () => setModal({ ...modal, show: false });

  const submit = async (e) => {
    e.preventDefault();
    if (!file)
      return showModal({
        title: "Error",
        message: "Choose a file",
        type: "error",
      });

    const form = new FormData();
    form.append("file", file);

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/upload`, {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || data.message || "Upload failed");

      showModal({ title: "Success", message: data.message, type: "success" });
      onUploaded && onUploaded();
      setFile(null);
      e.target.reset();
    } catch (err) {
      console.error(err);
      showModal({
        title: "Error",
        message: "Upload failed: " + err.message,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    showModal({
      title: "Confirm",
      message: "Are you sure you want to clear all data?",
      type: "confirm",
      onConfirm: async () => {
        hideModal();
        try {
          const res = await fetch(`${API_BASE}/clear`, { method: "DELETE" });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Clear failed");
          showModal({
            title: "Success",
            message: "All data cleared",
            type: "success",
          });
          onUploaded && onUploaded();
        } catch (err) {
          showModal({
            title: "Error",
            message: "Clear failed: " + err.message,
            type: "error",
          });
        }
      },
    });
  };

  return (
    <div className="upload-box">
      <form onSubmit={submit}>
        <input
          type="file"
          accept=".xlsx,.csv,.xls"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </button>
        <button type="button" className="danger" onClick={clearAll}>
          Clear All Data
        </button>
      </form>

      {/* Modal */}
      <Modal
        show={modal.show}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onClose={hideModal}
        onConfirm={modal.onConfirm}
      />
    </div>
  );
}
