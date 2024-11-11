const express = require('express');
const {createTask} = require('../controllers/taskController')
const {deleteTask} = require('../controllers/taskController')
const {updateTask} = require('../controllers/taskController')
const {getTask} = require('../controllers/taskController')
const {getAllTasks} = require('../controllers/taskController')
const {getTasksByProject} = require('../controllers/taskController')
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/create', authMiddleware, createTask)
router.delete('/delete/:id', authMiddleware, deleteTask)
router.put('/update/:id', authMiddleware, updateTask)
router.get('/:id', authMiddleware, getTask)
router.get('/', authMiddleware, getAllTasks)
router.get('/project/:projectId', authMiddleware, getTasksByProject)

module.exports = router;

