import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent
} from "../controllers/eventController.js";

const router = express.Router();

//Public routes
router.get("/", getEvents);
router.get("/:id", getEventById);

// Protected routes
router.post("/", requireAuth, createEvent);
router.put("/:id", requireAuth, updateEvent);
router.delete("/:id", requireAuth, deleteEvent);

export default router;
