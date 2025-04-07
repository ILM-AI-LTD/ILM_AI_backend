const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const bcrypt = require('bcryptjs');

app.use(express.urlencoded({ extended: true })); // for form data
app.use(express.static('public')); // serve HTML files

// POST /register
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.send("All fields are required!");
    }

    const userFilePath = path.join(__dirname, 'userInfo', `${username}.json`);

  // Check if username already exists
  if (fs.existsSync(userFilePath)) {
    return res.send("Username already exists. Please choose another.");
  }

  // Check if email already exists
    const allFiles = fs.readdirSync(path.join(__dirname, 'userInfo'));
    const emailExists = allFiles.some(file => {
    const filePath = path.join(__dirname, 'userInfo', file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const userData = JSON.parse(content);
    return userData.email === email;
  });

  if (emailExists) {
    return res.send("Email already registered. Try a different one.");
  }

    const hashedPassword = bcrypt.hashSync(password, 8);

    const userData = {
        username,
        email,
        password: hashedPassword,
      };
    const filePath = path.join(__dirname, 'userInfo', `${username}.json`);

    fs.writeFile(filePath, JSON.stringify(userData, null, 2), (err) => {
        if (err) {
            console.error(err);
            return res.send("Error saving user.");
        }
        res.send(`<h3>Registered successfully!</h3><a href="/">Go to Homepage</a>`);
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});


// POST /login
app.post('/login', (req, res) => {
    console.log('Login attempt with data:', req.body);
    const emailOrUsername = req.body['username or email'];
    const password = req.body.password;

    if (!emailOrUsername || !password) {
        console.log('Missing fields:', { emailOrUsername, password });
        return res.send(`<script>alert('All fields are required!'); window.location.href='/login.html';</script>`);
    }

    const userFiles = fs.readdirSync(path.join(__dirname, 'userInfo'));

    let foundUser = null;

    for (let file of userFiles) {
        const content = fs.readFileSync(path.join(__dirname, 'userInfo', file), 'utf-8');
        const userData = JSON.parse(content);

        if (userData.email === emailOrUsername || userData.username === emailOrUsername) {
            foundUser = userData;
            break;
        }
    }

    if (!foundUser) {
        return res.send(`<script>alert('Username or email not found!'); window.location.href='/login.html';</script>`);
    }

    const isPasswordCorrect = bcrypt.compareSync(password, foundUser.password);

    if (!isPasswordCorrect) {
        return res.send(`<script>alert('Incorrect password!'); window.location.href='/login.html';</script>`);
    }

    // Successful login
    res.send(`<h2>Hello ${foundUser.username}! Welcome to ILM Learning platform</h2>`);
});

