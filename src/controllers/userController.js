const prisma = require('../models/prismaClient');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    console.log("kya jiii")
    const {username, email, password} = req.body;
    if (!email) return res.status(400).send({message: "Email required"})
    if (!username) return res.status(400).send({message: "Username required"})
    if (!password) return res.status(400).send({message: "Password required"})

    try {
        const existingUser = await prisma.user.findUnique({where: {email}})
        if (existingUser){
            return res.status(401).send({message:"User already exist"})

        }
        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await prisma.user.create({
            data:{
                username,
                email,
                password: hashedPassword
            }
        });
        return res.status(200).send({
            message:"User created Successfully",
            id: newUser.id,
            username: newUser.username,
            email: newUser.email
        });
    } catch (error){
        console.log(error)
        res.status(500).send({message: "Internal server error"})
    }
};

exports.login = async (req, res) => {
    const {email, password} = req.body
    try{
        const user = await prisma.user.findUnique({where: {email}})
        if (!user) return res.status(400).json({message: "User not found"})
        const validPassword = await bcrypt.compare(password,user.password)
        if (!validPassword) return res.status(400).json({message: "Invalid Password"})

        const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET, {
            expiresIn: '1h'
        })
        return res.status(200).send({message:"Login successful",accessToken: token})


    } catch (error) {
        res.status(500).json({message: "Server error"})    
    }
}