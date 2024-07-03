import express from "express";
import PortfolioModel from './portfolio.schema.js'
import fetchuser from "../../middleware/fetchuser.js";

const router = express.Router();

router.get('/receive', async (req, res) => {
    try {
        const projects = await PortfolioModel.find();
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET one project by ID
//   router.get('/projects/:id', async (req, res) => {
//     const { id } = req.params;
//     try {
//       const project = await PortfolioModel.findById(id);
//       if (!project) {
//         return res.status(404).json({ message: 'Project not found' });
//       }
//       res.json(project);
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   });

// POST create a new project
router.post('/upload/users', async (req, res) => {
    try {
        const portfolio = await PortfolioModel.findById(req.body.portfolioId);
        if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });
        portfolio.users.push(req.body.user); // Assuming req.body.user contains a single user object
        await portfolio.save();
        res.status(201).json(portfolio);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// POST route for projects
router.post('/upload/projects', async (req, res) => {
    try {
        const portfolio = await PortfolioModel.findById(req.body.portfolioId);
        if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });
        portfolio.projects.push(req.body.project); // Assuming req.body.project contains a single project object
        await portfolio.save();
        res.status(201).json(portfolio);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// POST route for experiences
router.post('/upload/experiences', async (req, res) => {
    try {
        const portfolio = await PortfolioModel.findById(req.body.portfolioId);
        if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });
        portfolio.experiences.push(req.body.experience); // Assuming req.body.experience contains a single experience object
        await portfolio.save();
        res.status(201).json(portfolio);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// POST route for educations
router.post('/upload/educations', async (req, res) => {
    try {
        const portfolio = await PortfolioModel.findById(req.body.portfolioId);
        if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });
        portfolio.educations.push(req.body.education); // Assuming req.body.education contains a single education object
        await portfolio.save();
        res.status(201).json(portfolio);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// POST route for skills
router.post('/upload/skills', async (req, res) => {
    try {
        const portfolio = await PortfolioModel.findById(req.body.portfolioId);
        if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });
        portfolio.skills.push(req.body.skill); // Assuming req.body.skill contains a single skill object
        await portfolio.save();
        res.status(201).json(portfolio);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


// PUT update a project by ID
const updatePortfolioItem = async (req, res, item) => {
    const { id } = req.params;
    try {
        const updateQuery = {};
        updateQuery[`${item}.$`] = req.body;
        const updatedItem = await PortfolioModel.updateOne(
            { [`${item}._id`]: id },
            { $set: updateQuery },
            { new: true }
        );
        if (!updatedItem) {
            return res.status(404).json({ message: `${item} not found` });
        }
        res.json(updatedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Routes
router.put('/users/:id', (req, res) => updatePortfolioItem(req, res, 'users'));
router.put('/projects/:id', (req, res) => updatePortfolioItem(req, res, 'projects'));
router.put('/experiences/:id', (req, res) => updatePortfolioItem(req, res, 'experiences'));
router.put('/educations/:id', (req, res) => updatePortfolioItem(req, res, 'educations'));
router.put('/skills/:id', (req, res) => updatePortfolioItem(req, res, 'skills'));

// DELETE a project by ID
router.delete('/projects/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedProject = await PortfolioModel.findByIdAndDelete(id);
        if (!deletedProject) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
export default router;