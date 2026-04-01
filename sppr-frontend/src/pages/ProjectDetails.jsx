import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';
import AnalysisResults from '../components/AnalysisResults';

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [alternatives, setAlternatives] = useState([]);
  const [criteria, setCriteria] = useState([]);
  const [evaluations, setEvaluations] = useState({});
  const [loading, setLoading] = useState(true);

  // Form states for new items
  const [newAltName, setNewAltName] = useState('');
  const [newCritName, setNewCritName] = useState('');
  const [newCritType, setNewCritType] = useState('maximize');
  const [newCritWeight, setNewCritWeight] = useState(0.1);

  const fetchData = useCallback(async () => {
    try {
      const [projRes, altRes, critRes, evalRes] = await Promise.all([
        apiClient.get(`/projects/${id}`),
        apiClient.get(`/alternatives?projectId=${id}`),
        apiClient.get(`/criteria?projectId=${id}`),
        apiClient.get(`/evaluations?projectId=${id}`),
      ]);

      setProject(projRes.data);
      setAlternatives(altRes.data);
      setCriteria(critRes.data);

      // Convert evaluations array into a lookup object for the matrix: {'altId-critId': value}
      const evalMap = {};
      evalRes.data.forEach((e) => {
        evalMap[`${e.alternative_id}-${e.criterion_id}`] = e.value;
      });
      setEvaluations(evalMap);
    } catch (err) {
      console.error('Failed to load project data', err);
      navigate('/');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- Project Actions ---
  const handleUpdateProject = async () => {
    const newName = prompt('Enter new project name:', project.name);
    if (!newName) return;
    await apiClient.patch(`/projects/${id}`, { name: newName });
    fetchData();
  };

  const handleDeleteProject = async () => {
    if (!window.confirm('Are you sure you want to delete this entire project?'))
      return;
    await apiClient.delete(`/projects/${id}`);
    navigate('/');
  };

  // --- Alternatives Actions ---
  const handleAddAlternative = async (e) => {
    e.preventDefault();
    const weightValue = parseFloat(newCritWeight);
    if (weightValue <= 0 || weightValue > 1) {
      alert('Помилка: Вага критерію має бути від 0.01 до 1!');
      return;
    }

    try {
      await apiClient.post('/criteria', {
        project_id: parseInt(id),
        name: newCritName,
        type: newCritType,
        weight: weightValue,
      });
      setNewCritName('');
      setNewCritWeight(0.1);
      fetchData();
    } catch (err) {
      console.error('Failed to add criterion', err);
      alert('Помилка при додаванні критерію');
    }
  };

  const handleDeleteAlternative = async (altId) => {
    if (!window.confirm('Delete this alternative?')) return;
    await apiClient.delete(`/alternatives/${altId}`);
    fetchData();
  };

  // --- Criteria Actions ---
  const handleAddCriterion = async (e) => {
    e.preventDefault();
    if (!newCritName) return;
    await apiClient.post('/criteria', {
      project_id: parseInt(id),
      name: newCritName,
      type: newCritType,
    });
    setNewCritName('');
    fetchData();
  };

  const handleDeleteCriterion = async (critId) => {
    if (!window.confirm('Delete this criterion?')) return;
    await apiClient.delete(`/criteria/${critId}`);
    fetchData();
  };

  // --- Matrix Actions ---
  const handleMatrixChange = async (altId, critId, value) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    try {
      await apiClient.put('/evaluations', {
        alternative_id: altId,
        criterion_id: critId,
        value: numValue,
      });
      // Update local state without full refetch for better UX
      setEvaluations((prev) => ({ ...prev, [`${altId}-${critId}`]: numValue }));
    } catch (err) {
      console.error('Failed to save evaluation', err);
      alert('Failed to save value');
    }
  };

  if (loading)
    return <div className="p-10 text-center">Loading workspace...</div>;
  if (!project) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <p className="text-gray-600 mt-2">{project.description}</p>
        </div>
        <div className="space-x-2">
          <button
            onClick={handleUpdateProject}
            className="bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300"
          >
            Edit
          </button>
          <button
            onClick={handleDeleteProject}
            className="bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Alternatives Panel */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold mb-4">Alternatives</h2>
          <ul className="mb-4 space-y-2">
            {alternatives.map((alt) => (
              <li
                key={alt.id}
                className="flex justify-between items-center bg-gray-50 p-2 rounded"
              >
                <span>{alt.name}</span>
                <button
                  onClick={() => handleDeleteAlternative(alt.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <form onSubmit={handleAddAlternative} className="flex gap-2">
            <input
              type="text"
              value={newAltName}
              onChange={(e) => setNewAltName(e.target.value)}
              placeholder="New alternative name..."
              className="flex-grow border p-2 rounded"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
            >
              Add
            </button>
          </form>
        </div>

        {/* Criteria Panel */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold mb-4">Criteria</h2>
          <ul className="mb-4 space-y-2">
            {criteria.map((crit) => (
              <li
                key={crit.id}
                className="flex justify-between items-center bg-gray-50 p-2 rounded"
              >
                <span>
                  {crit.name}{' '}
                  <span className="text-xs text-gray-500 uppercase ml-1">
                    ({crit.type}, w:{crit.weight})
                  </span>
                </span>
                <button
                  onClick={() => handleDeleteCriterion(crit.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <form onSubmit={handleAddCriterion} className="flex gap-2">
            <input
              type="text"
              value={newCritName}
              onChange={(e) => setNewCritName(e.target.value)}
              placeholder="New criteria name..."
              className="flex-grow border p-2 rounded"
              required
            />
            <select
              value={newCritType}
              onChange={(e) => setNewCritType(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="maximize">Max</option>
              <option value="minimize">Min</option>
            </select>
            {/* ДОДАЄМО ПОЛЕ ДЛЯ ВАГИ (від 0.01 до 1) */}
            <input
              type="number"
              step="0.01"
              min="0.01"
              max="1"
              value={newCritWeight}
              onChange={(e) => setNewCritWeight(e.target.value)}
              className="border p-2 rounded w-20 text-center"
              title="Вага критерію (від 0 до 1)"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
            >
              Add
            </button>
          </form>
        </div>
      </div>

      {/* Evaluation Matrix */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
        <h2 className="text-xl font-bold mb-4">Evaluation Matrix</h2>
        {alternatives.length === 0 || criteria.length === 0 ? (
          <p className="text-gray-500">
            Add at least one alternative and one criterion to build the matrix.
          </p>
        ) : (
          <table className="w-full text-left border-collapse">
            {/* ... весь твій код таблиці (thead, tbody) залишається без змін ... */}
            <tbody>
              {alternatives.map((alt) => (
                <tr key={alt.id} className="hover:bg-gray-50">
                  <td className="border-b p-3 font-medium text-gray-800">
                    {alt.name}
                  </td>
                  {criteria.map((crit) => {
                    const cellKey = `${alt.id}-${crit.id}`;
                    return (
                      <td key={cellKey} className="border-b p-2">
                        <input
                          type="number"
                          step="any"
                          defaultValue={evaluations[cellKey] ?? ''}
                          onBlur={(e) =>
                            handleMatrixChange(alt.id, crit.id, e.target.value)
                          }
                          className="w-full border border-gray-300 rounded p-1 text-center focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                          placeholder="0.0"
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* НОВИЙ РЯДОК: Додаємо аналітичний блок унизу */}
      <AnalysisResults projectId={id} />
    </div>
  );
}
