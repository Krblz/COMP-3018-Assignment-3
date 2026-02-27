import { Request, Response } from "express";
import { getAllEventsService, getEventByIdService, createEventService, updateEventService, deleteEventService } from "../services/eventService"
import { HTTP_STATUS } from "../../../constants/httpConstants"
import { Post } from "../models/postModel";
import { successResponse } from "../models/responseModel";

export const getAllEvents = (req: Request, res: Response) => {
    // Logic to get all items
    try {
        const posts: Post[] = await postService.getPosts();
        res.status(200).json(successResponse(posts));
    } catch (error: unknown) {
        next(error);
    }
    let result = getAllEventsService()
    res.status(HTTP_STATUS.OK).json(result);
};

export const getEventById = (req: Request, res: Response) => {
    let id = Number(req.params.id)

    let result = getEventByIdService(id)

    if (result === undefined) {
        res.status(HTTP_STATUS.NOT_FOUND).json({ error: "Event not found" });
    }

    res.status(HTTP_STATUS.OK).json(result);
};

export const createEvent = (req: Request, res: Response) => {
    let newEvent = req.body

    let result = createEventService(newEvent)
    res.status(200).json(result);
};

export const updateEvent = (req: Request, res: Response) => {
    let newEvent = req.body
    let id = req.params.id

    let result = updateEventService(id, newEvent)
    res.status(200).json(result);
};

export const deleteEvent = (req: Request, res: Response) => {
    let id = req.params.id
    let result = deleteEventService(id)
    res.status(200).json(result);
};
