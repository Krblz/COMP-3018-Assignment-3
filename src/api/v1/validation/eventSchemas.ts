import Joi from "joi";

// Event operation schemas organized by request part
export const eventSchemas = {
    // EVENT /events - Create new event
    create: {
        body: Joi.object({
            name: Joi.string().required().min(3).messages({
                "any.required": "Validation error: \"name\" is required",
                "string.empty": "Validation error: \"name\" is required",
                "string.min": "Validation error: \"name\" length must be at least 3 characters long"
            }),
            date: Joi.date().required().greater("now").messages({
                "any.required": "Validation error: \"date\" is required",
                "date.greater": "Validation error: \"date\" must be greater than \"now\"" 
            }),
            capacity: Joi.number().required().min(5).integer().messages({
                "any.required": "Validation error: \"capacity\" is required",
                "number.integer": "Validation error: \"capacity\" must be an integer",
                "number.min": "Validation error: \"capacity\" must be greater than or equal to 5"
            }),
            registrationCount: Joi.number().min(0).max(Joi.ref("capacity")).integer().default(0).messages({
                "number.max": "Validation error: \"registrationCount\" must be less than or equal to ref:capacity"
            }),
            status: Joi.string().valid("active", "cancelled", "completed").default("active").messages({
                "any.only": "Validation error: \"status\" must be one of [active, cancelled, completed]"
            }),
            category: Joi.string().valid("conference", "workshop", "meetup", "seminar", "general").default("general").messages({
                "any.required": "Validation error: \"category\" is required",
                "any.only": "Validation error: \"category\" must be one of [conference, workshop, meetup, seminar, general]"
            })
        }),
    },

    // GET /events/:id - Get single event
    getById: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Event ID is required",
                "string.empty": "Event ID cannot be empty",
            }),
        }),
    },

    // PUT /events/:id - Update event
    update: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Event ID is required",
                "string.empty": "Event ID cannot be empty",
            }),
        }),
        body: Joi.object({
            name: Joi.string().min(3).messages({
                "string.min": "Validation error: \"name\" length must be at least 3 characters long"
            }),
            date: Joi.date().greater("now").messages({
                "date.greater": "Validation error: \"date\" must be greater than \"now\"" 
            }),
            capacity: Joi.number().min(5).integer().messages({
                "number.integer": "Validation error: \"capacity\" must be an integer",
                "number.min": "Validation error: \"capacity\" must be greater than or equal to 5"
            }),
            registrationCount: Joi.number().min(0).max(Joi.ref("capacity")).integer().default(0).messages({
                "number.max": "Validation error: \"registrationCount\" must be less than or equal to ref:capacity"
            }),
            status: Joi.string().valid("active", "cancelled", "completed").messages({
                "any.only": "Validation error: \"status\" must be one of [active, cancelled, completed]"
            }),
            category: Joi.string().valid("conference", "workshop", "meetup", "seminar", "general").messages({
                "any.only": "Validation error: \"category\" must be one of [conference, workshop, meetup, seminar, general]"
            })
        }),
    },

    // DELETE /events/:id - Delete event
    delete: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Event ID is required",
                "string.empty": "Event ID cannot be empty",
            }),
        }),
    },

    // GET /events - List events with filtering
    list: {
        query: Joi.object({
            page: Joi.number().integer().min(1).default(1),
            limit: Joi.number().integer().min(1).max(100).default(10),
            status: Joi.string().valid("active", "cancelled", "completed").optional(),
            category: Joi.string().valid("conference", "workshop", "meetup", "seminar", "general").optional(),
            sortBy: Joi.string()
                .valid("name", "date", "createdAt", "updatedAt")
                .default("createdAt"),
            sortOrder: Joi.string().valid("asc", "desc").default("desc"),
        }),
    },
};