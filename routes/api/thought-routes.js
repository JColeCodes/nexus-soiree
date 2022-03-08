const router = require('express').Router();
const {
    getAllThoughts,
    getThoughtById,
    addThought,
    updateThought,
    removeThought
} = require('../../controllers/thought-controller');

// Route /thoughts/users
router.route('/')
    .get(getAllThoughts)
    .post(addThought);

// Route /api/thoughts/:id
router.route('/:id')
    .get(getThoughtById)
    .put(updateThought)
    .delete(removeThought);

module.exports = router;