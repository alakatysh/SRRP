import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../api/client';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await apiClient.get('/projects');
      setProjects(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to fetch projects.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await apiClient.post('/projects', { name, description });
      setName('');
      setDescription('');
      fetchProjects();
    } catch (err) {
      console.error('Error creating project:', err);
      setError('Failed to create project.');
    }
  };

  if (loading)
    return <div className="text-center py-10">Loading projects...</div>;

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold mb-4">Create New Project</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={handleCreateProject} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
              rows="3"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create Project
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Your Projects</h2>
        {projects.length === 0 ? (
          <p className="text-gray-500">No projects found. Create one above.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col"
              >
                <h3 className="text-lg font-bold mb-2">{project.name}</h3>
                <p className="text-gray-600 flex-grow mb-4">
                  {project.description}
                </p>
                <Link
                  to={`/projects/${project.id}`}
                  className="text-center bg-gray-100 text-blue-600 px-4 py-2 rounded hover:bg-gray-200 font-medium transition-colors"
                >
                  Open Workspace
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
