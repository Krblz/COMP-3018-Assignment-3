import { Request, Response } from "express";
import { getAllEventsService, getEventByIdService, createEventService, updateEventService, deleteEventService } from "../services/eventService";
import { HTTP_STATUS } from "src/constants/httpConstants";
import { successResponse } from "../models/responseModel";

export const getAllEvents = (req: Request, res: Response) => {
    // Logic to get all items
    try {
        let result = getAllEventsService();
        res.status(HTTP_STATUS.OK).json(successResponse(result, "Events retrieved"));
    } catch (error: unknown) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
    }
};

export const getEventById = (req: Request, res: Response) => {
    let id = req.params.id as string;
    let result = getEventByIdService(id);

    if (result === undefined) {
        res.status(HTTP_STATUS.NOT_FOUND).json({ error: "Event not found" });
    }

    res.status(HTTP_STATUS.OK).json(successResponse(result, ""));
};

export const createEvent = (req: Request, res: Response) => {
    let newEvent = req.body;

    let result = createEventService(newEvent)
    res.status(200).json(result);
};

export const updateEvent = (req: Request, res: Response) => {
    let id = req.params.id as string;
    let result = updateEventService(id, req.body);
    
    if (!result) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ error: "Event not found" });
    }
    
    res.status(HTTP_STATUS.OK).json(successResponse(result, "Event updated successfully"));
};

export const deleteEvent = (req: Request, res: Response) => {
    let id = req.params.id as string;
    let result = deleteEventService(id);

    if (!result) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ error: "Event not found" });
    }
    
    res.status(HTTP_STATUS.OK).json(successResponse(undefined, "Event deleted successfully"));
};
