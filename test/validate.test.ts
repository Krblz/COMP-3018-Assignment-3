import { Request, Response, NextFunction } from 'express';
import { validateRequest } from '../src/api/v1/middleware/validate';
import { eventSchemas } from '../src/api/v1/validation/eventSchemas';
import { HTTP_STATUS } from '../src/constants/httpConstants';

describe('Validate Request Middleware', () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        mockReq = {
            headers: {},
            params: {},
            body: {},
            query: {}
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {}
        };
        mockNext = jest.fn();
    });

    describe('Event Creation Validation', () => {
        it('should pass for valid event creation data', () => {
            // Arrange
            mockReq.body = {
                name: "Tech Conference 2026",
                date: new Date("2026-03-15T09:00:00Z"),
                capacity: 100,
                registrationCount: 0,
                status: "active",
                category: "conference"
            };

            const middleware = validateRequest(eventSchemas.create);

            // Act
            middleware(mockReq as Request, mockRes as Response, mockNext);

            // Assert
            expect(mockNext).toHaveBeenCalled();
            expect(mockRes.status).not.toHaveBeenCalled();
        });

        it('should fail when name is too short', () => {
            // Arrange
            mockReq.body = {
                name: "Te",  // Too short (min 3)
                date: new Date("2026-03-15T09:00:00Z"),
                capacity: 100,
                status: "active",
                category: "conference"
            };

            const middleware = validateRequest(eventSchemas.create);

            // Act
            middleware(mockReq as Request, mockRes as Response, mockNext);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: expect.stringContaining('Validation error: "name" length must be at least 3 characters long')
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should fail when required fields are missing', () => {
            // Arrange
            mockReq.body = {
                name: "Tech Conference"
                // Missing date, capacity
            };

            const middleware = validateRequest(eventSchemas.create);

            // Act
            middleware(mockReq as Request, mockRes as Response, mockNext);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: expect.stringContaining('Validation error: "date" is required')
            });
            expect(mockRes.json).toHaveBeenCalledWith({
                message: expect.stringContaining('Validation error: "capacity" is required')
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should fail when capacity is below minimum', () => {
            // Arrange
            mockReq.body = {
                name: "Small Event",
                date: new Date("2026-03-15T09:00:00Z"),
                capacity: 3,  // Below minimum of 5
                status: "active",
                category: "meetup"
            };

            const middleware = validateRequest(eventSchemas.create);

            // Act
            middleware(mockReq as Request, mockRes as Response, mockNext);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: expect.stringContaining('Validation error: "capacity" must be greater than or equal to 5')
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should fail when registrationCount exceeds capacity', () => {
            // Arrange
            mockReq.body = {
                name: "Overbooked Event",
                date: new Date("2026-03-15T09:00:00Z"),
                capacity: 50,
                registrationCount: 60,  // Exceeds capacity
                status: "active",
                category: "workshop"
            };

            const middleware = validateRequest(eventSchemas.create);

            // Act
            middleware(mockReq as Request, mockRes as Response, mockNext);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: expect.stringContaining('Validation error: "registrationCount" must be less than or equal to ref:capacity')
            });
            expect(mockNext).not.toHaveBeenCalled();
        });
    });

    describe('Event Update Validation', () => {
        it('should pass for valid event update with partial data', () => {
            // Arrange
            mockReq.params = { id: "evt_000001" };
            mockReq.body = {
                name: "Updated Conference Name",
                capacity: 150
            };

            const middleware = validateRequest(eventSchemas.update);

            // Act
            middleware(mockReq as Request, mockRes as Response, mockNext);

            // Assert
            expect(mockNext).toHaveBeenCalled();
            expect(mockRes.status).not.toHaveBeenCalled();
        });

        it('should fail when event ID is missing in params', () => {
            // Arrange
            mockReq.params = {};  // Missing id
            mockReq.body = {
                name: "Updated Name"
            };

            const middleware = validateRequest(eventSchemas.update);

            // Act
            middleware(mockReq as Request, mockRes as Response, mockNext);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: expect.stringContaining('Event ID is required')
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should fail when status has invalid value', () => {
            // Arrange
            mockReq.params = { id: "evt_000001" };
            mockReq.body = {
                status: "pending"  // Invalid status
            };

            const middleware = validateRequest(eventSchemas.update);

            // Act
            middleware(mockReq as Request, mockRes as Response, mockNext);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: expect.stringContaining('Validation error: "status" must be one of [active, cancelled, completed]')
            });
            expect(mockNext).not.toHaveBeenCalled();
        });
    });

    describe('Event Get By ID Validation', () => {
        it('should pass for valid event ID', () => {
            // Arrange
            mockReq.params = { id: "evt_000001" };

            const middleware = validateRequest(eventSchemas.getById);

            // Act
            middleware(mockReq as Request, mockRes as Response, mockNext);

            // Assert
            expect(mockNext).toHaveBeenCalled();
            expect(mockRes.status).not.toHaveBeenCalled();
        });

        it('should fail when event ID is empty', () => {
            // Arrange
            mockReq.params = { id: "" };

            const middleware = validateRequest(eventSchemas.getById);

            // Act
            middleware(mockReq as Request, mockRes as Response, mockNext);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: expect.stringContaining('Event ID cannot be empty')
            });
            expect(mockNext).not.toHaveBeenCalled();
        });
    });

    describe('Event List Validation with Query Parameters', () => {
        it('should pass for valid query parameters', () => {
            // Arrange
            mockReq.query = {
                page: "1",
                limit: "10",
                status: "active",
                sortBy: "date",
                sortOrder: "asc"
            };

            const middleware = validateRequest(eventSchemas.list);

            // Act
            middleware(mockReq as Request, mockRes as Response, mockNext);

            // Assert
            expect(mockNext).toHaveBeenCalled();
            expect(mockRes.status).not.toHaveBeenCalled();
        });

        it('should apply default values when query parameters are missing', () => {
            // Arrange
            mockReq.query = {};

            const middleware = validateRequest(eventSchemas.list);

            // Act
            middleware(mockReq as Request, mockRes as Response, mockNext);

            // Assert
            expect(mockNext).toHaveBeenCalled();
            expect(mockReq.query).toHaveProperty('page', 1);
            expect(mockReq.query).toHaveProperty('limit', 10);
            expect(mockReq.query).toHaveProperty('sortBy', 'createdAt');
            expect(mockReq.query).toHaveProperty('sortOrder', 'desc');
        });
    });

    describe('Field Stripping Behavior', () => {
        it('should strip unknown fields from body', () => {
            // Arrange
            mockReq.body = {
                name: "Tech Conference",
                date: new Date("2026-03-15T09:00:00Z"),
                capacity: 100,
                status: "active",
                category: "conference",
                unknownField: "should be removed",  // Extra field
                anotherExtra: 123
            };

            const middleware = validateRequest(eventSchemas.create);

            // Act
            middleware(mockReq as Request, mockRes as Response, mockNext);

            // Assert
            expect(mockNext).toHaveBeenCalled();
            expect(mockReq.body).not.toHaveProperty('unknownField');
            expect(mockReq.body).not.toHaveProperty('anotherExtra');
        });
    });
});