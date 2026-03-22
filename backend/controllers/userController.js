import userModel from "../models/userModel.js";
import validator from 'validator';
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";

// Route for user login
const loginUser = async(req,res)=>{
    try {

        const {email,password} = req.body;

        // checking password and email
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success:false, message:"User does not exists"})
        }
        
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.json({success:false, message:"Invalid credentials"})
        }
        

        const token = jwt.sign({id:user._id},process.env.JWT_SECRET);

        res.json({success:true, token})


    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}


// Route for user registration
const registerUser = async(req,res)=>{
    try {

        const {name,email,password} = req.body;

        // checking if user already exists
        const exist = await userModel.findOne({email})
        if(exist){
            return res.json({success:false, message:"User already exists"})
        }

        // validating email format and strong password
        if(!validator.isEmail(email)){
            return res.json({success:false, message:"Please enter a valid email id"})
        }
        if(password.length < 8){
            return res.json({success:false, message:"Please enter a strong password"})
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        const newUser = new userModel({
            name,email,password:hashedPassword
        })

        const user = await newUser.save()

        const token = jwt.sign({id:user._id},process.env.JWT_SECRET);

        res.json({success:true, token})


    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}


// Route for admin login
const adminLogin = async(req,res)=>{
   try {
    const {email, password} = req.body
    if(!email || !password){
        return res.json({success:false, message:"All fields are required"})
    }

    if(email != process.env.ADMIN_EMAIL || password != process.env.ADMIN_PASSWORD){
        return res.json({success:false, message:"Invalid credentials"})
    }

    const token = jwt.sign({email,password},process.env.JWT_SECRET);
    res.json({success:true, token})
    

   } catch (error) {
    console.log(error)
    res.json({success:false, message:error.message})
   }
}


export {loginUser,registerUser,adminLogin}