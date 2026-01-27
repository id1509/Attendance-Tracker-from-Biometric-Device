const userModel=require("../models/usermodel")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const {generateToken}=require("../utils/generateToken")
const supabase = require("../supabaseClient");

module.exports.registerUser=async (req,res)=>{
    try{
        let {email, name, password}=req.body
        let user=await userModel.findOne({email: email})
        if(user) return res.status(401).send("Already have an account")
        bcrypt.genSalt(10, (err, salt)=>{
            bcrypt.hash(password,salt,async (err, hash)=>{
                if(err) return res.send(err.message)
                else {
                    let user = await userModel.create({
                        email,
                        password: hash,
                        name
                    })
                    let token=generateToken(user)
                    res.cookie("token", token)
                }
            })
        })
    }
    catch(err){
        console.log(err.message)
    }
}

module.exports.loginUser = async (req, res) => {
    let { email, password } = req.body;

    try {
        // 1. Search for the faculty member in Supabase
        const { data: faculty, error } = await supabase
            .from("faculty")
            .select("*")
            .eq("email", email)
            .single();

        if (error || !faculty) {
            return res.status(401).json({ error: "Email or Password incorrect" });
        }

        // 2. Check if the faculty account is active (per your image)
        if (faculty.status !== "active") {
            return res.status(403).json({ error: "Your account is currently inactive" });
        }

        // 3. Compare passwords
        // Note: If your Supabase table stores plain text passwords (like 'passA1' in image), 
        // use: if (password === faculty.password)
        // If they are hashed, keep bcrypt:
        const isMatch = await bcrypt.compare(password, faculty.password);

        if (isMatch || password === faculty.password) { // Using simple check for your current data
            const token = generateToken(faculty);
            res.cookie("token", token, {
                httpOnly: true, // Security best practice
                secure: process.env.NODE_ENV === "production"
            });

            return res.json({
                message: "Login successful",
                user: {
                    id: faculty.faculty_id, // Adjust based on your actual PK column name
                    name: faculty.Name,
                    email: faculty.email,
                },
            });
        } else {
            return res.status(401).json({ error: "Email or Password incorrect" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

module.exports.logout=(req,res)=>{
    res.cookie("token","")
    res.redirect("/")
}