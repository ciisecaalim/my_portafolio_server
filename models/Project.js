const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    technologies: { type: [String], required: true },
    link: { type: String, default: '' },
    githubLink: { type: String, default: '' },
    image: { type: String, default: '' } // path or URL
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
