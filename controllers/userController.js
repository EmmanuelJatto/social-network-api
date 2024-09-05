const { Thought, User } = require('../models');

module.exports = {
    async getUsers(req, res) {
        try {
            const userData = await User.find();
            res.status(200).json(userData);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    async getUserById(req, res) {
        try {
            const userData = await User.findOne({ _id: req.params.userId });
            if (!userData) {
                res.status(404).json({ message: 'No User found with this id!' });
                return;
            };
            res.status(200).json(userData);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    async createUser(req, res) {
        try {
            const userData = await User.create(req.body);
            res.status(200).json(userData);
        } catch (err) {
            console.log(err)
            res.status(500).json(err);
        }
    },

    async updateUser(req, res) {
        try {
            const userData = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $set: req.body },
                { runValidators: true, new: true }
            );

            if (!userData) {
                res.status(404).json({ message: 'No User with this id!' });
                return;
            };
            res.status(200).json(userData);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    async deleteUser(req, res) {
        try {
            const userData = await User.findOneAndDelete({ _id: req.params.userId });

            if (!userData) {
                res.status(404).json({ message: 'No User found with this id!' });
                return;
            }

            await Thought.deleteMany({ _id: { $in: userData.thoughts } })
            res.status(200).json({ message: 'User and associated thoughts have been deleted!' });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    async addNewFriend(req, res) {
        try {
            const userData = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $addToSet: { friends: req.params.friendsId } },
                { runValidators: true, new: true },
            )

            if (!userData) {
                res.status(404).json({ message: 'No User exists with this id!' });
                return;
            }

            res.status(200).json(userData);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    async deleteFriend(req, res) {
        try {
            const userData = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $pull: { friends: req.params.friendsId } },
                { runValidators: true, new: true },
            );

            if (!userData) {
                res.status(404).json({ message: 'No User exists with this id!' });
                return;
            }
            res.status(200).json(userData);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    }
}