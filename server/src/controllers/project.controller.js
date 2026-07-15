const { createProject, getProjectsByUser, getProjectById, deleteProject } = require('../services/project.service');
const { cloneRepository } = require('../services/github.service');
const { extractZip } = require('../utils/fileExtractor');
const { sendSuccess, sendError } = require('../utils/response');
const path = require('path');
const fs = require('fs');

const uploadZip = async (req, res, next) => {
  if (!req.file) {
    return sendError(res, 'No ZIP archive file provided', {}, 400);
  }

  const { name, language } = req.body;
  if (!name || !language) {
    // Cleanup uploaded raw zip
    fs.unlinkSync(req.file.path);
    return sendError(res, 'Project name and language are required', {}, 400);
  }

  const zipFilePath = req.file.path;
  const projectDirName = `${Date.now()}-${name.replace(/\s+/g, '_')}`;
  const outputDir = path.join(__dirname, '../../uploads/extracted', projectDirName);

  try {
    // Extract archive
    await extractZip(zipFilePath, outputDir);
    
    // Cleanup temporary zip file
    fs.unlinkSync(zipFilePath);

    // Save project
    const project = await createProject(
      req.user.id,
      name,
      language,
      'zip',
      outputDir
    );

    return sendSuccess(res, 'Project ZIP uploaded and extracted successfully', project, 201);
  } catch (error) {
    // Cleanup files on failure safely
    try {
      if (fs.existsSync(zipFilePath)) fs.unlinkSync(zipFilePath);
    } catch (err) {}
    try {
      if (fs.existsSync(outputDir)) fs.rmSync(outputDir, { recursive: true, force: true });
    } catch (err) {}
    return sendError(res, error.message, {}, 500);
  }
};

const importGithub = async (req, res, next) => {
  const { repoUrl, name, language } = req.body;

  if (!repoUrl || !name || !language) {
    return sendError(res, 'GitHub repoUrl, project name and language are required', {}, 400);
  }

  const projectDirName = `${Date.now()}-${name.replace(/\s+/g, '_')}`;
  const targetDir = path.join(__dirname, '../../uploads/github', projectDirName);

  try {
    await cloneRepository(repoUrl, targetDir);

    const project = await createProject(
      req.user.id,
      name,
      language,
      'github',
      targetDir,
      repoUrl
    );

    return sendSuccess(res, 'GitHub repository imported successfully', project, 201);
  } catch (error) {
    try {
      if (fs.existsSync(targetDir)) fs.rmSync(targetDir, { recursive: true, force: true });
    } catch (err) {}
    return sendError(res, error.message, {}, 500);
  }
};

const listProjects = async (req, res, next) => {
  try {
    const projects = await getProjectsByUser(req.user.id);
    return sendSuccess(res, 'Projects listed successfully', projects);
  } catch (error) {
    return sendError(res, 'Failed to fetch projects list', error.message);
  }
};

const getProject = async (req, res, next) => {
  const { id } = req.params;
  try {
    const project = await getProjectById(id, req.user.id);
    return sendSuccess(res, 'Project details loaded', project);
  } catch (error) {
    return sendError(res, error.message, {}, 404);
  }
};

const removeProject = async (req, res, next) => {
  const { id } = req.params;
  try {
    const deleted = await deleteProject(id, req.user.id);
    return sendSuccess(res, 'Project removed successfully', deleted);
  } catch (error) {
    return sendError(res, error.message, {}, 404);
  }
};

const listProjectFiles = async (req, res, next) => {
  const { id } = req.params;
  try {
    const { getProjectFiles } = require('../services/project.service');
    const files = await getProjectFiles(id, req.user.id);
    return sendSuccess(res, 'Project files loaded successfully', files);
  } catch (error) {
    return sendError(res, error.message, {}, 404);
  }
};

const listProjectReviews = async (req, res, next) => {
  const { id } = req.params;
  try {
    const { getReviewsByProject } = require('../services/review.service');
    const reviews = await getReviewsByProject(id, req.user.id);
    return sendSuccess(res, 'Project reviews loaded successfully', reviews);
  } catch (error) {
    return sendError(res, error.message, {}, 404);
  }
};

const updateProjectFile = async (req, res, next) => {
  const { id } = req.params;
  const { filePath, content } = req.body;

  if (!filePath || content === undefined) {
    return sendError(res, 'filePath and content parameters are required', {}, 400);
  }

  try {
    const project = await getProjectById(id, req.user.id);
    const absolutePath = path.resolve(project.projectPath, filePath);

    // Guard against path traversal attacks
    const relative = path.relative(project.projectPath, absolutePath);
    if (relative.startsWith('..') || path.isAbsolute(relative)) {
      return sendError(res, 'Forbidden file path or directory access', {}, 403);
    }

    fs.writeFileSync(absolutePath, content, 'utf8');
    return sendSuccess(res, 'File updated and saved successfully', { filePath }, 200);
  } catch (error) {
    return sendError(res, error.message, {}, 500);
  }
};

module.exports = {
  uploadZip,
  importGithub,
  listProjects,
  getProject,
  removeProject,
  listProjectFiles,
  listProjectReviews,
  updateProjectFile
};
