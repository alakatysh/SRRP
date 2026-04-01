import Ajv from 'ajv';

const ajv = new Ajv({ allErrors: true, removeAdditional: true });

export const validateCreateCriterion = ajv.compile({
  type: 'object',
  properties: {
    project_id: { type: 'integer', minimum: 1 },
    name: { type: 'string', minLength: 1, maxLength: 255 },
    type: { type: 'string', enum: ['maximize', 'minimize'] },
    weight: { type: 'number', minimum: 0, maximum: 1 },
    description: { type: 'string' },
  },
  required: ['project_id', 'name', 'type'],
  additionalProperties: false,
});

export const validateUpdateCriterion = ajv.compile({
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1, maxLength: 255 },
    type: { type: 'string', enum: ['maximize', 'minimize'] },
    weight: { type: 'number', minimum: 0, maximum: 1 },
    description: { type: 'string' },
  },
  anyOf: [
    { required: ['name'] },
    { required: ['type'] },
    { required: ['weight'] },
    { required: ['description'] },
  ],
  additionalProperties: false,
});
