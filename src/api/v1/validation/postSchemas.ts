import Joi, { ObjectSchema } from "joi";

// Post operation schemas organized by request part
export const postSchemas = {
    // POST /posts - Create new post
    create: {
        body: Joi.object({
            userId: Joi.string().required().messages({
                "any.required": "User ID is required",
                "string.empty": "User ID cannot be empty",
            }),
            content: Joi.string().required().messages({
                "any.required": "Content is required",
                "string.empty": "Content cannot be empty",
            }),
        }),
    },

    // GET /posts/:id - Get single post
    getById: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Post ID is required",
                "string.empty": "Post ID cannot be empty",
            }),
        }),
        query: Joi.object({
            include: Joi.string().valid("comments", "author").optional(),
        }),
    },

    // PUT /posts/:id - Update post
    update: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Post ID is required",
                "string.empty": "Post ID cannot be empty",
            }),
        }),
        body: Joi.object({
            content: Joi.string().optional().messages({
                "string.empty": "Content cannot be empty",
            }),
        }),
    },

    // DELETE /posts/:id - Delete post
    delete: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Post ID is required",
                "string.empty": "Post ID cannot be empty",
            }),
        }),
    },

    // GET /posts - List posts with filtering
    list: {
        query: Joi.object({
            page: Joi.number().integer().min(1).default(1),
            limit: Joi.number().integer().min(1).max(100).default(10),
            userId: Joi.string().optional(),
            sortBy: Joi.string()
                .valid("createdAt", "updatedAt")
                .default("createdAt"),
            sortOrder: Joi.string().valid("asc", "desc").default("desc"),
        }),
    },
};