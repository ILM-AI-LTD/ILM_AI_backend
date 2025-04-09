const { saveUser, getUserByUsernameOrEmail, emailExists } = require('../service/authService');
const { hashPassword, comparePasswords } = require('../utils/hash');
const path = require('path');

const registerUser = (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.send("All fields are required!");
    }

    if (emailExists(email)) {
        return res.send("Email already registered.");
    }

    const hashedPassword = hashPassword(password);
    const userData = { username, email, password: hashedPassword };

    const result = saveUser(username, userData);
    if (!result) {
        return res.send("Could not save user.");
    }

    res.send(`<h3>Registered successfully!</h3><a href="/">Go to Homepage</a>`);
};

const loginUser = (req, res) => {
    const identifier = req.body['username or email'];
    const password = req.body.password;

    if (!identifier || !password) {
        return res.send(`<script>alert('All fields are required!'); window.location.href='/login.html';</script>`);
    }

    const user = getUserByUsernameOrEmail(identifier);
    if (!user) {
        return res.send(`<script>alert('User not found!'); window.location.href='/login.html';</script>`);
    }

    if (!comparePasswords(password, user.password)) {
        return res.send(`<script>alert('Incorrect password!'); window.location.href='/login.html';</script>`);
    }

    res.send(`<h2>Hello ${user.username}! Welcome to ILM Learning platform</h2>`);
};

module.exports = { registerUser, loginUser };
