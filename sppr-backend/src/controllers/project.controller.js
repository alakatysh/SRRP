import * as projectService from '../services/project.service.js';

export const getProjects = async (req, res, next) => {
  try {
    const projects = await projectService.getAllProjects();
    res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (req, res, next) => {
  try {
    const project = await projectService.getProjectById(req.params.id);
    res.status(200).json(project);
  } catch (error) {
    if (error.message === 'PROJECT_NOT_FOUND') {
      return res.status(404).json({ message: 'Project not found' });
    }
    next(error);
  }
};

export const createProject = async (req, res, next) => {
  try {
    const project = await projectService.createProject(req.body);
    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    await projectService.updateProject(req.params.id, req.body);
    res.status(200).json({ message: 'Project updated successfully' });
  } catch (error) {
    if (error.message === 'PROJECT_NOT_FOUND') {
      return res.status(404).json({ message: 'Project not found' });
    }
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    await projectService.deleteProject(req.params.id);
    res.status(204).send();
  } catch (error) {
    if (error.message === 'PROJECT_NOT_FOUND') {
      return res.status(404).json({ message: 'Project not found' });
    }
    next(error);
  }
};
