const Developer = require('../models/developerModel');

const createDeveloper = async (req, res) => {
    try {
        const developer = new Developer(req.body);
        await developer.save();
        res.status(201).json(developer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getDevelopers = async (req, res) => {
    try {
        const { specialization, available } = req.query;
        let filter = {};
        if (specialization) filter.specializations = specialization;
        if (available !== undefined) filter.available = available === 'true';

        const developers = await Developer.find(filter);
        res.status(200).json(developers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getDeveloperById = async (req, res) => {
    try {
        const developer = await Developer.findById(req.params.id);
        if (!developer) return res.status(404).json({ message: "Developer not found" });
        res.status(200).json(developer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateDeveloper = async (req, res) => {
    try {
        const developer = await Developer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!developer) return res.status(404).json({ message: "Developer not found" });
        res.status(200).json(developer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteDeveloper = async (req, res) => {
    try {
        const developer = await Developer.findByIdAndDelete(req.params.id);
        if (!developer) return res.status(404).json({ message: "Developer not found" });
        res.status(200).json({ message: "Developer deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createDeveloper,
    getDevelopers,
    getDeveloperById,
    updateDeveloper,
    deleteDeveloper
};
