import Joi from 'joi'

export const feedbackSchema = Joi.object({
  recommendationId: Joi.string().hex().length(24).required()
    .messages({ 'any.required': 'Recommendation ID is required' }),

  pathwaySlug: Joi.string().trim().required()
    .messages({ 'any.required': 'Pathway slug is required' }),

  rating: Joi.number().integer().min(1).max(5).required()
    .messages({ 'any.required': 'Rating is required (1–5)' }),

  interested: Joi.boolean().required()
    .messages({ 'any.required': 'Interest indicator is required' }),

  comment: Joi.string().trim().max(1000).optional().allow('')
})
