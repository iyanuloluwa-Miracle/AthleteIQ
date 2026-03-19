import Joi from 'joi'

export const questionnaireSchema = Joi.object({
  academic_level: Joi.string()
    .valid('Year 1', 'Year 2', 'Year 3', 'Year 4', 'Postgraduate', 'Professional')
    .required()
    .messages({ 'any.required': 'Academic level is required' }),

  primary_sport: Joi.string().trim().min(2).max(100).required()
    .messages({ 'any.required': 'Primary sport is required' }),

  participation_years: Joi.string()
    .valid('< 1', '1-2', '3-5', '> 5')
    .required()
    .messages({ 'any.required': 'Participation years is required' }),

  participation_level: Joi.string()
    .valid('Not active', 'Recreational', 'Club', 'Regional', 'National', 'Elite')
    .required()
    .messages({ 'any.required': 'Participation level is required' }),

  fitness_level: Joi.number().integer().min(1).max(5).required()
    .messages({ 'any.required': 'Fitness level is required' }),

  technical_skill: Joi.number().integer().min(1).max(5).required()
    .messages({ 'any.required': 'Technical skill is required' }),

  leadership: Joi.number().integer().min(1).max(5).required()
    .messages({ 'any.required': 'Leadership rating is required' }),

  data_comfort: Joi.number().integer().min(1).max(5).required()
    .messages({ 'any.required': 'Data comfort rating is required' }),

  motivation: Joi.string()
    .valid('Competition', 'Health', 'Coaching', 'Academic', 'Fame')
    .required()
    .messages({ 'any.required': 'Motivation is required' }),

  career_importance: Joi.string()
    .valid(
      'Financial security',
      'Passion & purpose',
      'Work-life balance',
      'Career progression',
      'Social impact'
    )
    .required()
    .messages({ 'any.required': 'Career importance is required' }),

  work_environment: Joi.string()
    .valid('Field', 'Office', 'Lab', 'Media', 'Mixed')
    .required()
    .messages({ 'any.required': 'Work environment is required' }),

  biggest_challenge: Joi.string()
    .valid(
      'Lack of experience',
      'Academic pressure',
      'Financial constraints',
      'Injury & health',
      'Networking gaps',
      'Unclear goals'
    )
    .required()
    .messages({ 'any.required': 'Biggest challenge is required' }),

  injury_history: Joi.string()
    .valid('No injuries', 'Minor injuries', 'Significant injuries', 'Career-limiting injury')
    .required()
    .messages({ 'any.required': 'Injury history is required' }),

  career_interests: Joi.array()
    .items(Joi.string().trim())
    .min(1)
    .max(3)
    .required()
    .messages({
      'any.required': 'Career interests are required',
      'array.min': 'Select at least 1 career interest',
      'array.max': 'Select at most 3 career interests'
    })
})
