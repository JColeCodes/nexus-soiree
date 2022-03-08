const { Thought, User } = require('../models');

const thoughtController = {
    // Get all thoughts
    getAllThoughts(req, res) {
        Thought.find()
            .select('-__v')
            .sort({ _id: -1 })
            .then(thoughtData => res.json(thoughtData))
            .catch(err => {
                console.log(err);
                res.json(err);
            });
    },

    // Get thought by id
    getThoughtById(req, res) {
        Thought.findOne({ _id: req.params.id })
            .select('-__v')
            .then(thoughtData => {
                if (!thoughtData) {
                    res.status(404).json({ message: 'Could not find thought with this id' });
                    return
                }
                res.json(thoughtData);
            })
            .catch(err => {
                console.log(err);
                res.json(err);
            });
    },

    // Add thought
    addThought(req, res) {
        Thought.create(req.body)
            .then(({ _id }) => {
                return User.findOneAndUpdate(
                    { _id: req.body.userId },
                    { $push: { thoughts: _id } },
                    { new: true }
                );
            })
            .then(userData => {
                if (!userData) {
                    res.status(404).json({ message: 'Could not find user with this username' });
                    return
                }
                res.json(userData);
            })
            .catch(err => {
                console.log(err);
                res.json(err);
            });
    },

    // Update thought
    updateThought(req, res) {
        Thought.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, runValidators: true })
            .then(thoughtData => {
                if (!thoughtData) {
                    res.status(404).json({ message: 'Could not find thought with this id' });
                    return
                }
                res.json(thoughtData);
            })
            .catch(err => {
                console.log(err);
                res.json(err);
            });
    },

    // Delete thought
    removeThought(req, res) {
        Thought.findOneAndDelete({ _id: req.params.id })
            .then(deletedThought => {
                if (!deletedThought) {
                    res.status(404).json({ message: 'Could not find thought with this id' });
                    return
                }
                return User.findOneAndUpdate(
                    { username: req.body.username },
                    { $pull: { thoughts: req.params.id } },
                    { new: true }
                );
            })
            .then(userData => {
                if (!userData) {
                    res.status(404).json({ message: 'Could not find user with this username' });
                    return
                }
                res.json(userData);
            })
            .catch(err => {
                console.log(err);
                res.json(err);
            });
    }
}

module.exports = thoughtController;