const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const verifyToken = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');

// Public/Freelancer routes
router.get('/open', projectController.getAllOpenProjects);
router.get('/:id', projectController.getSingleProject);

// Client protected routes
router.post('/', verifyToken, requireRole('CLIENT'), projectController.createProject);
router.get('/client/my-projects', verifyToken, requireRole('CLIENT'), projectController.getClientProjects);
router.put('/:id', verifyToken, requireRole('CLIENT'), projectController.updateProject);
router.delete('/:id', verifyToken, requireRole('CLIENT'), projectController.deleteProject);

module.exports = router;
