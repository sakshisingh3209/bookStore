const express = require('express');
const router = express.Router();
const {
    createBook,
    getAllBooks,
    searchBooks,
    filterBooks,
    sortBooks,
    getPaginatedBooks,
    getBookById,
    updateBook,
    deleteBook,
    issueBook,
    returnBook,
    increaseStock,
    decreaseStock,
} = require('../controllers/bookController');

//routes for books

router.post('/', createBook);
router.get('/search', searchBooks);
router.get('/filter', filterBooks);
router.get('/', getAllBooks);
router.get('/sort', sortBooks);
router.get('/paginated', getPaginatedBooks);
router.get('/:id', getBookById);
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);





//issue and return book routes
router.post('/issue', issueBook);
router.delete('return/:orderId', returnBook);


module.exports = router;