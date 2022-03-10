const { User, Thought } = require('../models');

const userController = {
    // Get all users
    getAllUsers(req, res) {
        User.find()
            .select('-__v')
            .sort({ _id: -1 })
            .then(userData => res.json(userData))
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    // Get user by id
    getUserById(req, res) {
        User.findOne({ _id: req.params.id })
            .populate({
                path: 'thoughts',
                select: '-__v'
            })
            .populate({
                path: 'friends',
                select: '-__v'
            })
            .select('-__v')
            .then(userData => {
                if (!userData) {
                    res.status(404).json({ message: 'Could not find user with this id' });
                    return;
                }
                res.json(userData);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    // Create user
    createUser(req, res) {
        User.create(req.body)
            .then(userData => res.json(userData))
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    // Update user
    updateUser(req, res) {
        let oldUsername;
        User.findOne({ _id: req.params.id })
            .then(userData => oldUsername = userData.username)
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
        User.findOneAndUpdate(
            { _id: req.params.id }, req.body, { new: true, runValidators: true })
            .then((body) => {
                return Thought.updateMany(
                    { username: oldUsername },
                    { username: body.username },
                    { new: true, runValidators: true }
                );
            })
            .then(userData => {
                if (!userData) {
                    res.status(404).json({ message: 'Could not find user with this id' });
                    return;
                }
                res.json(userData);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    // Delete user
    deleteUser(req, res) {
        User.findOneAndDelete({ _id: req.params.id })
            .then(({ username }) => {
                return Thought.deleteMany({ username: username });
            })
            .then(() => {
                return User.updateMany(
                    { friends: { _id: req.params.id } },
                    { $pull: { friends: req.params.id } },
                    { new: true, runValidators: true }
                );
            })
            .then(userData => {
                if (!userData) {
                    res.status(404).json({ message: 'Could not find user with this id' });
                    return;
                }
                res.json(userData);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    // FRIENDS
    // Add friend
    addFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $push: { friends: req.params.friendId } },
            { new: true, runValidators: true }
        )
            .then(() => {
                return User.findOneAndUpdate(
                    { _id: req.params.friendId },
                    { $push: { friends: req.params.userId } },
                    { new: true, runValidators: true }
                );
            })
            .then(userData => {
                if (!userData) {
                    res.status(404).json({ message: 'Could not find user with this id' });
                    return;
                }
                res.json(userData);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    // Remove friend
    removeFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId } },
            { new: true, runValidators: true }
        )
            .then(() => {
                return User.findOneAndUpdate(
                    { _id: req.params.friendId },
                    { $pull: { friends: req.params.userId } },
                    { new: true, runValidators: true }
                );
            })
            .then(userData => {
                if (!userData) {
                    res.status(404).json({ message: 'Could not find user with this id' });
                    return;
                }
                res.json(userData);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
    }
}

module.exports = userController;