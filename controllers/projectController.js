const Project = require('../models/Project');

// Get all projects
exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });
        res.json(projects);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// Create project
exports.createProject = async (req, res) => {
    try {
        const { title, description, technologies, link, githubLink } = req.body;

        if(!title || !description){
            return res.status(400).json({ message: "Title and description are required" });
        }

        const project = new Project({
            title,
            description,
            technologies: technologies ? technologies.split(',').map(t => t.trim()) : [],
            link: link || '',
            githubLink: githubLink || '',
            image: req.file ? req.file.path.replace(/\\/g, '/') : ''
        });

        const newProject = await project.save();
        res.status(201).json(newProject);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
