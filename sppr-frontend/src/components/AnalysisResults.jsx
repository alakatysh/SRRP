import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';

export default function AnalysisResults({ projectId }) {
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [method, setMethod] = useState('wsm');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (!projectId) return;
      setLoading(true);
      try {
        const response = await apiClient.get(
          `/analysis/${projectId}?method=${method}`,
        );
        setResults(response.data);
        setError('');
      } catch (err) {
        if (err.response && err.response.status === 400) {
          setError(err.response.data.message);
        } else {
          setError('Помилка сервера при розрахунку результатів.');
        }
        setResults(null);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [projectId, method]);

  if (!results && !loading && !error) return null;

  const topScore = results?.ranking[0]?.score || 1;

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 mt-8 font-sans">
      {/* Шапка */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Результати аналізу
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Ранжування альтернатив на основі обраних критеріїв
          </p>
        </div>

        <div className="mt-4 md:mt-0 flex items-center bg-gray-50 rounded-md border border-gray-200 px-3 py-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mr-3">
            Метод згортки
          </label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="bg-transparent text-sm font-bold text-gray-800 outline-none cursor-pointer"
          >
            <option value="wsm">WSM (Зважена сума)</option>
            <option value="wpm">WPM (Зважений добуток)</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-md">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-500 font-medium">Обчислення...</span>
        </div>
      )}

      {results && !loading && (
        <div className="space-y-8">
          {/* Аналітичний висновок (Строгий стиль) */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-2">
              <svg
                className="w-5 h-5 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <h3 className="font-bold text-indigo-900">
                Аналітичний висновок системи
              </h3>
            </div>
            <p className="text-indigo-800 text-sm leading-relaxed ml-7">
              {results.explanation}
            </p>
          </div>

          {/* Список результатів */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
              Детальний рейтинг
            </h4>

            <div className="space-y-3">
              {results.ranking.map((item, index) => {
                const isWinner = index === 0;
                const widthPercent =
                  topScore > 0 ? (item.score / topScore) * 100 : 0;

                return (
                  <div
                    key={item.alternative_id}
                    className={`relative p-4 rounded-lg border transition-all hover:shadow-md ${
                      isWinner
                        ? 'bg-yellow-50/50 border-yellow-300'
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    {isWinner && (
                      <div className="absolute -top-3 left-4 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wider">
                        Оптимальний вибір
                      </div>
                    )}

                    <div className="flex justify-between items-end mb-2">
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-lg font-bold ${isWinner ? 'text-yellow-600' : 'text-gray-400'}`}
                        >
                          #{index + 1}
                        </span>
                        <h3
                          className={`text-lg font-semibold ${isWinner ? 'text-gray-900' : 'text-gray-700'}`}
                        >
                          {item.name}
                        </h3>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-gray-500 uppercase mr-2">
                          Оцінка
                        </span>
                        <span
                          className={`text-xl font-mono font-bold ${isWinner ? 'text-gray-900' : 'text-gray-600'}`}
                        >
                          {item.score}
                        </span>
                      </div>
                    </div>

                    {/* Тонкий прогрес-бар */}
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${
                          isWinner ? 'bg-yellow-400' : 'bg-blue-500'
                        }`}
                        style={{ width: `${widthPercent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
