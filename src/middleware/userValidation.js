const userModel=require("../models/userModel")



//---------------> createUserValidation <-----------------------
const cuv= async function(req,res, next){
try{
    let data = req.body;
        let { title, name, phone, email, password, address } = data;
    
        //validation starts here
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
        if (title.includes(" ")) {
          return res
            .status(400)
            .send({ status: false, message: "Space is not allowed" });
        }
    
        if (title != "Mr" && title != "Miss" && title != "Mrs") {
          return res
            .status(400)
            .send({ status: false, message: "title should be Mr,Miss,Mrs" });
        }
    
        if (!name) {
          return res
            .status(400)
            .send({ status: false, message: "name is mandatory" });
        }
        if (!/^[a-z ,.'-]+$/i.test(name)) {
          return res.status(400).send({
            status: false,
            message: "numeric values and special characters not allowed",
          });
        }
        if (!phone) {
          return res
            .status(400)
            .send({ status: false, message: "please enter phone number" });
        }
        if (!/^[6-9]\d{9}$/.test(phone)) {
          return res
            .status(400)
            .send({ status: false, message: "invaid mobile number" });
        }
        if (phone.length < 10 || phone.length > 10) {
          return res
            .status(400)
            .send({ status: false, message: "Mobile Number should be ten digit" });
        }
        let findPhone = await userModel.findOne({ phone: phone });
        if (findPhone) {
          return res
            .status(400)
            .send({ status: false, message: "Phone number should be unique" });
        }
        if (!email) {
          return res
            .status(400)
            .send({ status: false, message: "email is mandatory" });
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
          return res
            .status(400)
            .send({ status: false, message: "email contain special charcter" });
        }
        let findEmail = await userModel.findOne({ email: email });
        if (findEmail) {
          return res
            .status(400)
            .send({ status: false, message: "email should be unique" });
        }
        if (!password) {
          return res
            .status(400)
            .send({ status: false, message: "password is mandatory" });
        }
        if (password.length < 8 || password.length > 15) {
          return res.status(400).send({
            status: false,
            message:
              "password's length must not be less than 8 and greater then 15",
          });
        }
        if (!/^[1-9]\d{5}$/.test(address.pincode)) {
          return res
            .status(400)
            .send({ status: false, message: "pincode should be in numeric value" });
        }
        if (!/^[a-z ,.'-]+$/i.test(address.city)) {
          return res
            .status(400)
            .send({ status: false, message: "city should be in alphabate" });
        }
        next()
    }
catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
}
module.exports={cuv}