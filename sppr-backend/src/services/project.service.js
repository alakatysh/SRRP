import * as projectRepo from '../repositories/project.repository.js';

export const getAllProjects = async () => {
  return await projectRepo.findAll();
};

export const getProjectById = async (id) => {
  const project = await projectRepo.findById(id);
  if (!project) {
    throw new Error('PROJECT_NOT_FOUND');
  }
  return project;
};

export const createProject = async (data) => {
  const { name, description } = data;
  const insertId = await projectRepo.create(name, description);
  return { id: insertId, name, description };
};

export const updateProject = async (id, data) => {
  const { name, description } = data;
  const updated = await projectRepo.update(id, name, description);
  if (!updated) {
    throw new Error('PROJECT_NOT_FOUND');
  }
  return true;
};

export const deleteProject = async (id) => {
  const deleted = await projectRepo.remove(id);
  if (!deleted) {
    throw new Error('PROJECT_NOT_FOUND');
  }
  return true;
};
