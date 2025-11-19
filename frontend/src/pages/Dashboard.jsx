import { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

export default function Dashboard({}) {
  const [events, setEvents] = useState([]);

  // form state
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [editingId, setEditingId] = useState(null);

  // search / filter / pagination
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(6);

  const token = localStorage.getItem("token");

  // categories (you can extend)
  const CATEGORIES = ["Seminar", "Workshop", "Sports", "Cultural", "Technical", "Other"];

  // color mapping for badges
  const CATEGORY_COLORS = {
    Seminar: "#2563eb",
    Workshop: "#7c3aed",
    Sports: "#059669",
    Cultural: "#ea580c",
    Technical: "#0ea5e9",
    Other: "#6b7280"
  };

  const fetchEvents = async () => {
    try {
      const res = await axios.get("https://eventify-6z70.onrender.com/api/events");
      setEvents(res.data || []);
    } catch (err) {
      console.log("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // filtered list (search + category)
  const filtered = events.filter((e) => {
    const q = search.trim().toLowerCase();
    const matchSearch = q === "" || (e.title || "").toLowerCase().includes(q);
    const matchCategory = filterCategory === "all" || (e.category || "") === filterCategory;
    return matchSearch && matchCategory;
  });

  // pagination math
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const startIdx = (page - 1) * perPage;
  const paginated = filtered.slice(startIdx, startIdx + perPage);

  // create or update
  const saveEvent = async () => {
    if (!title || !date || !category || !location) {
      alert("Please fill all fields");
      return;
    }
    try {
      if (editingId) {
        await axios.put(
          `https://eventify-6z70.onrender.com/api/events/${editingId}`,
          { title, date, category, location },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          "https://eventify-6z70.onrender.com/api/events",
          { title, date, category, location },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      await fetchEvents();
      setTitle(""); setDate(""); setCategory(""); setLocation(""); setEditingId(null);
      setPage(1); // show newest items from first page
    } catch (err) {
      console.log("Save error:", err);
      alert("Event save failed");
    }
  };

  const startEdit = (ev) => {
    setEditingId(ev._id);
    setTitle(ev.title);
    setDate(ev.date?.slice(0, 10) || "");
    setCategory(ev.category || "");
    setLocation(ev.location || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteEvent = async (id) => {
    if (!confirm("Delete this event?")) return;
    try {
      await axios.delete(`https://eventify-6z70.onrender.com/api/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchEvents();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  // Decode username (best-effort)
  let username = "User";
  if (token) {
    try {
      const decoded = jwt_decode(token);
      username = decoded?.id || decoded?.name || "User";
    } catch (e) {}
  }

  // helpers to render page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);

  return (
    <div className="dashboard-wrapper">
      {/* NAVBAR */}
      <div className="topbar">
        <div className="brand">Eventify</div>
        <div className="top-actions">
          <div className="welcome">Welcome, <span>{username}</span></div>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </div>

      {/* FORM */}
      <div className="create-event-box">
        <input placeholder="Event Title" value={title} onChange={(e)=>setTitle(e.target.value)} />
        <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} />
        <select value={category} onChange={(e)=>setCategory(e.target.value)}>
          <option value="">Select category</option>
          {CATEGORIES.map((c)=> <option key={c} value={c}>{c}</option>)}
        </select>
        <input placeholder="Location" value={location} onChange={(e)=>setLocation(e.target.value)} />

        <button onClick={saveEvent} className="save-btn">{editingId ? "Update" : "Create"}</button>
      </div>

      {/* Filters + Search */}
      <div className="controls-row">
        <input className="search-input" placeholder="Search by title..." value={search} onChange={(e)=>{setSearch(e.target.value); setPage(1);}} />
        <select className="filter-select" value={filterCategory} onChange={(e)=>{ setFilterCategory(e.target.value); setPage(1); }}>
          <option value="all">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <div className="pagination-controls">
          <label>Per page:
            <select value={perPage} onChange={(e)=>{ setPerPage(Number(e.target.value)); setPage(1); }}>
              {[6,9,12,18].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
        </div>
      </div>

      {/* Event grid */}
      <div className="event-grid">
        {paginated.length === 0 ? (
          <div className="loading-text">No events found</div>
        ) : (
          paginated.map((e) => (
            <div key={e._id} className="event-card-new">
              <div className="event-header">
                <span className="category-badge" style={{background: CATEGORY_COLORS[e.category] || "#6b7280"}}>{e.category}</span>
                <h3 className="event-title">{e.title}</h3>
              </div>
              <div className="event-info">
                <p><b>Date:</b> {e.date?.slice(0,10)}</p>
                <p><b>Location:</b> {e.location}</p>
              </div>
              <div className="event-actions-new">
                <button className="edit-icon" onClick={()=>startEdit(e)}>✏️</button>
                <button className="delete-icon" onClick={()=>deleteEvent(e._id)}>🗑️</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination UI */}
      <div className="pagination-bar">
        <button disabled={page<=1} onClick={()=>setPage(p=>Math.max(1,p-1))}>Prev</button>

        {pageNumbers.map(n => (
          <button key={n} className={`page-btn ${n===page?"active":""}`} onClick={()=>setPage(n)}>{n}</button>
        ))}

        <button disabled={page>=totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))}>Next</button>
      </div>
    </div>
  );
}
