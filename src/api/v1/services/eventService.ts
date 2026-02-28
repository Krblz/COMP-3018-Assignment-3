import { addEvent, getAllEvents, getEventById, updateEvent, deleteEvent } from "../repositories/eventRepository";
 
export interface Event {
    id: string,
    name: string,
    date: Date,
    capacity: number,
    registrationCount: number,
    status: string,
    category: string,
    createdAt: Date,
    updatedAt: Date
}

interface EventsCount {
    events: Event[],
    count: number
}

export const getAllEventsService = async (): Promise<EventsCount> => {
    const events = await getAllEvents();
    return { count: events.length, events: events };
};

export const getEventByIdService = async (id: string): Promise<Event | null> => {
    return await getEventById(id);
};

export const createEventService = async (newEvent: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<Event> => {
    const result = await addEvent(newEvent);
    return {
        id: result.id,
        name: newEvent.name,
        date: newEvent.date,
        capacity: newEvent.capacity,
        registrationCount: newEvent.registrationCount,
        status: newEvent.status,
        category: newEvent.category,
        createdAt: new Date(),
        updatedAt: new Date()
    };
};

export const updateEventService = async (
    id: string, 
    eventData: Partial<Event>
): Promise<Event | null> => {
    return await updateEvent(id, eventData);
};

export const deleteEventService = async (id: string): Promise<boolean> => {
    return await deleteEvent(id);
};