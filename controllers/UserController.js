import {User} from "../models/allModels.js";
import bcrypt from "bcrypt";


// Get current user (protected route)
export const getCurrentUser = async (req, res) => {
    try {
        res.json({
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email
        }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

// READ all users
export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find().select("-passwordHash"); // exclude passwordHash
        res.json(users);
    } catch (error) {
        next(error);
    }
};

// READ one user
export const getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select("-passwordHash");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        next(error);
    }
};

// UPDATE user
export const updateUser = async (req, res, next) => {
    try {
        const updates = { ...req.body };

        // If password is being updated, hash it
        if (updates.password) {
        const salt = await bcrypt.genSalt(10);
        updates.passwordHash = await bcrypt.hash(updates.password, salt);
        delete updates.password; // remove plain password field
        }

        const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        updates,
        { new: true, runValidators: true, select: "-passwordHash" }
        );

        if (!updatedUser) return res.status(404).json({ message: "User not found" });
        res.json(updatedUser);
    } catch (error) {
        next(error);
    }
};

// DELETE user
export const deleteUser = async (req, res, next) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ message: "User not found" });
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        next(error);
    }
};
