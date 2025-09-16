import {User} from "../models/allModels.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


// Register
export const register = async (req, res) => {
    try {
        const { name, email, password, currency, settings } = req.body;
        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const passwordHash = await hashPassword(password);

        // Create new user
        user = new User({ name, email, passwordHash, currency, settings });
        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );

        res.status(201).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                currency: user.currency,
                settings: user.settings
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

// Login
export const login= async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await verifyPassword(password, user.passwordHash);
        if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );

        res.json({
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

// export const verify = async (req, res) => {
//     res.json({ valid: true, user: req.user });
// }

async function hashPassword(password) {
  const saltRounds = 10; // cost factor
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
}

async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}