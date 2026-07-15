const express = require('express');
const { uploadZip, importGithub, listProjects, getProject, removeProject, listProjectFiles, listProjectReviews, updateProjectFile } = require('../controllers/project.controller');
const { protect } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

const router = express.Router();

// Apply auth protection globally to all project routes
router.use(protect);

router.post('/upload', upload.single('file'), uploadZip);
router.post('/github', importGithub);
router.get('/', listProjects);
router.get('/:id', getProject);
router.get('/:id/files', listProjectFiles);
router.put('/:id/files', updateProjectFile);
router.get('/:id/reviews', listProjectReviews);
router.delete('/:id', removeProject);

module.exports = router;
