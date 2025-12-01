import "./Dashboard.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../api";

export default function Dashboard() {
  const [events, setEvents] = useState([]);

  // Create form
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");

  // Edit modal
  const [editingEvent, setEditingEvent] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editCategory, setEditCategory] = useState("");

  // Pagination & UI
  const [page, setPage] = useState(1);
  const perPage = 6;

  // Search + filter
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  // Theme
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (dark) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/events`);
      setEvents(res.data || []);
    } catch (err) {
      console.log("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line
  }, []);

  const createEvent = async () => {
    if (!title) return alert("Add a title");
    try {
      await axios.post(
        `${API_URL}/api/events`,
        { title, date, location, category },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTitle("");
      setDate("");
      setLocation("");
      setCategory("");
      fetchEvents();
    } catch (err) {
      console.log(err);
      alert("Event creation failed");
    }
  };

  const openEditModal = (event) => {
    setEditingEvent(event);
    setEditTitle(event.title || "");
    setEditDate(event.date?.slice(0, 10) || "");
    setEditLocation(event.location || "");
    setEditCategory(event.category || "");
  };

  const saveEdit = async () => {
    try {
      await axios.put(
        `${API_URL}/api/events/${editingEvent._id}`,
        {
          title: editTitle,
          date: editDate,
          location: editLocation,
          category: editCategory,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingEvent(null);
      fetchEvents();
    } catch (err) {
      console.log(err);
      alert("Update failed");
    }
  };

  const deleteEvent = async (id) => {
    if (!confirm("Delete this event?")) return;
    try {
      await axios.delete(`${API_URL}/api/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEvents();
    } catch (err) {
      console.log(err);
      alert("Delete failed");
    }
  };

  // Filter & pagination
  const filteredEvents = events.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase()) &&
    (filterCategory ? e.category === filterCategory : true)
  );

  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / perPage));
  const paginatedEvents = filteredEvents.slice((page - 1) * perPage, page * perPage);

  useEffect(() => {
    if (page > totalPages) setPage(1);
    // eslint-disable-next-line
  }, [filteredEvents.length, totalPages]);

  return (
    <div className="dashboard-wrapper">
      {/* TOP BAR */}
      <div className="topbar">
        <div className="brand">Eventify</div>

        <div className="top-actions">
          <div className="welcome">Welcome, <span>User</span></div>

          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/";
            }}
          >
            Logout
          </button>

          <button
            className="theme-toggle"
            onClick={() => setDark(!dark)}
            aria-label="Toggle dark mode"
          >
            {dark ? "🌞 Light" : "🌙 Dark"}
          </button>
        </div>
      </div>

      {/* CREATE EVENT */}
      <div className="create-event-box">
        <input
          placeholder="Event title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

        <input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Category</option>
          <option value="College">College</option>
          <option value="Festival">Festival</option>
          <option value="Sports">Sports</option>
          <option value="Personal">Personal</option>
        </select>

        <button className="save-btn" onClick={createEvent}>Save</button>
      </div>

      {/* Search + Filter */}
      <div className="controls-row">
        <input
          className="search-input"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="filter-select"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">All categories</option>
          <option value="College">College</option>
          <option value="Festival">Festival</option>
          <option value="Sports">Sports</option>
          <option value="Personal">Personal</option>
        </select>
      </div>

      {/* Event Cards */}
      <div className="event-grid">
        {paginatedEvents.map((e) => (
          <div className="event-card-new" key={e._id}>
            <div className="event-header">
              <div className="category-badge" style={{ background: "var(--accent)" }}>
                {e.category || "—"}
              </div>
              <div className="event-title">{e.title}</div>
            </div>

            <div className="event-info">
              <p><strong>Date:</strong> {e.date?.slice(0, 10) || "—"}</p>
              <p><strong>Location:</strong> {e.location || "—"}</p>
            </div>

            <div className="event-actions-new">
              <button className="edit-icon" onClick={() => openEditModal(e)}>✏️</button>
              <button className="delete-icon" onClick={() => deleteEvent(e._id)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination-bar">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={page === i + 1 ? "active" : ""}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Edit Modal */}
      {editingEvent && (
        <div className="modal-bg" style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.45)", display: "flex",
          justifyContent: "center", alignItems: "center", padding: 20
        }}>
          <div style={{
            background: "var(--card-bg)", color: "var(--text)",
            padding: 22, width: 360, borderRadius: 12,
            border: "1px solid var(--border)", boxShadow: "0 10px 40px var(--shadow)",
            animation: "fadeUp 0.3s ease"
          }}>
            <h3 style={{ marginTop: 0 }}>Edit Event</h3>

            <input className="modal-input" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
            <input className="modal-input" type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} />
            <input className="modal-input" value={editLocation} onChange={(e) => setEditLocation(e.target.value)} />
            <select className="modal-input" value={editCategory} onChange={(e) => setEditCategory(e.target.value)}>
              <option value="College">College</option>
              <option value="Festival">Festival</option>
              <option value="Sports">Sports</option>
              <option value="Personal">Personal</option>
            </select>

            <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
              <button className="save-btn" onClick={saveEdit}>Save</button>
              <button onClick={() => setEditingEvent(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
