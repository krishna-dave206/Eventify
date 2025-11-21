import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../api";
import "./Dashboard.css";

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");

  const token = localStorage.getItem("token");

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/events`);
      setEvents(res.data);
    } catch (err) {
      console.log("Fetch error:", err);
    }
  };

  const createEvent = async () => {
    try {
      await axios.post(
        `${API_URL}/api/events`,
        { title, date, location, category },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchEvents();
      setTitle("");
      setDate("");
      setLocation("");
      setCategory("");
    } catch (err) {
      console.log(err);
      alert("Event creation failed");
    }
  };

  const deleteEvent = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchEvents();
    } catch (err) {
      alert("Delete failed");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard</h1>

      <div className="event-form">
        <h2>Create Event</h2>

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

        <input
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <button onClick={createEvent}>Create</button>
      </div>

      <h2>All Events</h2>

      <div>
        {events.map((e) => (
          <div className="event-card" key={e._id}>
            <h3>{e.title}</h3>
            <p>Date: {e.date?.slice(0, 10)}</p>
            <p>Location: {e.location}</p>
            <p>Category: {e.category}</p>

            <button className="delete-btn" onClick={() => deleteEvent(e._id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
