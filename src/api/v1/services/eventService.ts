import { addDocument } from "../repositories/eventRepository";
 
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

export const getAllEventsService = (): EventsCount => {
    return {count: events.length, events: events};
};

export const getEventByIdService = (id: string): Event | undefined => {
    let event = events.find(x => x.id === id)

    return event;
};

export const createEventService = (newEvent: Event): Event => {
    addDocument();
    return newEvent;
};

export const updateEventService = (
        id: string, 
        eventData: Partial<Event>
    ): Event | undefined => {
    let event = events.find(x => x.id === id);

    if (!event) {
        return undefined;
    }

    if (eventData.name !== undefined) event.name = eventData.name;
    if (eventData.date !== undefined) event.description = eventData.date;
    if (eventData.capacity !== undefined) event.capacity = eventData.capacity;
    if (eventData.registrationCount !== undefined) event.capacity = eventData.registrationCount;
    if (eventData.status !== undefined) event.status = eventData.status;
    if (eventData.category !== undefined) event.capacity = eventData.category;
    event.updatedAt = new Date();
    
    return event;
};

export const deleteEventService = (id: string): boolean => {
    let eventIndex = events.findIndex(x => x.id === id);

    if (eventIndex === -1) {
        return false;
    }

    events.splice(eventIndex, 1);
    return true;
};