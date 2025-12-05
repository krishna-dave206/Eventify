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

  // Delete confirmation modal
  const [deletingEventId, setDeletingEventId] = useState(null);

  // Pagination & UI
  const [page, setPage] = useState(1);
  const perPage = 9;

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

  const deleteEvent = async () => {
    if (!deletingEventId) return;
    try {
      await axios.delete(`${API_URL}/api/events/${deletingEventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeletingEventId(null);
      fetchEvents();
    } catch (err) {
      console.log(err);
      alert("Delete failed");
      setDeletingEventId(null);
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
        <nav className="glass sticky top-0 z-50 px-4 py-3 shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-display font-bold text-slate-900 dark:text-white"
            >
              Eventify
            </motion.div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setDark(!dark)}
                className="p-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/";
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors font-medium"
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
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsCreating(!isCreating)}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm hover:shadow-md transition-all font-semibold"
            >
              <Plus className="w-5 h-5" />
              Create Event
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {paginatedEvents.map((e, index) => {
                return (
                  <motion.div
                    key={e._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300 group"
                  >
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-3">
                        <span className="px-3 py-1 rounded-md text-xs font-semibold bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                          {e.category || "General"}
                        </span>
                        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => openEditModal(e)}
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setDeletingEventId(e._id)}
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-red-600 dark:text-red-400 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>

                      <h3 className="text-lg font-display font-bold mb-2 text-gray-900 dark:text-white leading-tight">{e.title}</h3>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                          <Calendar className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                          <span className="font-medium">{e.date?.slice(0, 10) || "No date"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                          <MapPin className="w-4 h-4 text-slate-500 dark:text-slate-400" />
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
                    whileHover={{ scale: page !== i + 1 ? 1.05 : 1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setPage(i + 1)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-semibold transition-all ${page === i + 1
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
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

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {deletingEventId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-slate-800 w-full max-w-md p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                    <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Delete Event?</h3>
                </div>

                <p className="text-slate-600 dark:text-slate-300 mb-6">
                  Are you sure you want to delete this event? This action cannot be undone.
                </p>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setDeletingEventId(null)}
                    className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={deleteEvent}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    Delete Event
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
