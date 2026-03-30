import { Router } from "express";
import { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent } from "../controllers/eventController"
import { validateRequest } from "../middleware/validate";
import { eventSchemas } from "../validation/eventSchemas";

const router: Router = Router();

/**
 * @openapi
 * /events:
 *   get:
 *     summary: Get all events
 *     description: Retrieves a list of all events.
 *     responses:
 *       200:
 *         description: A list of events
 *         content:
 *           application/json:
 *             example:
 *               - id: "1"
 *                 name: "Event One"
 *                 date: "2026-01-01"
 *               - id: "2"
 *                 name: "Event Two"
 *                 date: "2026-02-01"
 *       500:
 *         description: Internal Server Error
 */
router.get('/events', getAllEvents);

/**
 * @openapi
 * /events/{id}:
 *   get:
 *     summary: Get an event by ID
 *     description: Retrieves a single event using its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The event ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event retrieved
 *         content:
 *           application/json:
 *             example:
 *               id: "1"
 *               name: "Event One"
 *               date: "2026-01-01"
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/events/:id', validateRequest(eventSchemas.getById), getEventById);

/**
 * @openapi
 * /events:
 *   post:
 *     summary: Create a new event
 *     description: Creates a new event with the provided data.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: "New Event"
 *             date: "2026-03-01"
 *     responses:
 *       201:
 *         description: Event created successfully
 *         content:
 *           application/json:
 *             example:
 *               id: "3"
 *               name: "New Event"
 *               date: "2026-03-01"
 *       500:
 *         description: Internal Server Error
 */
router.post('/events', validateRequest(eventSchemas.create), createEvent);

/**
 * @openapi
 * /events/{id}:
 *   put:
 *     summary: Update an event
 *     description: Updates an existing event by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The event ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: "Updated Event"
 *             date: "2026-04-01"
 *     responses:
 *       200:
 *         description: Event updated successfully
 *         content:
 *           application/json:
 *             example:
 *               id: "1"
 *               name: "Updated Event"
 *               date: "2026-04-01"
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal Server Error
 */
router.put('/events/:id', validateRequest(eventSchemas.update), updateEvent);

/**
 * @openapi
 * /events/{id}:
 *   delete:
 *     summary: Delete an event
 *     description: Deletes an event by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The event ID
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Event deleted successfully (no content)
 *       404:
 *         description: Event not found
 *       500:
 *         description: SInternal Server Error
 */
router.delete('/events/:id', validateRequest(eventSchemas.delete), deleteEvent);

export default router;