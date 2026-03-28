import { Request, Response } from 'express';
import * as eventController from '../src/api/v1/controllers/eventController';
import * as eventService from '../src/api/v1/services/eventService';
import { HTTP_STATUS } from '../src/constants/httpConstants';

// Mock the service module
jest.mock('../src/api/v1/services/eventService');

describe('Event Controller', () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;

    beforeEach(() => {
        jest.clearAllMocks();
        mockReq = {
            params: {},
            body: {},
            query: {}
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn()
        };
    });

    describe('getAllEvents', () => {
        it('should return all events successfully', async () => {
            // Arrange
            const mockEvents = [
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
                }
            ];
            const mockServiceResponse = {
                events: mockEvents,
                count: 1
            };
            (eventService.getAllEventsService as jest.Mock).mockResolvedValue(mockServiceResponse);

            // Act
            await eventController.getAllEvents(mockReq as Request, mockRes as Response);

            // Assert
            expect(eventService.getAllEventsService).toHaveBeenCalledTimes(1);
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.any(Array),
                    message: 'Events retrieved'
                })
            );
        });

        it('should handle errors when getting all events', async () => {
            // Arrange
            const mockError = new Error('Database connection failed');
            (eventService.getAllEventsService as jest.Mock).mockRejectedValue(mockError);

            // Act
            await eventController.getAllEvents(mockReq as Request, mockRes as Response);

            // Assert
            expect(eventService.getAllEventsService).toHaveBeenCalledTimes(1);
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
        });
    });

    describe('getEventById', () => {
        it('should return event by ID successfully', async () => {
            // Arrange
            mockReq.params = { id: 'evt_000001' };
            const mockEvent = {
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
            (eventService.getEventByIdService as jest.Mock).mockResolvedValue(mockEvent);

            // Act
            await eventController.getEventById(mockReq as Request, mockRes as Response);

            // Assert
            expect(eventService.getEventByIdService).toHaveBeenCalledWith('evt_000001');
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.any(Object),
                    message: 'Event retrieved'
                })
            );
        });

        it('should return 404 when event not found', async () => {
            // Arrange
            mockReq.params = { id: 'evt_999999' };
            (eventService.getEventByIdService as jest.Mock).mockResolvedValue(null);

            // Act
            await eventController.getEventById(mockReq as Request, mockRes as Response);

            // Assert
            expect(eventService.getEventByIdService).toHaveBeenCalledWith('evt_999999');
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.NOT_FOUND);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'Event not found' });
        });
    });

    describe('createEvent', () => {
        it('should create event successfully', async () => {
            // Arrange
            const newEventData = {
                name: 'New Conference',
                date: new Date('2026-05-20'),
                capacity: 200,
                registrationCount: 0,
                status: 'active',
                category: 'conference'
            };
            const mockCreatedEvent = {
                id: 'evt_000003',
                ...newEventData,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            mockReq.body = newEventData;
            (eventService.createEventService as jest.Mock).mockResolvedValue(mockCreatedEvent);

            // Act
            await eventController.createEvent(mockReq as Request, mockRes as Response);

            // Assert
            expect(eventService.createEventService).toHaveBeenCalledWith(newEventData);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.any(Object),
                    message: 'Event created'
                })
            );
        });

        it('should handle errors when creating event', async () => {
            // Arrange
            const newEventData = {
                name: 'New Conference',
                date: new Date('2026-05-20'),
                capacity: 200
            };
            mockReq.body = newEventData;
            const mockError = new Error('Failed to create event');
            (eventService.createEventService as jest.Mock).mockRejectedValue(mockError);

            // Act
            await eventController.createEvent(mockReq as Request, mockRes as Response);

            // Assert
            expect(eventService.createEventService).toHaveBeenCalledWith(newEventData);
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
        });
    });

    describe('updateEvent', () => {
        it('should update event successfully', async () => {
            // Arrange
            mockReq.params = { id: 'evt_000001' };
            const updateData = {
                name: 'Updated Conference Name',
                capacity: 150
            };
            mockReq.body = updateData;
            const mockUpdatedEvent = {
                id: 'evt_000001',
                name: 'Updated Conference Name',
                date: new Date('2026-03-15'),
                capacity: 150,
                registrationCount: 50,
                status: 'active',
                category: 'conference',
                createdAt: new Date('2026-02-01'),
                updatedAt: new Date()
            };
            (eventService.updateEventService as jest.Mock).mockResolvedValue(mockUpdatedEvent);

            // Act
            await eventController.updateEvent(mockReq as Request, mockRes as Response);

            // Assert
            expect(eventService.updateEventService).toHaveBeenCalledWith('evt_000001', updateData);
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.any(Object),
                    message: 'Event updated successfully'
                })
            );
        });

        it('should return 404 when updating non-existent event', async () => {
            // Arrange
            mockReq.params = { id: 'evt_999999' };
            mockReq.body = { name: 'Updated Name' };
            (eventService.updateEventService as jest.Mock).mockResolvedValue(null);

            // Act
            await eventController.updateEvent(mockReq as Request, mockRes as Response);

            // Assert
            expect(eventService.updateEventService).toHaveBeenCalledWith('evt_999999', mockReq.body);
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.NOT_FOUND);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'Event not found' });
        });
    });

    describe('deleteEvent', () => {
        it('should delete event successfully', async () => {
            // Arrange
            mockReq.params = { id: 'evt_000001' };
            (eventService.deleteEventService as jest.Mock).mockResolvedValue(true);

            // Act
            await eventController.deleteEvent(mockReq as Request, mockRes as Response);

            // Assert
            expect(eventService.deleteEventService).toHaveBeenCalledWith('evt_000001');
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'Event deleted successfully'
                })
            );
        });

        it('should return 404 when deleting non-existent event', async () => {
            // Arrange
            mockReq.params = { id: 'evt_999999' };
            (eventService.deleteEventService as jest.Mock).mockResolvedValue(false);

            // Act
            await eventController.deleteEvent(mockReq as Request, mockRes as Response);

            // Assert
            expect(eventService.deleteEventService).toHaveBeenCalledWith('evt_999999');
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.NOT_FOUND);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'Event not found' });
        });
    });
});