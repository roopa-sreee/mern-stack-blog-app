const userModel = require('../models/userModel');
const bcrypt = require("bcrypt")
const JWT = require("jsonwebtoken")

//to register user
exports.registerController = async(req,res) => {
    try{
        const {username,email,password} = req.body 
        
        // validations
        if (!username || !email || !password){
            return res.status(400).send({
                success:false,
                message:"Enter all fields"
            })
        }

        //check whether user exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(401).send({
                success:false,
                message:"user Already Exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password,10)
        
        // save user 
        const user = new userModel({username, email, password:hashedPassword })
        await user.save();
        return res.status(201).send({
            success:true,
            message:'User Registered Successfully',
            user
        })
    } catch(error){
        console.log(error)
        return res.status(500).send({
            success:false,
            message:'Error in Register callback',
            error
        })
    }
};

// to get all users 
exports.getAllUsers = async(req,res) => {
    try{
        const users = await userModel.find({});
        return res.status(200).send({
            userCount:users.length,
            success:true,
            message:"All Users Data",
            users,
        })

    }catch(error){
        console.log(error)
        return res.status(500).send({
            success:false,
            message:`Error in Get all users`,
            error
        })
    }
};


// to login user 
exports.loginController = async(req,res) => {
    try{
        const {email, password} = req.body
        //validation 
        if  (!email || !password){
            return res.status(401).send({
                success:false,
                message:'Please provide email or password'
            })
        }

        const user = await userModel.findOne({email})
        if (!user){
            return res.status(400).send({
                success:false,
                message:'Email is not registered'
            })
        }

        //verifying password
        const isMatch = await bcrypt.compare(password,user.password)
        if (!isMatch) {
            return res.status(401).send({
                success:false,
                message:"Invalid Password or email"
            })
        }
        return res.status(200).send({
            success:true,
            message:'Login success',
            user
        
        })

    }catch(error){
        console.log(error);
        return res.status(500).send({
            success:false,
            message:"Error in Login Callback",
            error
        })
    }
};









