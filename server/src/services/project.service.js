const Project = require('../models/Project');
const fs = require('fs');
const path = require('path');

const SUPPORTED_EXTENSIONS = ['.js', '.ts', '.py', '.java', '.cpp', '.h', '.go', '.cs', '.rs', '.css', '.html'];

const getDirectoryFiles = (dirPath, baseDir) => {
  let results = [];
  if (!fs.existsSync(dirPath)) return results;

  const list = fs.readdirSync(dirPath);
  list.forEach((file) => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getDirectoryFiles(filePath, baseDir));
    } else {
      const ext = path.extname(file).toLowerCase();
      if (SUPPORTED_EXTENSIONS.includes(ext)) {
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          const relPath = path.relative(baseDir, filePath).replace(/\\/g, '/');
          results.push({ path: relPath, content });
        } catch (e) {
          // Ignore unreadable files
        }
      }
    }
  });
  return results;
};

const createProject = async (userId, name, language, uploadType, projectPath, repositoryUrl = '') => {
  const project = await Project.create({
    userId,
    name,
    language,
    uploadType,
    projectPath,
    repositoryUrl,
    status: 'uploaded'
  });
  return project;
};

const getProjectsByUser = async (userId) => {
  return Project.find({ userId }).sort({ createdAt: -1 });
};

const getProjectById = async (projectId, userId) => {
  const project = await Project.findOne({ _id: projectId, userId });
  if (!project) {
    throw new Error('Project not found');
  }
  return project;
};

const getProjectFiles = async (projectId, userId) => {
  const project = await Project.findOne({ _id: projectId, userId });
  if (!project) {
    throw new Error('Project not found');
  }

  if (!fs.existsSync(project.projectPath)) {
    if (project.uploadType === 'github' && project.repositoryUrl) {
      const { cloneRepository } = require('./github.service');
      try {
        await cloneRepository(project.repositoryUrl, project.projectPath);
      } catch (cloneErr) {
        throw new Error(`Failed to restore project from GitHub: ${cloneErr.message}`);
      }
    } else {
      throw new Error('Project source files not found on the server. Since this project was uploaded as a ZIP, please re-upload the ZIP archive.');
    }
  }

  return getDirectoryFiles(project.projectPath, project.projectPath);
};

const deleteProject = async (projectId, userId) => {
  const project = await Project.findOne({ _id: projectId, userId });
  if (!project) {
    throw new Error('Project not found');
  }

  // Delete local folder storage if exists
  if (fs.existsSync(project.projectPath)) {
    try {
      fs.rmSync(project.projectPath, { recursive: true, force: true });
    } catch (err) {
      // Log delete error silently
    }
  }

  await Project.deleteOne({ _id: projectId });
  return { id: projectId };
};

module.exports = {
  createProject,
  getProjectsByUser,
  getProjectById,
  getProjectFiles,
  deleteProject
};
