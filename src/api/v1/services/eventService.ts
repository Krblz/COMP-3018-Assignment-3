import { events } from "../../../data/eventData"
 
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
    return {events: events, count: events.length};
};

export const getEventByIdService = (id: string): Event | undefined => {
    let event = events.find(x => x.id === id)

    return event;
};

export const createEventService = (newEvent: Event): Event => {
    events.push(newEvent)
    return newEvent;
};

export const updateEventService = (
        id: string, 
        name: string,
        date: Date,
        capacity: number,
        registrationCount: number,
        status: string,
        category: string,
        updatedAt: Date
    ): Event | undefined => {
    let event = events.find(x => x.id === id);

    if (!event) {
        return undefined;
    }

    if (name !== undefined) event.name = name;
    if (date !== undefined) event.description = date;
    if (capacity !== undefined) event.capacity = capacity;
    if (registrationCount !== undefined) event.capacity = capacity;
    if (status !== undefined) event.status = status;
    if (category !== undefined) event.capacity = capacity;
    if (updatedAt !== undefined) event.updatedAt = new Date().toISOString();;
    
    return event;
};

export const deleteEventService = (id: number) => {
    let eventToDelete = events.findIndex(x => x.id === id);

    if (eventToDelete === -1) {
        return false;
    }

    events.splice(eventToDelete, 1)

    return;
};