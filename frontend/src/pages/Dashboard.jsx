import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../api";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, Filter, LogOut, Sun, Moon,
  MapPin, Calendar, Edit2, Trash2, X, Save
} from "lucide-react";

export default function Dashboard() {
  const [events, setEvents] = useState([]);

  // Create form
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Edit modal
  const [editingEvent, setEditingEvent] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editCategory, setEditCategory] = useState("");

  // Pagination & UI
  const [page, setPage] = useState(1);
  const perPage = 3;

  // Search + filter
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  // Theme
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
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

  const createEvent = async (e) => {
    e.preventDefault();
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
      setIsCreating(false);
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

  const saveEdit = async (e) => {
    e.preventDefault();
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

  const categories = ["College", "Festival", "Sports", "Personal"];

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark text-text dark:text-text-dark transition-colors duration-300 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Large rotating orb */}
        <div className="absolute top-[-15%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-primary/30 via-secondary/20 to-transparent dark:from-primary/15 dark:via-secondary/10 rounded-full blur-3xl animate-float-rotate" />

        {/* Pulsing glow orb */}
        <div className="absolute bottom-[-15%] left-[-15%] w-[550px] h-[550px] bg-gradient-to-tr from-secondary/25 via-accent/15 to-transparent dark:from-secondary/12 dark:via-accent/8 rounded-full blur-3xl animate-pulse-glow" />

        {/* Drifting center orb */}
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-gradient-to-bl from-accent/20 via-primary/15 to-transparent dark:from-accent/10 dark:via-primary/8 rounded-full blur-3xl animate-drift" />

        {/* Small accent orbs */}
        <div className="absolute top-1/4 left-1/4 w-[200px] h-[200px] bg-primary/20 dark:bg-primary/10 rounded-full blur-2xl animate-pulse-slow" />
        <div className="absolute bottom-1/3 right-1/3 w-[250px] h-[250px] bg-secondary/15 dark:bg-secondary/8 rounded-full blur-2xl animate-float" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Navbar - Colorful & Compact */}
        <nav className="glass sticky top-0 z-50 px-4 py-2 shadow-neon">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl font-display font-black gradient-text neon-glow"
            >
              ✨ Eventify
            </motion.div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setDark(!dark)}
                className="p-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:from-amber-500 hover:to-orange-600 transition-all shadow-neon-amber"
              >
                {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/";
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 py-4">
          {/* Controls - Compact & Colorful */}
          <div className="flex flex-col md:flex-row gap-2 justify-between items-center mb-4">
            <div className="flex gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
                <input
                  placeholder="Search events..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-surface border border-white/10 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="bg-surface border border-white/10 rounded-lg py-2 pl-10 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">All Categories</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCreating(!isCreating)}
              className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-secondary via-purple-500 to-primary text-white rounded-xl shadow-xl shadow-secondary/30 hover:shadow-neon-pink transition-all font-semibold rainbow-border border-2"
            >
              <Plus className="w-5 h-5" />
              ✨ Create Event
            </motion.button>
          </div>

          {/* Create Event Form */}
          <AnimatePresence>
            {isCreating && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={createEvent}
                className="glass-card p-6 mb-8 overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <input
                    placeholder="Event Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-background/50 border border-white/10 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="bg-background/50 border border-white/10 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <input
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="bg-background/50 border border-white/10 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="bg-background/50 border border-white/10 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="flex justify-end mt-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="px-4 py-2 text-muted hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Save Event
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Event Grid - Vibrant & Colorful */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <AnimatePresence mode="popLayout">
              {paginatedEvents.map((e, index) => {
                const cardColors = ['glass-card-1', 'glass-card-2', 'glass-card-3', 'glass-card-4', 'glass-card-5', 'glass-card-6'];
                const cardClass = cardColors[index % cardColors.length];

                return (
                  <motion.div
                    key={e._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 20, rotate: -2 }}
                    animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    whileHover={{ y: -8, rotate: 1, transition: { duration: 0.2 } }}
                    className={`${cardClass} glass-card p-4 hover:shadow-2xl transition-all duration-300 group relative overflow-hidden border-2`}
                  >
                    {/* Shimmer effect on hover */}
                    <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-3">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-white/40 to-white/20 dark:from-white/30 dark:to-white/10 text-gray-900 dark:text-white border-2 border-white/50 dark:border-white/30 backdrop-blur-sm shadow-lg uppercase tracking-wide">
                          {e.category || "General"}
                        </span>
                        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <motion.button
                            whileHover={{ scale: 1.15, rotate: 10 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => openEditModal(e)}
                            className="p-1.5 rounded-lg bg-white/50 dark:bg-white/20 text-primary hover:text-secondary hover:bg-white/70 dark:hover:bg-white/30 transition-colors backdrop-blur-sm shadow-md"
                          >
                            <Edit2 className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.15, rotate: -10 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => deleteEvent(e._id)}
                            className="p-1.5 rounded-lg bg-white/50 dark:bg-white/20 text-danger hover:bg-red-100 dark:hover:bg-red-500/30 transition-colors backdrop-blur-sm shadow-md"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>

                      <h3 className="text-lg font-display font-bold mb-2 text-gray-900 dark:text-white leading-tight">{e.title}</h3>

                      <div className="space-y-1.5 text-sm">
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                          <div className="p-1 rounded-lg bg-primary/20 dark:bg-primary/10">
                            <Calendar className="w-3.5 h-3.5 text-primary" />
                          </div>
                          <span className="font-medium">{e.date?.slice(0, 10) || "No date"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                          <div className="p-1 rounded-lg bg-secondary/20 dark:bg-secondary/10">
                            <MapPin className="w-3.5 h-3.5 text-secondary" />
                          </div>
                          <span className="font-medium">{e.location || "No location"}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Enhanced Pagination */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center items-center gap-2 mt-12"
            >
              {/* Previous Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${page === 1
                  ? "bg-surface/50 dark:bg-surface-dark/30 text-muted/50 cursor-not-allowed"
                  : "bg-gradient-to-r from-surface to-surface/80 dark:from-surface-dark dark:to-surface-dark/80 text-text dark:text-text-dark hover:shadow-lg"
                  }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Prev
              </motion.button>

              {/* Page Numbers */}
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: page !== i + 1 ? 1.1 : 1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setPage(i + 1)}
                    className={`w-11 h-11 rounded-xl flex items-center justify-center font-semibold transition-all duration-300 ${page === i + 1
                      ? "bg-gradient-to-br from-primary to-secondary text-white shadow-xl shadow-primary/30 scale-110"
                      : "bg-surface dark:bg-surface-dark/50 text-muted dark:text-muted-dark hover:bg-surface/80 dark:hover:bg-surface-dark hover:text-text dark:hover:text-text-dark hover:shadow-lg backdrop-blur-sm"
                      }`}
                  >
                    {i + 1}
                  </motion.button>
                ))}
              </div>

              {/* Next Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${page === totalPages
                  ? "bg-surface/50 dark:bg-surface-dark/30 text-muted/50 cursor-not-allowed"
                  : "bg-gradient-to-r from-surface to-surface/80 dark:from-surface-dark dark:to-surface-dark/80 text-text dark:text-text-dark hover:shadow-lg"
                  }`}
              >
                Next
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            </motion.div>
          )}
        </main>

        {/* Edit Modal */}
        <AnimatePresence>
          {editingEvent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card w-full max-w-lg p-6"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold">Edit Event</h3>
                  <button
                    onClick={() => setEditingEvent(null)}
                    className="p-2 rounded-lg hover:bg-surface/50 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={saveEdit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted mb-1 block">Title</label>
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full bg-background/50 border border-white/10 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted mb-1 block">Date</label>
                      <input
                        type="date"
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                        className="w-full bg-background/50 border border-white/10 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted mb-1 block">Category</label>
                      <select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        className="w-full bg-background/50 border border-white/10 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                      >
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted mb-1 block">Location</label>
                    <input
                      value={editLocation}
                      onChange={(e) => setEditLocation(e.target.value)}
                      className="w-full bg-background/50 border border-white/10 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setEditingEvent(null)}
                      className="px-4 py-2 text-muted hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
