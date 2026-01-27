const jwt = require("jsonwebtoken");
const supabase = require("../supabaseClient");

module.exports = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ error: "Login first" });
        }

        const decoded = jwt.verify(token, process.env.JWT_KEY);

        // Fetch user from Supabase instead of MongoDB
        const { data: user, error } = await supabase
            .from("faculty")
            .select("email, Name, status")
            .eq("email", decoded.email)
            .single();

        if (error || !user) {
            return res.status(404).json({ error: "User not found" });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};