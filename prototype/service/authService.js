const fs = require('fs');
const path = require('path');

const userDir = path.join(__dirname, '..', 'userInfo');

const saveUser = (username, data) => {
    try {
        const filePath = path.join(userDir, `${username}.json`);
        if (fs.existsSync(filePath)) return false;
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
};

const emailExists = (email) => {
    const files = fs.readdirSync(userDir);
    return files.some(file => {
        const content = JSON.parse(fs.readFileSync(path.join(userDir, file)));
        return content.email === email;
    });
};

const getUserByUsernameOrEmail = (identifier) => {
    const files = fs.readdirSync(userDir);
    for (let file of files) {
        const content = JSON.parse(fs.readFileSync(path.join(userDir, file)));
        if (content.email === identifier || content.username === identifier) {
            return content;
        }
    }
    return null;
};

module.exports = { saveUser, getUserByUsernameOrEmail, emailExists };
