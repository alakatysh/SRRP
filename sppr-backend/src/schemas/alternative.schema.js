import Ajv from 'ajv';

const ajv = new Ajv({ allErrors: true, removeAdditional: true });

export const validateCreateAlternative = ajv.compile({
  type: 'object',
  properties: {
    project_id: { type: 'integer', minimum: 1 },
    name: { type: 'string', minLength: 1, maxLength: 255 },
    description: { type: 'string' },
  },
  required: ['project_id', 'name'],
  additionalProperties: false,
});

export const validateUpdateAlternative = ajv.compile({
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1, maxLength: 255 },
    description: { type: 'string' },
  },
  anyOf: [{ required: ['name'] }, { required: ['description'] }],
  additionalProperties: false,
});
