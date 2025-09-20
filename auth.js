const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const validator = require('validator');
const chalk = require('chalk');

class AuthService {
    constructor() {
        this.users = new Map();
        this.secretKey = process.env.JWT_SECRET || 'default-secret-key';
        console.log(chalk.green('Auth service initialized'));
    }

    async hashPassword(password) {
        if (!validator.isLength(password, { min: 6 })) {
            throw new Error('Password must be at least 6 characters long');
        }

        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    }

    async validatePassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }

    async createUser(email, password) {
        if (!validator.isEmail(email)) {
            throw new Error('Invalid email format');
        }

        const userId = uuidv4();
        const hashedPassword = await this.hashPassword(password);

        const user = {
            id: userId,
            email: email.toLowerCase(),
            passwordHash: hashedPassword,
            createdAt: new Date().toISOString()
        };

        this.users.set(userId, user);
        console.log(chalk.blue(`User created: ${email}`));
        return { id: userId, email: user.email };
    }

    generateToken(userId) {
        const payload = {
            userId: userId,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour
        };

        return jwt.sign(payload, this.secretKey);
    }

    verifyToken(token) {
        try {
            return jwt.verify(token, this.secretKey);
        } catch (error) {
            console.log(chalk.red('Token verification failed:', error.message));
            throw new Error('Invalid token');
        }
    }

    getUserById(userId) {
        const user = this.users.get(userId);
        if (!user) {
            return null;
        }

        return {
            id: user.id,
            email: user.email,
            createdAt: user.createdAt
        };
    }
}

module.exports = AuthService;