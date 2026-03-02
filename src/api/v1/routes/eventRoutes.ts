import { Router } from "express";
import { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent } from "../controllers/eventController"
import { validateRequest } from "../middleware/validate";
import { eventSchemas } from "../validation/eventSchemas";

const router: Router = Router();

router.get('/events', getAllEvents);
router.get('/events/:id', validateRequest(eventSchemas.getById), getEventById);
router.post('/events', validateRequest(eventSchemas.create), createEvent);
router.put('/events/:id', validateRequest(eventSchemas.update), updateEvent);
router.delete('/events/:id', validateRequest(eventSchemas.delete), deleteEvent);

export default router;