import { db } from "../../../../config/firebaseConfig";
import { DocumentReference } from "firebase-admin/firestore";
import { QuerySnapshot } from "firebase-admin/firestore";

export const addEvent = async (eventData: any): Promise<{ id: string }> => {
    const currentEvents: QuerySnapshot = await db.collection("events").get();
    
    let maxNumber = 0;
    currentEvents.docs.forEach(doc => {
        const idParts = doc.id.split("_");
        if (idParts[0] === "evt" && idParts[1]) {
            const number = parseInt(idParts[1]);
            if (number > maxNumber) {
                maxNumber = number;
            }
        }
    });
    
    const newNumber = maxNumber + 1;
    const newId = `evt_${String(newNumber).padStart(6, "0")}`;
    
    const eventRef: DocumentReference = db.collection("events").doc(newId);
    
    await eventRef.set({
        name: eventData.name,
        date: eventData.date,
        capacity: eventData.capacity,
        registrationCount: eventData.registrationCount,
        status: eventData.status,
        category: eventData.category,
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    return { id: newId };
};

export const getAllEvents = async (): Promise<any[]> => {
    const currentEvents: QuerySnapshot = await db.collection("events").get();
    
    const events: any[] = [];
    currentEvents.docs.forEach(doc => {
        events.push({
            id: doc.id,
            name: doc.data().name,
            date: doc.data().date,
            capacity: doc.data().capacity,
            registrationCount: doc.data().registrationCount,
            status: doc.data().status,
            category: doc.data().category,
            createdAt: doc.data().createdAt,
            updatedAt: doc.data().updatedAt,
        });
    });
    
    return events;
};

export const getEventById = async (id: string): Promise<any | null> => {
    const eventRef: DocumentReference = db.collection("events").doc(id);
    const event = await eventRef.get();
    
    if (!event.exists) {
        return null;
    }
    
    return {
        id: event.id,
        name: event.data()!.name,
        date: event.data()!.date,
        capacity: event.data()!.capacity,
        registrationCount: event.data()!.registrationCount,
        status: event.data()!.status,
        category: event.data()!.category,
        createdAt: event.data()!.createdAt,
        updatedAt: event.data()!.updatedAt,
    };
};

export const updateEvent = async (id: string, eventData: any): Promise<any | null> => {
    const eventRef: DocumentReference = db.collection("events").doc(id);
    const event = await eventRef.get();
    
    if (!event.exists) {
        return null;
    }
    
    const updateData: any = { updatedAt: new Date() };
    
    if (eventData.name !== undefined) updateData.name = eventData.name;
    if (eventData.date !== undefined) updateData.date = eventData.date;
    if (eventData.capacity !== undefined) updateData.capacity = eventData.capacity;
    if (eventData.registrationCount !== undefined) updateData.registrationCount = eventData.registrationCount;
    if (eventData.status !== undefined) updateData.status = eventData.status;
    if (eventData.category !== undefined) updateData.category = eventData.category;
    
    await eventRef.update(updateData);
    
    const updatedEvent = await eventRef.get();
    
    return {
        id: updatedEvent.id,
        name: updatedEvent.data()!.name,
        date: updatedEvent.data()!.date,
        capacity: updatedEvent.data()!.capacity,
        registrationCount: updatedEvent.data()!.registrationCount,
        status: updatedEvent.data()!.status,
        category: updatedEvent.data()!.category,
        createdAt: updatedEvent.data()!.createdAt,
        updatedAt: updatedEvent.data()!.updatedAt,
    };
};

export const deleteEvent = async (id: string): Promise<boolean> => {
    const eventRef: DocumentReference = db.collection("events").doc(id);
    const event = await eventRef.get();
    
    if (!event.exists) {
        return false;
    }
    
    await eventRef.delete();
    return true;
};