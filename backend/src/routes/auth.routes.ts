import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { pool } from '../config/database';
import { generateToken, hashPassword, comparePassword } from '../utils/auth.utils';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post(
    '/register',
    [
        body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        body('name').trim().notEmpty().withMessage('Name is required')
    ],
    async (req: Request, res: Response): Promise<void> => {
        try {
            // Validate input
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            const { email, password, name } = req.body;

            // Check if user already exists
            const existingUser = await pool.query(
                'SELECT id FROM users WHERE email = $1',
                [email]
            );

            if (existingUser.rows.length > 0) {
                res.status(400).json({ error: 'Email already registered' });
                return;
            }

            // Hash password
            const passwordHash = await hashPassword(password);

            // Create user
            const result = await pool.query(
                `INSERT INTO users (email, password_hash, name) 
                 VALUES ($1, $2, $3) 
                 RETURNING id, email, name, created_at`,
                [email, passwordHash, name]
            );

            const user = result.rows[0];

            // Generate JWT token
            const token = generateToken(user.id, user.email);

            res.status(201).json({
                message: 'User registered successfully',
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    createdAt: user.created_at
                },
                token
            });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({
                error: 'Failed to register user',
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
);

/**
 * POST /api/auth/login
 * Authenticate a user
 */
router.post(
    '/login',
    [
        body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
        body('password').notEmpty().withMessage('Password is required')
    ],
    async (req: Request, res: Response): Promise<void> => {
        try {
            // Validate input
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            const { email, password } = req.body;

            // Find user
            const result = await pool.query(
                'SELECT id, email, password_hash, name, created_at FROM users WHERE email = $1',
                [email]
            );

            if (result.rows.length === 0) {
                res.status(401).json({ error: 'Invalid email or password' });
                return;
            }

            const user = result.rows[0];

            // Verify password
            const isValidPassword = await comparePassword(password, user.password_hash);

            if (!isValidPassword) {
                res.status(401).json({ error: 'Invalid email or password' });
                return;
            }

            // Update last login
            await pool.query(
                'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
                [user.id]
            );

            // Generate JWT token
            const token = generateToken(user.id, user.email);

            res.json({
                message: 'Login successful',
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    createdAt: user.created_at
                },
                token
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                error: 'Failed to login',
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
);

/**
 * GET /api/auth/me
 * Get current user profile (protected route)
 */
router.get('/me', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        // Fetch user details
        const result = await pool.query(
            'SELECT id, email, name, created_at, last_login FROM users WHERE id = $1',
            [req.user.userId]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const user = result.rows[0];

        res.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                createdAt: user.created_at,
                lastLogin: user.last_login
            }
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            error: 'Failed to get user',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

export default router;
