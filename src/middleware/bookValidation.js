const bookModel = require("../models/booksModel");

//-----------------> createBookValidation <------------------------
const cbv = async function (req, res, next) {
  try {
    let data = req.body;
    let { title, excerpt, userId, ISBN, category, subcategory, releasedAt } =
      data;

    if (Object.keys(data).length == 0 || data == undefined || data == null) {
      return res.status(400).send({
        status: false,
        message: "body is empty",
      });
    }
    if (!title) {
      return res
        .status(400)
        .send({ status: false, message: "please give a title" });
    }
    if (!/^[a-z ,.'-]+$/i.test(title)) {
      return res.status(400).send({
        status: false,
        message: "numeric values and special characters not allowed",
      });
    }
    let findTitle = await bookModel.findOne({ title: title });
    if (findTitle) {
      return res
        .status(400)
        .send({ status: false, message: "Title should be unique" });
    }

    if (!excerpt) {
      return res
        .status(400)
        .send({ status: false, message: "please give a excerpt" });
    }
    if (!/^[a-z ,.'-]+$/i.test(excerpt)) {
      return res.status(400).send({
        status: false,
        message: "numeric values and special characters not allowed in excerpt",
      });
    }
    if (!userId) {
      return res
        .status(400)
        .send({ status: false, message: "userId must be present" });
    }
    if (!/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/.test(ISBN)) {
      return res
        .status(400)
        .send({ status: false, message: "valid ISBN should be 13 numbers" });
    }
    let findISBN = await bookModel.findOne({ ISBN: ISBN });
    if (findISBN) {
      return res
        .status(400)
        .send({ status: false, message: "ISBN should be unique" });
    }

    if (!category) {
      return res
        .status(400)
        .send({ status: false, message: "category must be present" });
    }
    if (!/^[a-z ,.'-]+$/i.test(subcategory)) {
      return res.status(400).send({
        status: false,
        message:
          "numeric values and special characters not allowed in category",
      });
    }
    if (!subcategory) {
      return res
        .status(400)
        .send({ status: false, message: "subcategory must be present" });
    }
    if (!/^[a-z ,.'-]+$/i.test(subcategory)) {
      return res.status(400).send({
        status: false,
        message:
          "numeric values and special characters not allowed in subcategory",
      });
    }
    if (!releasedAt) {
      return res
        .status(400)
        .send({ status: false, message: "releasedAt must be present" });
    }
    if (
      !/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/.test(releasedAt)
    ) {
      return res
        .status(400)
        .send({ status: false, message: "give date in yyyy-mm-dd format" });
    }

    next();
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

//-----------------> updateBookValidation <------------------------

const ubv = function (req, res, next) {
  try {
    let requestBody=req.body;
    let {title,excerpt,releasedAt,ISBN}=requestBody;
    if (Object.keys(requestBody).length==0) { return res.status(400).send({status:false, message:"please provide some data if you want to update !"})}


    if (!/^[a-z ,.'-]+$/i.test(title)) {
      return res.status(400).send({
        status: false,
        message: "numeric values and special characters not allowed in title",
      });
    }
      if (!/^[a-z ,.'-]+$/i.test(excerpt)) {
        return res.status(400).send({
          status: false,
          message: "numeric values and special characters not allowed in excerpt",
        });
      }
      if(releasedAt && (!/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/.test({releasedAt:releasedAt}))) {
        return res
            .status(400)
            .send({ status: false, message: "give date in yyyy-mm-dd format" });

    }
    if (ISBN && (!/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/.test(ISBN))) {
        return res
          .status(400)
          .send({ status: false, message: "valid ISBN should be 13 numbers" });
      }

      next()
    }
   catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};
module.exports = { cbv,ubv };