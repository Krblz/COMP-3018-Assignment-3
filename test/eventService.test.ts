import * as eventService from '../src/api/v1/services/eventService';
import * as eventRepository from '../src/api/v1/repositories/eventRepository';
import { Event } from '../src/api/v1/services/eventService';

// Mock the repository module
jest.mock('../src/api/v1/repositories/eventRepository');

describe('Event Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllEventsService', () => {
        it('should return all events with count successfully', async () => {
            // Arrange
            const mockEvents: Event[] = [
                {
                    id: 'evt_000001',
                    name: 'Tech Conference',
                    date: new Date('2026-03-15'),
                    capacity: 100,
                    registrationCount: 50,
                    status: 'active',
                    category: 'conference',
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    id: 'evt_000002',
                    name: 'Workshop',
                    date: new Date('2026-04-20'),
                    capacity: 50,
                    registrationCount: 25,
                    status: 'active',
                    category: 'workshop',
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ];
            (eventRepository.getAllEvents as jest.Mock).mockResolvedValue(mockEvents);

            // Act
            const result = await eventService.getAllEventsService();

            // Assert
            expect(eventRepository.getAllEvents).toHaveBeenCalledTimes(1);
            expect(result).toEqual({
                events: mockEvents,
                count: 2
            });
        });

        it('should return empty array with count 0 when no events exist', async () => {
            // Arrange
            (eventRepository.getAllEvents as jest.Mock).mockResolvedValue([]);

            // Act
            const result = await eventService.getAllEventsService();

            // Assert
            expect(eventRepository.getAllEvents).toHaveBeenCalledTimes(1);
            expect(result).toEqual({
                events: [],
                count: 0
            });
        });
    });

    describe('getEventByIdService', () => {
        it('should return event when found', async () => {
            // Arrange
            const mockEvent: Event = {
                id: 'evt_000001',
                name: 'Tech Conference',
                date: new Date('2026-03-15'),
                capacity: 100,
                registrationCount: 50,
                status: 'active',
                category: 'conference',
                createdAt: new Date(),
                updatedAt: new Date()
            };
            (eventRepository.getEventById as jest.Mock).mockResolvedValue(mockEvent);

            // Act
            const result = await eventService.getEventByIdService('evt_000001');

            // Assert
            expect(eventRepository.getEventById).toHaveBeenCalledWith('evt_000001');
            expect(result).toEqual(mockEvent);
        });

        it('should return null when event not found', async () => {
            // Arrange
            (eventRepository.getEventById as jest.Mock).mockResolvedValue(null);

            // Act
            const result = await eventService.getEventByIdService('evt_999999');

            // Assert
            expect(eventRepository.getEventById).toHaveBeenCalledWith('evt_999999');
            expect(result).toBeNull();
        });
    });

    describe('createEventService', () => {
        it('should create event successfully', async () => {
            // Arrange
            const newEventInput = {
                name: 'New Conference',
                date: new Date('2026-05-20'),
                capacity: 200,
                registrationCount: 0,
                status: 'active',
                category: 'conference'
            };
            const mockRepositoryResponse = { id: 'evt_000003' };
            (eventRepository.addEvent as jest.Mock).mockResolvedValue(mockRepositoryResponse);

            // Act
            const result = await eventService.createEventService(newEventInput);

            // Assert
            expect(eventRepository.addEvent).toHaveBeenCalledWith(newEventInput);
            expect(result).toEqual({
                id: 'evt_000003',
                name: newEventInput.name,
                date: newEventInput.date,
                capacity: newEventInput.capacity,
                registrationCount: newEventInput.registrationCount,
                status: newEventInput.status,
                category: newEventInput.category,
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date)
            });
        });

        it('should handle repository error during creation', async () => {
            // Arrange
            const newEventInput = {
                name: 'New Conference',
                date: new Date('2026-05-20'),
                capacity: 200,
                registrationCount: 0,
                status: 'active',
                category: 'conference'
            };
            const mockError = new Error('Database connection failed');
            (eventRepository.addEvent as jest.Mock).mockRejectedValue(mockError);

            // Act & Assert
            await expect(eventService.createEventService(newEventInput)).rejects.toThrow('Database connection failed');
            expect(eventRepository.addEvent).toHaveBeenCalledWith(newEventInput);
        });
    });

    describe('updateEventService', () => {
        it('should update event successfully', async () => {
            // Arrange
            const eventId = 'evt_000001';
            const updateData = {
                name: 'Updated Conference Name',
                capacity: 150
            };
            const mockUpdatedEvent: Event = {
                id: eventId,
                name: 'Updated Conference Name',
                date: new Date('2026-03-15'),
                capacity: 150,
                registrationCount: 50,
                status: 'active',
                category: 'conference',
                createdAt: new Date('2026-02-01'),
                updatedAt: new Date()
            };
            (eventRepository.updateEvent as jest.Mock).mockResolvedValue(mockUpdatedEvent);

            // Act
            const result = await eventService.updateEventService(eventId, updateData);

            // Assert
            expect(eventRepository.updateEvent).toHaveBeenCalledWith(eventId, updateData);
            expect(result).toEqual(mockUpdatedEvent);
        });

        it('should return null when event to update not found', async () => {
            // Arrange
            const eventId = 'evt_999999';
            const updateData = { name: 'Updated Name' };
            (eventRepository.updateEvent as jest.Mock).mockResolvedValue(null);

            // Act
            const result = await eventService.updateEventService(eventId, updateData);

            // Assert
            expect(eventRepository.updateEvent).toHaveBeenCalledWith(eventId, updateData);
            expect(result).toBeNull();
        });
    });

    describe('deleteEventService', () => {
        it('should delete event successfully', async () => {
            // Arrange
            const eventId = 'evt_000001';
            (eventRepository.deleteEvent as jest.Mock).mockResolvedValue(true);

            // Act
            const result = await eventService.deleteEventService(eventId);

            // Assert
            expect(eventRepository.deleteEvent).toHaveBeenCalledWith(eventId);
            expect(result).toBe(true);
        });

        it('should return false when event to delete not found', async () => {
            // Arrange
            const eventId = 'evt_999999';
            (eventRepository.deleteEvent as jest.Mock).mockResolvedValue(false);

            // Act
            const result = await eventService.deleteEventService(eventId);

            // Assert
            expect(eventRepository.deleteEvent).toHaveBeenCalledWith(eventId);
            expect(result).toBe(false);
        });
    });
});