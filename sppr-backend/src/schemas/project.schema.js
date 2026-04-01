import Ajv from 'ajv';

const ajv = new Ajv({ allErrors: true, removeAdditional: true });

const createProjectSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1, maxLength: 255 },
    description: { type: 'string' },
  },
  required: ['name'],
  additionalProperties: false,
};

const updateProjectSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1, maxLength: 255 },
    description: { type: 'string' },
  },
  anyOf: [{ required: ['name'] }, { required: ['description'] }],
  additionalProperties: false,
};

export const validateCreateProject = ajv.compile(createProjectSchema);
export const validateUpdateProject = ajv.compile(updateProjectSchema);
