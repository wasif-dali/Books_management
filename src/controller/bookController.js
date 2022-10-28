const bookModel=require('../models/booksModel')
const reviewModel=require('../models/reviewModel')
const mongoose = require('mongoose')


//-----------------> createBook ------------------>
const createBook=async function(req,res){
  try { 
    let bookData=req.body
    let createBookData=await bookModel.create(bookData)
  return res.status(201).send({status:true,message:"succesful",data:createBookData})
}
catch(err){
  return res.status(500).send({status:false,message:err.msg}) 
}
}

//-----------------> getBooks ------------------>
const getBooks = async function (req, res) {
try {
let { userId, category, subcategory} = req.query
  let filter= {isDeleted:false}

  let isValid = mongoose.Types.ObjectId.isValid(userId);
  if(userId &&  !isValid){return res.status(400).send({ msg: "enter valid object id" });}

  if (userId) { filter.userId = userId }
  if (category) { filter.category = category }
  if (subcategory) { filter.subcategory =subcategory  }

  let savedData = await bookModel.find(filter).select({ title:1, excerpt:1, userId:1, category:1, releasedAt:1, reviews:1,subcategory:1,ISBN:1})

  let count = await bookModel.find(filter).count()
  if (savedData.length == 0) {
    return res.status(404).send({ status: false, message: "no document found" })
  }
  const sortedBooks = savedData.sort((a, b) => a.title.localeCompare(b.title));
let finalData={
  count:count,
  bookData:sortedBooks
}
  return res.status(200).send({ status: true, message: "success",data: finalData })
}
catch (err) {
  res.status(500).send({ status: false, message: err.message })
}
}
//----------------------------- getBooksByparams --------------------------------------------//
const getBooksByParams = async function (req, res) {
  
  try {
      let bookId = req.params.bookId
      
      if (!bookId) {
        return res.status(400).send({ status: false, message: "Book Id is required in path params !" })
    }

      let book = mongoose.Types.ObjectId.isValid(bookId)
      if (!book) {
          return res.status(400).send({ status: false, message: "book id is invalid!" })
      }

      let isValid = await bookModel.findOne({ _id: bookId });
      if (!isValid) {
          return res.status(404).send({
              status: false,
              message:
                  "No book is present with this id !",
          });
      }
      // review alike
      const { title, excerpt, userId,ISBN,category,subcategory,isDeleted,releasedAt,reviews } = isValid
      const review = await reviewModel.find({bookId : isValid._id }).select({ bookId:1,reviewedBy:1,reviewedAt:1,rating:1,review:1 })
      
      const data = {
          title: title,
          excerpt: excerpt,
          userId: userId,
          ISBN:ISBN,
        category:category,
        subcategory:subcategory,
        isDeleted:isDeleted,
        releasedAt:releasedAt,
        reviews:reviews,
         allReviews: review.length ? review : { message: "0 review for this Book." }
      }
      return res.status(200).send({ status: true,message: "success", data: data })

  } catch (err) {
      return res.status(500).send({ status: false, Error: err.message });
  }
};

//----------------------------> updateBook<---------------------------------------//

const updateBook=async function (req,res){
  try{
    let bookId=req.params.bookId;
    if (!bookId)
    {
        return res
       .status(400)
       .send({status:false,message:"Book id is required"});
    }
    let requestBody=req.body;
    let {title,excerpt,releasedAt,ISBN}=requestBody;

    let findTitle = await bookModel.findOne({ title: title });
    if (findTitle) {
        return res
            .status(400)
            .send({ status: false, message: "Title should be unique" });
    }
            let findISBN = await bookModel.findOne({ ISBN: ISBN });
            if (findISBN) {
               return  res
                    .status(400)
                    .send({ status: false, message: "ISBN should be unique" });
            }

  let bookUpdated = await bookModel.findOneAndUpdate(
    { _id: bookId },
    {
      $set: {
        title: title,
        excerpt:excerpt,
        releasedAt:releasedAt,
        ISBN:ISBN,
      },
    }, 
    { new: true }
  );

  return res.status(200).send({
    status: true,
    message: "Book Data Updated Successfully",
    data: bookUpdated,
  });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
//----------------------------------------> deleteBook <-----------------------------------------------------//
const deleteBook = async function (req, res)  {
  try {
    let inputId = req.params.bookId;

    let isValid = mongoose.Types.ObjectId.isValid(inputId);
    if (!isValid) return res.status(400).send({ msg: "enter valid object id" });


    let date =Date.now()

    let deleteAlert = await bookModel.findOne({
      _id: inputId,
      isDeleted: true,
    });
    if (deleteAlert)
      return res.status(404).send({ status:false,message: "This blog is already deleted" });

    let updateData = await bookModel.findOneAndUpdate(
      { _id: inputId },
      { $set: { isDeleted: true, deletedAt: date } },
      { new: true }
    );

    if (!updateData)
      return res.status(404).send({ status: false,message: "This document dose not exist" });

    res.status(200).send({ status: true, message:"your book is deleted successfully." });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

module.exports={ createBook,getBooks,updateBook,getBooksByParams,deleteBook}