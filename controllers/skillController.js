const Skill = require('../models/Skill');

// @desc    Get all skills
// @route   GET /api/skills
// @access  Public
exports.getSkills = async (req, res) => {
    try {
        const skills = await Skill.find().sort({ level: -1 });
        res.status(200).json(skills);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Add a skill
// @route   POST /api/skills
// @access  Private (Admin)
exports.addSkill = async (req, res) => {
    try {
        const { name, level, icon } = req.body;
        const newSkill = await Skill.create({ name, level, icon });
        res.status(201).json(newSkill);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// @desc    Update a skill
// @route   PUT /api/skills/:id
// @access  Private (Admin)
exports.updateSkill = async (req, res) => {
    try {
        const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!skill) return res.status(404).json({ message: 'Skill not found' });
        res.status(200).json(skill);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// @desc    Delete a skill
// @route   DELETE /api/skills/:id
// @access  Private (Admin)
exports.deleteSkill = async (req, res) => {
    try {
        const skill = await Skill.findByIdAndDelete(req.params.id);
        if (!skill) return res.status(404).json({ message: 'Skill not found' });
        res.status(200).json({ message: 'Skill deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
