import mongoose from "mongoose";
import {User} from "../models/allModels.js";
import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // const user = await User.findById(decoded.id).select('-password');
        const user = await User.aggregate([
                { $match: { _id: new mongoose.Types.ObjectId(decoded.id) } },
                {
                    $lookup: {
                    from: 'accounts',
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'account'
                    }
                },
                { $addFields: { account: { $arrayElemAt: ['$account', 0] } } },
                { $project: { password: 0 } }
                ]);
        if (!user) {
        return res.status(401).json({ message: 'Token is not valid' });
        }

        req.user = user[0];
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

export default auth;