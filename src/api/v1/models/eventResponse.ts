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
    const safeToISOString = (dateValue: any): string => {
        if (!dateValue) return new Date().toISOString();
        
        try {
            if (dateValue instanceof Date) {
                return dateValue.toISOString();
            }
            const date = new Date(dateValue);
            
            if (isNaN(date.getTime())) {
                return new Date().toISOString();
            }
            
            return date.toISOString();
        } catch (error) {
            return new Date().toISOString();
        }
    };
    
    return {
        id: event.id,
        name: event.name,
        date: safeToISOString(event.date),
        capacity: event.capacity,
        registrationCount: event.registrationCount,
        status: event.status,
        category: event.category,
        createdAt: safeToISOString(event.createdAt),
        updatedAt: safeToISOString(event.updatedAt)
    };
};