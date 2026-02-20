const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a skill name']
    },
    level: {
        type: Number,
        required: [true, 'Please add a proficiency level (0-100)'],
        min: 0,
        max: 100
    },
    icon: {
        type: String, // Optional: store icon class name or url
        default: ''
    }
}, { timestamps: true });

module.exports = mongoose.model('Skill', SkillSchema);
