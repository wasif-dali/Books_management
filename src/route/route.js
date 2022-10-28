const express = require("express");
const route = express.Router();
const createUserValiation=require("../middleware/userValidation")
const bookValiation=require("../middleware/bookValidation")
const userController=require('../contoller/userController')
const bookController=require('../contoller/bookController')
const auth=require('../middleware/middleware')
const review=require('../contoller/reviewController')


route.get("/test-me", (req, res) => {
    res.send("My first ever api!");
  });
 //-------------> Userapi <-------------------- 
route.post('/register',createUserValiation.cuv,userController.createUser)

route.post('/login', userController.loginUser)

//-------------> Bookapi <-------------------- 
route.post('/books',auth. authentication, bookValiation.cbv, bookController.createBook)

route.get('/books',auth. authentication,bookController.getBooks)

route.get('/books/:bookId',auth.authentication, bookController.getBooksByParams)

route.put("/books/:bookId",auth. authentication,auth.authorisation, bookValiation.ubv, bookController.updateBook);

route.delete('/books/:bookId', auth.authentication ,auth.authorisation, bookController.deleteBook)

//--------------------->review api   <-------------------------

route.post('/books/:bookId/review', review.createReview)

route.put('/books/:bookId/review/:reviewId', review.createReview)

route.delete('/books/:bookId/review/:reviewId',review.deleteReviwsById)



route.all("/*", function (req, res) {
  res.status(400).send({status: false, message: "Make Sure Your Endpoint is Correct !!!"
  });
});

module.exports = route;