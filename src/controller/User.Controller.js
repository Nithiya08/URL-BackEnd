import { User } from "../modules/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
export const register = async (req, res) => {

    const { email, password, name } = req.body;

    try {

        const existiungUser = await User.findOne({ email })
        if (existiungUser) {
            return res.status(400).send('user already exists')
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = { email, username: name, password: hashedPassword }
        const newUser = await User.create(user);
        console.log("New user added:", newUser);
        return res.status(201).json(newUser);
    }
    catch (error) {
        console.error("Error adding user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const Login = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }
        const { _id, username, email: useremail } = user
        const token = jwt.sign({ _id, username, email: useremail }, process.env.SECRETKEY, { expiresIn: '1h' });
        console.log(token)
        return res.json({
            success: true,
            message: 'Login successful',
            token: token
        });

    } catch (error) {
        console.error("Error finding user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}