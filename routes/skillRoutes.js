const express = require('express');
const router = express.Router();
const { getSkills, addSkill, updateSkill, deleteSkill } = require('../controllers/skillController');

// In a real app, you would add authentication middleware here for CUD operations
// const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getSkills);
router.post('/', addSkill);       // Add protect/admin middleware if available
router.put('/:id', updateSkill);  // Add protect/admin middleware if available
router.delete('/:id', deleteSkill); // Add protect/admin middleware if available

module.exports = router;
