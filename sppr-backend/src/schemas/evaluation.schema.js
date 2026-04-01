import Ajv from 'ajv';

const ajv = new Ajv({ allErrors: true, removeAdditional: true });

export const validateUpsertEvaluation = ajv.compile({
  type: 'object',
  properties: {
    alternative_id: { type: 'integer', minimum: 1 },
    criterion_id: { type: 'integer', minimum: 1 },
    value: { type: 'number' },
  },
  required: ['alternative_id', 'criterion_id', 'value'],
  additionalProperties: false,
});
