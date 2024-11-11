const express = require('express');
const { createProject } = require('../controllers/projectController');
const { updateproject } = require('../controllers/projectController');
const { deleteProject } = require('../controllers/projectController');
const { getproject } = require('../controllers/projectController');
const { getAllprojects } = require('../controllers/projectController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/create', authMiddleware, createProject);
router.post('/update/:id', authMiddleware, updateproject);
router.delete('/delete/:id', authMiddleware, deleteProject);
router.get('/:id', authMiddleware, getproject);
router.get('/', authMiddleware, getAllprojects);

module.exports = router;
