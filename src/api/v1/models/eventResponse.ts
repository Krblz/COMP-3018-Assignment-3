import { Event } from "./eventModel";

export interface EventResponse {
    id: string;
    name: string;
    date: string;
    capacity: number;
    registrationCount: number;
    status: string;
    category: string;
    createdAt: string;
    updatedAt: string;
}

export const toEventResponse = (event: Event): EventResponse => {
    return {
        id: event.id,
        name: event.name,
        date: event.date.toISOString(),
        capacity: event.capacity,
        registrationCount: event.registrationCount,
        status: event.status,
        category: event.category,
        createdAt: event.createdAt.toISOString(),
        updatedAt: event.updatedAt.toISOString(),
    };
};