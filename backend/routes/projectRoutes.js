const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const verifyToken = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');

// Public/Freelancer routes
router.get('/open', projectController.getAllOpenProjects);

// Client protected routes (MUST be before /:id to avoid conflict)
router.get('/client/my-projects', verifyToken, requireRole('CLIENT'), projectController.getClientProjects);
router.post('/', verifyToken, requireRole('CLIENT'), projectController.createProject);
router.put('/:id', verifyToken, requireRole('CLIENT'), projectController.updateProject);
router.delete('/:id', verifyToken, requireRole('CLIENT'), projectController.deleteProject);

// Generic single project route (LAST to avoid swallowing named routes)
router.get('/:id', projectController.getSingleProject);

module.exports = router;
