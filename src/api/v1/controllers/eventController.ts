import { Request, Response } from "express";
import { getAllEventsService, getEventByIdService, createEventService, updateEventService, deleteEventService } from "../services/eventService";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { successResponse } from "../models/responseModel";
import { toEventResponse } from "../models/eventResponse";

export const getAllEvents = async (req: Request, res: Response) => {
    // Logic to get all items
    try {
        const result = await getAllEventsService();
        const responses = result.events.map(toEventResponse);

        res.status(HTTP_STATUS.OK).json(successResponse({ events: responses, count: result.count }, "Events retrieved"));
        
    } catch (error: unknown) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
    }
};

export const getEventById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const result = await getEventByIdService(id);

        if (!result) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ error: "Event not found" });
        }

        const response = toEventResponse(result);
        res.status(HTTP_STATUS.OK).json(successResponse(response, "Event retrieved"));
    } catch (error: unknown) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
    }
};

export const createEvent = async (req: Request, res: Response) => {
    try {
        const newEvent = req.body;
        const result = await createEventService(newEvent)
        
        const response = toEventResponse(result);
        res.status(200).json(response);
    } catch (error: unknown) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
    }
};

export const updateEvent = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const result = await updateEventService(id, req.body);
        
        if (!result) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ error: "Event not found" });
        }
        
        const response = toEventResponse(result);
        res.status(HTTP_STATUS.OK).json(successResponse(response, "Event updated successfully"));
    } catch (error: unknown) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
    }
    
};

export const deleteEvent = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const result = await deleteEventService(id);

        if (!result) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ error: "Event not found" });
        }

        res.status(HTTP_STATUS.OK).json(successResponse(undefined, "Event deleted successfully"));       
    } catch (error: unknown) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
    }
};
