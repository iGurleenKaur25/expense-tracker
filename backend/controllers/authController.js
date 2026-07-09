

const User = require('../models/Users');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");


const generateToken = (id) => {
    return jwt.sign(
        {id},
        process.env.JWT_SECRET,
        {expiresIn: '30d'}
    );
};


exports.registerUser = async (req,res,next) => {
  console.log(req.body);
    const{name,email,password,userType} = req.body;
        if (!name|| !email || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }


    try{
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

const hashedPassword = await bcrypt.hash(password, 10);
console.log("REGISTER HASH:", hashedPassword);

         const user = await User.create({
         name,
         email,
         password: hashedPassword,
         userType: userType === 'student' ? 'student' : 'general'
         });

    res.status(201).json({
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType
      }
    });
    }
    catch (error) {
       console.error("AUTH ERROR 👉", error);
    res.status(500).json({
      message: "Server error"
    });
 }
}

exports.loginUser = async (req,res,next) => {
  const {email , password} =req.body;
  if ( !email || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    try{
      const user = await User.findOne({ email });
      console.log("LOGIN BODY:", req.body);

        if ( !user) {
            return res.status(401).json({message: 'User doesnt exists'});
        }
        console.log("LOGIN PASSWORD:", password);
        console.log("DB HASH:", user.password);

        const isMatch = await bcrypt.compare(password , user.password);
        console.log("MATCH RESULT:", isMatch);

            if (!isMatch) {
              return res.status(400).json({
              message: "Invalid credentials"
            });
    }

        res.status(200).json({
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType
      }
    });

    }
    catch(error){
        console.error("AUTH ERROR 👉", error);
      res.status(500).json({
        message: "server error"
      });
    }
}