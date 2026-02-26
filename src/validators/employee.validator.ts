import Joi from 'joi';

export const createEmployeeSchema = Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
        'any.required': 'Employee name is required',
        'string.min': 'Name must be at least 2 characters',
    }),
    age: Joi.number().integer().min(18).max(65).required().messages({
        'any.required': 'Age is required',
        'number.min': 'Employee must be at least 18 years old',
        'number.max': 'Employee must be at most 65 years old',
    }),
    designation: Joi.string().min(2).max(100).required().messages({
        'any.required': 'Designation is required',
    }),
    hiring_date: Joi.date().iso().required().messages({
        'any.required': 'Hiring date is required',
        'date.format': 'Hiring date must be in YYYY-MM-DD format',
    }),
    date_of_birth: Joi.date().iso().required().messages({
        'any.required': 'Date of birth is required',
        'date.format': 'Date of birth must be in YYYY-MM-DD format',
    }),
    salary: Joi.number().positive().required().messages({
        'any.required': 'Salary is required',
        'number.positive': 'Salary must be a positive number',
    }),
}).options({ allowUnknown: true, stripUnknown: true });

export const updateEmployeeSchema = Joi.object({
    name: Joi.string().min(2).max(100),
    age: Joi.number().integer().min(18).max(65),
    designation: Joi.string().min(2).max(100),
    hiring_date: Joi.date().iso(),
    date_of_birth: Joi.date().iso(),
    salary: Joi.number().positive(),
}).min(1).options({ allowUnknown: true, stripUnknown: true });
