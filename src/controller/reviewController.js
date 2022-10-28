const reviewModel = require('../models/reviewModel')
const bookModel = require('../models/booksModel')
const mongoose = require('mongoose')
const moment=require('moment')

//-----------> createReview ------------>//
const createReview = async function (req, res) {
    try {
        let reqBookId = req.params.bookId
        if (!reqBookId) { return res.status(400).send({ status: true, message: "bookId is mandatory" }) }

        let book = mongoose.Types.ObjectId.isValid(reqBookId)
        if (!book) {
            return res.status(400).send({ status: false, message: "book id is invalid!" })
        }
        let findBookId = await bookModel.findById(reqBookId)
        if (!findBookId) {
            return res.status(400).send({ status: false, message: "this Book Id is not present in db" })
        }
        let data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "body is empty" })
        }
        let { bookId, reviewedBy, reviewedAt, rating, review } = data
        if (reqBookId != bookId) { return res.status(400).send({ status: false, message: "please use the same id in path and inside the body!" }) }
        if (findBookId.isDeleted == true) { return res.status(400).send({ status: false, message: "you can't set review for this book this is deleted" }) }

        if (!bookId) { return res.status(400).send({ status: false, message: "bookId is mandatory" }) }
        //if (!reviewedBy) { return res.status(400).send({ status: false, message: "reviewedBy is mandatory" }) }
//if(reviewedBy==undefined || reviewedBy==null || reviewedBy==""){
//reviewedBy.$set('Guest')
//}

      //  if (!reviewedAt) { return res.status(400).send({ status: false, message: "reviewedAt is mandatory" }) }
        if (!rating) { return res.status(400).send({ status: false, message: "rating is mandatory" }) }
        if (!/^[1-5]\d{0}$/.test(rating)) { return res.status(400).send({ status: false, message: "rating in number only(1-5)" }) }

        const updatedBooks = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { $inc: { reviews: 1 } }, { new: true })

       let createdReview = await reviewModel.create(data)
        let updatedBooksdata = { updatedBooks }

        updatedBooksdata.reviewsData = createReview
        return res.status(201).send({ status: true, message: 'Success', data: updatedBooksdata })

    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

//-----------> updateReviewById ------------>//
const updateBooksById = async function (req, res) {
  try {
  
      let bookId = req.params.bookId
      let { title, excerpt, releasedAt, ISBN } = req.body

      if (Object.keys(req.body).length == 0) {
          return res.status(400).send({ status: false, message: "Please enter the data in the request body to update" })
      }
       
      
      let uniqueTitle = await bookModel.findOne({ title: title })
      if (uniqueTitle) {
          return res.status(400).send({ status: false, message: "title already exists" })
      }
      let uniqueISBN = await bookModel.findOne({ ISBN: ISBN })
      if (uniqueISBN) {
          return res.status(400).send({ status: false, message: "ISBN already exists" })
      }

      if (!moment(releasedAt).format('YYYY-MM-DD')) {
          return res.status(400).send({ status: false, message: "please enter date format like this: YYYY-MM-DD" }) 
      }

      let updatedData = await bookModel.findOneAndUpdate(
          { _id: bookId, isDeleted: false },
          {
              title: title,
              excerpt: excerpt,
              releasedAt: releasedAt,
              ISBN: ISBN,
          },
          { new: true }
      )

      return res.status(200).send({ status: true, message: "Data updated successfully", data: updatedData })
  } catch (err) {
      return res.status(500).send({ status: false, message: err.message })
  }
}
//-----------> deleteReviewById ------------>//
const deleteReviwsById = async function (req, res) {
    try {
        let bookId = req.params.bookId;
        let validBook = mongoose.Types.ObjectId.isValid(bookId)
        if (!validBook) {
            return res.status(400).send({ status: false, message: "book id is invalid!" })
        }
        let reviewId = req.params.reviewId;
        let validReview = mongoose.Types.ObjectId.isValid(reviewId)
        if (!validReview) {
            return res.status(400).send({ status: false, message: "review id is invalid!" })
        }

        //finding book and review to be deleted

        let book = await bookModel.findById(bookId)
        if ( book.isDeleted == true) {    //
            return res.status(400).send({ status: false, message: "Book is already deleted." })
        }
        let review = await reviewModel.findById(reviewId)
        if ( review.isDeleted == true) {  //
            return res.status(400).send({ status: false, message: "Review already deleted" })
        }
        if (review.bookId != bookId) {
            return res.status(404).send({ status: false, message: "Review not found for this book" })
        }

        await reviewModel.findOneAndUpdate({ _id: reviewId }, { isDeleted: true }, { new: true })
        await bookModel.findOneAndUpdate({ _id: bookId }, { $inc: { reviews: -1 } })

        return res.status(200).send({ status: true, message: "Review deleted successfully" })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}




module.exports = {
    createReview, deleteReviwsById,updateBooksById
}