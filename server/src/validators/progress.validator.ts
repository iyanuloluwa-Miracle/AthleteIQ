import Joi from 'joi'

export const progressSchema = Joi.object({
  pathwaySlug: Joi.string().trim().required()
    .messages({ 'any.required': 'Pathway slug is required' }),

  milestoneId: Joi.string().trim().required()
    .messages({ 'any.required': 'Milestone ID is required' }),

  milestoneTitle: Joi.string().trim().max(200).required()
    .messages({ 'any.required': 'Milestone title is required' }),

  status: Joi.string()
    .valid('not_started', 'in_progress', 'completed')
    .required()
    .messages({ 'any.required': 'Status is required' }),

  notes: Joi.string().trim().max(1000).optional().allow('')
})

export const roadmapProgressSchema = Joi.object({
  milestoneId: Joi.string().trim().required(),
  milestoneTitle: Joi.string().trim().max(200).required(),
  status: Joi.string().valid('not_started', 'in_progress', 'completed').required(),
  notes: Joi.string().trim().max(1000).optional().allow('')
})
