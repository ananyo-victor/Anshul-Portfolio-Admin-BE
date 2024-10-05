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

router.post('/create-dummy', fetchuser, async (req, res) => {
    try {
        const { users, projects, experiences, educations, skills } = req.body;
        const userId = req.user.id
        const dummy = new PortfolioModel({ userId, users, projects, experiences, educations, skills });
        await dummy.save();
        return res.status(201).send({ message: "User created" });
    }
    catch (error) {
        return res.status(500).send({ message: `Error creating user: ${error.message}` });
    }
});

// POST create a new project
router.post('/upload/users', async (req, res) => {
    try {
        const portfolio = await PortfolioModel.findById(req.body.portfolioId);
        console.log(req.body);
        if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });
        delete req.body.user._id;
        portfolio.users = req.body.user; // Assuming req.body.user contains a single user object
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
        delete req.body.project._id;
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
        delete req.body.experience._id;
        req.body.experience.skills.forEach(skill => {
            delete skill._id;  // Ensure no _id in the skills array
        });
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
        delete req.body.education._id;
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
        delete req.body.skill._id;
        req.body.skill.tools.forEach(tool => {
            delete tool._id;  // Ensure no _id in the skills array
        });
        portfolio.skills.push(req.body.skill); // Assuming req.body.skill contains a single skill object
        await portfolio.save();
        res.status(201).json(portfolio);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Separate PUT route for updating users
router.put('/users/:id', async (req, res) => {
    const userId = req.params.id; // The user ID from the URL parameter
    try {
        // Find the portfolio that contains this user
        const portfolio = await PortfolioModel.findOne({ 'users._id': userId });

        if (!portfolio) {
            return res.status(404).json({ message: 'User not found in portfolio' });
        }

        // Update the user object within the portfolio's users field
        portfolio.users = {
            ...portfolio.users,
            ...req.body, // Merge updated user data from request body
        };

        // Save the updated portfolio
        const updatedPortfolio = await portfolio.save();
        res.json(updatedPortfolio);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(400).json({ message: error.message });
    }
});


// const updateUserItem = async (req, res) => {
//     const { id } = req.params;
//     try {
//         console.log(JSON.stringify(req.body) + " " + id);

//         const updatedItem = await PortfolioModel.updateOne({ _id: id },
//             { users: req.body },
//             { new: true });

//         if (updatedItem.modifiedCount === 0) {
//             return res.status(404).json({ message: `${item} not found or no changes made` });
//         }
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };
// PUT update a project by ID
const updatePortfolioItem = async (req, res, item) => {
    const { id } = req.params;
    try {
        let updateQuery = {};
        let queryCondition = {};

        if (item === 'users') {
            console.log(JSON.stringify(req.body) + " " + id);

            // For single object like 'users', update directly
            updateQuery = { users: req.body };  // Directly update 'users'
            queryCondition = { _id: id };  // Find portfolio by its ID
        } else {
            // For arrays like 'projects', 'experiences', etc.
            updateQuery[`${item}.$`] = req.body;  // Use positional operator for arrays
            queryCondition = { [`${item}._id`]: id };  // Match array item by its _id
        }

        const updatedItem = await PortfolioModel.updateOne(
            queryCondition,
            { $set: updateQuery },
            { new: true }
        );

        if (updatedItem.modifiedCount === 0) {
            return res.status(404).json({ message: `${item} not found or no changes made` });
        }

        res.json(updatedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// const updatePortfolioItem = async (req, res, item) => {
//     const { id } = req.params;
//     try {
//         let updateQuery = {};
//         let queryCondition = { _id: id }; // Portfolio document _id to match

//         if (item === 'users') {
//             // Check for errors when updating 'users'
//             try {
//                 // Directly update the 'users' field since it's a single object, not an array
//                 updateQuery = { users: req.body }; // Set the updated user details
//                 const updatedItem = await PortfolioModel.updateOne(
//                     queryCondition,
//                     { $set: updateQuery },
//                     { new: true }
//                 );

//                 // Check if update was successful
//                 if (updatedItem.nModified === 0) {
//                     return res.status(404).json({ message: 'User not found or no changes made' });
//                 }
//                 // Return success response
//                 res.json(updatedItem);
//             } catch (updateError) {
//                 // Catch any errors during the update process
//                 console.error('Error updating user:', updateError.message);
//                 return res.status(500).json({ message: 'Failed to update user' });
//             }
//         } else {
//             // For arrays like 'projects', 'experiences', etc.
//             updateQuery[`${item}.$`] = req.body; // Use positional operator for arrays
//             queryCondition = { [`${item}._id`]: id }; // Find the specific array item
//             const updatedItem = await PortfolioModel.updateOne(
//                 queryCondition,
//                 { $set: updateQuery },
//                 { new: true }
//             );

//             if (updatedItem.nModified === 0) {
//                 return res.status(404).json({ message: `${item} not found or no changes made` });
//             }
//             res.json(updatedItem);
//         }
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };

// Routes


// router.put('/users/:id', (req, res) => updateUserItem(req, res));
// router.put('/users/:id', (req, res) => updatePortfolioItem(req, res, 'users'));
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