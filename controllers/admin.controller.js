import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Admin registration
export const register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'Admin',
        });

        res.status(201).json({ message: 'Admin registered successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        console.log("Login attempt:", email);

        const user = await User.findOne({ email });
        if (!user || user.role !== 'Admin') {
            console.log("Admin not found or role mismatch:", user);
            return res.status(404).json({ message: 'Admin not found' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            console.log("Invalid password for user:", email);
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.SECRET_KEY, { expiresIn: '1h' });


        res.cookie('token', token, { httpOnly: true });
        console.log("Admin logged in successfully:", user.email);
        res.status(200).json({ message: 'Admin logged in successfully', token, user });
    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).json({ message: error.message });
    }
};


// Admin logout
export const logout = async (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({ message: 'Admin logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Admin profile update
export const updateProfile = async (req, res) => {
    const { fullname, email, password } = req.body;

    if (!req.user || !req.user.id) {
        return res.status(400).json({ message: 'User not authenticated' });
    }
    try {
        const updates = { fullname, email };

        if (password) {
            updates.password = await bcrypt.hash(password, 12);
        }

        const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, { new: true });
        res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update user role
export const updateUserRole = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role: req.body.role },
            { new: true }
        );
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.error("Error updating user role:", error.response ? error.response.data : error.message);
        toast.error("Failed to update user role.");
    }
};

// Delete user
export const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
