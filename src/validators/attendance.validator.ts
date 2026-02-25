import Joi from 'joi';

export const createAttendanceSchema = Joi.object({
    employee_id: Joi.number().integer().positive().required().messages({
        'any.required': 'Employee ID is required',
    }),
    date: Joi.date().iso().required().messages({
        'any.required': 'Date is required',
        'date.format': 'Date must be in YYYY-MM-DD format',
    }),
    check_in_time: Joi.string()
        .pattern(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/)
        .required()
        .messages({
            'any.required': 'Check-in time is required',
            'string.pattern.base': 'Check-in time must be in HH:MM or HH:MM:SS format',
        }),
});

export const updateAttendanceSchema = Joi.object({
    employee_id: Joi.number().integer().positive(),
    date: Joi.date().iso(),
    check_in_time: Joi.string()
        .pattern(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/)
        .messages({
            'string.pattern.base': 'Check-in time must be in HH:MM or HH:MM:SS format',
        }),
}).min(1);

export const reportQuerySchema = Joi.object({
    month: Joi.string()
        .pattern(/^\d{4}-(0[1-9]|1[0-2])$/)
        .required()
        .messages({
            'any.required': 'Month is required',
            'string.pattern.base': 'Month must be in YYYY-MM format',
        }),
    employee_id: Joi.number().integer().positive().optional(),
});
