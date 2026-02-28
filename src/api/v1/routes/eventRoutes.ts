import { Router } from "express";
import { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent } from "../controllers/eventController"
// import { validateRequest } from "../middleware/validate";
// import * as postController from "../controllers/postController";
// import { postSchemas } from "../validation/postSchemas";

const router: Router = Router();

router.get('/events', getAllEvents);
router.get('/events/:id', getEventById);
router.post('/events', createEvent);
router.put('/events/:id', updateEvent);
router.delete('/events/:id', deleteEvent);

export default router;