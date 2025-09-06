import React, { useState } from "react";

export default function StudentsTable({ students, onChange }) {
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});

  function openEdit(s) {
    setEditing(s);
    setForm({
      student_name: s.student_name,
      total_marks: s.total_marks,
      marks_obtained: s.marks_obtained,
    });
  }

  async function saveEdit() {
    try {
      const res = await fetch(
        `http://localhost:5000/api/students/${editing._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Update failed");
      alert("Updated");
      setEditing(null);
      onChange && onChange();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  async function del(id) {
    if (!confirm("Delete this student?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/students/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      onChange && onChange();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  return (
    <div className="table-wrap">
      <table className="students">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Total Marks</th>
            <th>Marks Obtained</th>
            <th>Percentage</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {students.length === 0 && (
            <tr>
              <td colSpan="6" className="empty">
                No data available. Upload a file to get started.
              </td>
            </tr>
          )}
          {students.map((s) => (
            <tr key={s._id}>
              <td>{s.student_id}</td>
              <td>{s.student_name}</td>
              <td>{s.total_marks}</td>
              <td>{s.marks_obtained}</td>
              <td>{s.percentage}%</td>
              <td>
                <button onClick={() => openEdit(s)}>Edit</button>
                <button className="danger" onClick={() => del(s._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editing && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit {editing.student_id}</h3>

            <label>
              Name
              <input
                value={form.student_name}
                onChange={(e) =>
                  setForm({ ...form, student_name: e.target.value })
                }
              />
            </label>

            <label>
              Total Marks
              <input
                type="number"
                value={form.total_marks}
                onChange={(e) =>
                  setForm({ ...form, total_marks: Number(e.target.value) })
                }
              />
            </label>

            <label>
              Marks Obtained
              <input
                type="number"
                value={form.marks_obtained}
                onChange={(e) =>
                  setForm({ ...form, marks_obtained: Number(e.target.value) })
                }
              />
            </label>

            <div className="modal-actions">
              <button onClick={saveEdit}>Save</button>
              <button className="danger" onClick={() => setEditing(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
