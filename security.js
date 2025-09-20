require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const validator = require('validator');
const chalk = require('chalk');
const fs = require('fs-extra');

class SecurityManager {
    constructor() {
        this.jwtSecret = process.env.JWT_SECRET || 'fallback-secret';
        this.users = new Map();
        this.sessions = new Map();
        console.log(chalk.green('Security Manager initialized'));
    }

    async hashPassword(password) {
        if (!validator.isLength(password, { min: 8 })) {
            throw new Error('Password must be at least 8 characters');
        }
        return await bcrypt.hash(password, 12);
    }

    async verifyPassword(password, hash) {
        return await bcrypt.compare(password, hash);
    }

    generateToken(userId, email) {
        const payload = {
            id: userId,
            email: email,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
        };
        return jwt.sign(payload, this.jwtSecret);
    }

    verifyToken(token) {
        try {
            return jwt.verify(token, this.jwtSecret);
        } catch (error) {
            console.log(chalk.red('Token verification failed'));
            return null;
        }
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
            password: hashedPassword,
            createdAt: new Date().toISOString(),
            lastLogin: null
        };

        this.users.set(userId, user);

        await this.logSecurityEvent('USER_CREATED', userId, { email });
        console.log(chalk.blue(`User created: ${email}`));

        return { id: userId, email: user.email };
    }

    async authenticateUser(email, password) {
        const userArray = Array.from(this.users.values());
        const user = userArray.find(u => u.email === email.toLowerCase());

        if (!user) {
            await this.logSecurityEvent('LOGIN_FAILED', null, { email, reason: 'user_not_found' });
            throw new Error('Authentication failed');
        }

        const isValid = await this.verifyPassword(password, user.password);
        if (!isValid) {
            await this.logSecurityEvent('LOGIN_FAILED', user.id, { email, reason: 'invalid_password' });
            throw new Error('Authentication failed');
        }

        user.lastLogin = new Date().toISOString();
        const token = this.generateToken(user.id, user.email);

        const sessionId = uuidv4();
        this.sessions.set(sessionId, {
            userId: user.id,
            token: token,
            createdAt: new Date().toISOString()
        });

        await this.logSecurityEvent('LOGIN_SUCCESS', user.id, { email });
        console.log(chalk.green(`User authenticated: ${email}`));

        return { token, sessionId, user: { id: user.id, email: user.email } };
    }

    async logSecurityEvent(event, userId, metadata = {}) {
        const logEntry = {
            id: uuidv4(),
            event: event,
            userId: userId,
            timestamp: new Date().toISOString(),
            metadata: metadata
        };

        try {
            await fs.ensureDir('./logs');
            const logFile = './logs/security.log';
            await fs.appendFile(logFile, JSON.stringify(logEntry) + '\n');
        } catch (error) {
            console.error(chalk.red('Failed to log security event:'), error.message);
        }
    }

    validateInput(input, type) {
        switch (type) {
            case 'email':
                return validator.isEmail(input);
            case 'uuid':
                return validator.isUUID(input);
            case 'jwt':
                return validator.isJWT(input);
            case 'alphanumeric':
                return validator.isAlphanumeric(input);
            default:
                return validator.isLength(input, { min: 1 });
        }
    }
}

module.exports = SecurityManager;