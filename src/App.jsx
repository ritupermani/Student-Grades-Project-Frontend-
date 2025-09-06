import React, { useEffect, useState } from "react";
import UploadForm from "./components/UploadForm";
import StudentsTable from "./components/StudentsTable";
import "./styles.css";
const API_BASE = import.meta.env.VITE_API_BASE || "https://student-grades-project1.onrender.com/api/students";
export default function App() {
  const [students, setStudents] = useState([]);
  const [total, setTotal] = useState(0);
  const [history, setHistory] = useState([]);
  async function fetchStudents() {
    try {
      const res = await fetch(`${API_BASE}`);
      const data = await res.json();
      setStudents(data.students || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error(err);
    }
  }
  async function fetchHistory() {
    try {
      const res = await fetch(`${API_BASE}/history`);
      const d = await res.json();
      setHistory(d.history || []);
    } catch (e) {}
  }
  useEffect(() => {
    fetchStudents();
    fetchHistory();
  }, []);
  return (
    <div className="container">
      <h1>🎓 Student Grade Management</h1>
      <UploadForm
        onUploaded={() => {
          fetchStudents();
          fetchHistory();
        }}
      />
      <div className="meta">
        Total Students: <strong>{total}</strong>
      </div>
      <StudentsTable students={students} onChange={fetchStudents} />
      <div className="history">
        <h3>Upload History</h3>
        {history.length === 0 ? (
          <div className="note">No uploads yet</div>
        ) : (
          <ul>
            {history.map((h, idx) => (
              <li key={idx}>
                {h.file} — {new Date(h.uploadedAt).toLocaleString()} — {h.count}{" "}
                rows
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
