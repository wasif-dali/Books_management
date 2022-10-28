const userModel =require('../models/userModel.js')
const jwt = require("jsonwebtoken");
const moment=require('moment')

const createUser = async function (req, res) {
  try {
    let data = req.body;
    let { title, name, phone, email, password, address } = data;
    //trim function
    let document = {
      title: title.trim(),
      name: name.trim(),
      phone: phone,
      email: email.toLowerCase(),
      password: password.trim(),
      address:address
    };

    const userData = await userModel.create(document);
    res.status(201).send({ status: true, message: userData });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};
/*------------------------------------------------------------------------------------------------------------------------------------*/
const loginUser = async function (req, res) {
  try {
    data = req.body;
    let userName = data.email;
    let password = data.password;

    //if give nothing inside req.body
    if (Object.keys(data).length == 0) {
      return res.status(400).send({
        status: false,
        message: "Please provide email & password to login.",
      });
    }
    if (Object.keys(data).length > 2) {
      return res
        .status(400)
        .send({ status: false, message: "Only email & password is required." });
    }
    //---------------------------------------------//
    //if no Email inside req.
    if (!userName) {
      return res
        .status(400)
        .send({ status: false, message: "please provide an Email !" });
    }
    //if no password inside req.body
    if (!password) {
      return res
        .status(400)
        .send({ status: false, message: "please enter password !" });
    }
    //-------------------------------------//

    //if not user
    let user = await userModel.findOne({ email: userName });
    if (!user) {
      return res
        .status(400)
        .send({ status: false, message: "username is not corerct" });
    }
    //if password not correct
    let pass = await userModel.findOne({ password: password });
    if (!pass) {
      return res
        .status(400)
        .send({ status: false, message: "password is not corerct" });
    }
    //---------------------//
    //success creation starting

    let token = jwt.sign(
      {
        userId: user._id.toString(),
        batch: "project3",
        organisation: "group37",
      },
      "functionup-plutonium",
      { expiresIn: "24h" }
    );
      let Token={
        token:token,
        userId:user._id.toString(),
        expiry: "24 hour",  
        iat:moment().format('MMMM Do YYYY, h:mm:ss a')
      }
    res.status(200).send({ status: true, message: "Success", data: Token });
  } catch (err) {
    res.status(500).send({ message: "server error", error: err });
  }
};

module.exports = { createUser, loginUser };