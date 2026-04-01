import * as alternativeRepo from '../repositories/alternative.repository.js';
import * as criterionRepo from '../repositories/criterion.repository.js';
import * as evaluationRepo from '../repositories/evaluation.repository.js';

export const calculateProjectResults = async (projectId, method = 'wsm') => {
  const alternatives = await alternativeRepo.findByProjectId(projectId);
  const criteria = await criterionRepo.findByProjectId(projectId);
  const evaluations = await evaluationRepo.findByProjectId(projectId);

  if (!alternatives.length || !criteria.length || !evaluations.length) {
    throw new Error('INCOMPLETE_DATA');
  }

  const criteriaExtremes = {};
  criteria.forEach((c) => {
    const values = evaluations
      .filter((e) => e.criterion_id === c.id)
      .map((e) => Number(e.value));

    criteriaExtremes[c.id] = {
      min: Math.min(...values),
      max: Math.max(...values),
    };
  });

  const results = alternatives.map((alt) => {
    let totalScore = method === 'wpm' ? 1 : 0; // Для добутку стартуємо з 1, для суми з 0
    const details = [];

    criteria.forEach((crit) => {
      const evalRecord = evaluations.find(
        (e) => e.alternative_id === alt.id && e.criterion_id === crit.id,
      );
      const rawValue = evalRecord ? Number(evalRecord.value) : 0;
      const { min, max } = criteriaExtremes[crit.id];
      const weight = Number(crit.weight);

      let normValue = 0;

      if (max === min) {
        normValue = 1;
      } else if (crit.type === 'maximize') {
        normValue = (rawValue - min) / (max - min);
      } else if (crit.type === 'minimize') {
        normValue = (max - rawValue) / (max - min);
      }

      let weightedScore;
      if (method === 'wpm') {
        const safeNorm = normValue === 0 ? 0.0001 : normValue;
        weightedScore = Math.pow(safeNorm, weight);
        totalScore *= weightedScore;
      } else {
        weightedScore = normValue * weight;
        totalScore += weightedScore;
      }

      details.push({
        criterion_id: crit.id,
        criterion_name: crit.name,
        raw_value: rawValue,
        normalized_value: Number(normValue.toFixed(4)),
        weighted_score: Number(weightedScore.toFixed(4)),
      });
    });

    return {
      alternative_id: alt.id,
      name: alt.name,
      score: Number(totalScore.toFixed(4)),
      details,
    };
  });

  results.sort((a, b) => b.score - a.score);

  const winner = results[0];

  const strongPoints = winner.details
    .sort((a, b) => b.normalized_value - a.normalized_value)
    .slice(0, 2)
    .map((d) => d.criterion_name);

  const methodName = method === 'wpm' ? 'зваженого добутку' : 'зваженої суми';
  const explanation =
    `За алгоритмом ${methodName}, альтернатива "${winner.name}" є найкращим вибором з фінальною оцінкою ${winner.score}. ` +
    `Вона здобула лідерство переважно завдяки відмінним показникам за критеріями: ${strongPoints.join(' та ')}.`;

  return {
    method: method.toUpperCase(),
    ranking: results,
    explanation,
  };
};
