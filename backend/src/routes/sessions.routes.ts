import { Router, Response } from 'express';
import { body, query, validationResult } from 'express-validator';
import { pool } from '../config/database';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * POST /api/sessions
 * Create a new work session
 */
router.post(
    '/',
    [
        body('name').trim().notEmpty().withMessage('Session name is required'),
        body('work_type').trim().notEmpty().withMessage('Work type is required'),
        body('start_time').isISO8601().withMessage('Valid start time is required'),
        body('end_time').isISO8601().withMessage('Valid end time is required'),
        body('duration_seconds').isInt({ min: 1 }).withMessage('Duration must be a positive number'),
        body('project_id').optional().isUUID().withMessage('Project ID must be a valid UUID'),
        body('notes').optional().trim()
    ],
    async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            const { name, work_type, start_time, end_time, duration_seconds, project_id, notes } = req.body;
            const userId = req.user?.userId;

            if (!userId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            // If project_id is provided, verify it belongs to the user
            if (project_id) {
                const projectCheck = await pool.query(
                    'SELECT id FROM projects WHERE id = $1 AND user_id = $2',
                    [project_id, userId]
                );

                if (projectCheck.rows.length === 0) {
                    res.status(404).json({ error: 'Project not found or does not belong to you' });
                    return;
                }
            }

            // Insert session
            const result = await pool.query(
                `INSERT INTO sessions (user_id, project_id, name, work_type, start_time, end_time, duration_seconds, notes)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                 RETURNING id, user_id, project_id, name, work_type, start_time, end_time, duration_seconds, notes, created_at`,
                [userId, project_id || null, name, work_type, start_time, end_time, duration_seconds, notes || null]
            );

            const session = result.rows[0];

            res.status(201).json({
                message: 'Session created successfully',
                session: {
                    id: session.id,
                    name: session.name,
                    workType: session.work_type,
                    startTime: session.start_time,
                    endTime: session.end_time,
                    durationSeconds: session.duration_seconds,
                    projectId: session.project_id,
                    notes: session.notes,
                    createdAt: session.created_at
                }
            });
        } catch (error) {
            console.error('Create session error:', error);
            res.status(500).json({
                error: 'Failed to create session',
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
);

/**
 * GET /api/sessions
 * Get all sessions for the authenticated user
 */
router.get(
    '/',
    [
        query('limit').optional().isInt({ min: 1, max: 100 }),
        query('offset').optional().isInt({ min: 0 }),
        query('work_type').optional().trim()
    ],
    async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const limit = parseInt(req.query.limit as string) || 50;
            const offset = parseInt(req.query.offset as string) || 0;
            const workType = req.query.work_type as string;

            let query = `
                SELECT 
                    s.id, s.name, s.work_type, s.start_time, s.end_time, 
                    s.duration_seconds, s.notes, s.created_at,
                    p.id as project_id, p.name as project_name, p.color as project_color
                FROM sessions s
                LEFT JOIN projects p ON s.project_id = p.id
                WHERE s.user_id = $1
            `;

            const params: any[] = [userId];
            let paramIndex = 2;

            if (workType) {
                query += ` AND s.work_type = $${paramIndex}`;
                params.push(workType);
                paramIndex++;
            }

            query += ` ORDER BY s.start_time DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
            params.push(limit, offset);

            const result = await pool.query(query, params);

            const sessions = result.rows.map(row => ({
                id: row.id,
                name: row.name,
                workType: row.work_type,
                startTime: row.start_time,
                endTime: row.end_time,
                durationSeconds: row.duration_seconds,
                notes: row.notes,
                createdAt: row.created_at,
                project: row.project_id ? {
                    id: row.project_id,
                    name: row.project_name,
                    color: row.project_color
                } : null
            }));

            res.json({
                sessions,
                count: sessions.length,
                limit,
                offset
            });
        } catch (error) {
            console.error('Get sessions error:', error);
            res.status(500).json({
                error: 'Failed to get sessions',
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
);

/**
 * GET /api/sessions/:id
 * Get a single session by ID
 */
router.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const { id } = req.params;

        const result = await pool.query(
            `SELECT 
                s.id, s.name, s.work_type, s.start_time, s.end_time, 
                s.duration_seconds, s.notes, s.created_at,
                p.id as project_id, p.name as project_name, p.color as project_color
             FROM sessions s
             LEFT JOIN projects p ON s.project_id = p.id
             WHERE s.id = $1 AND s.user_id = $2`,
            [id, userId]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Session not found' });
            return;
        }

        const row = result.rows[0];

        res.json({
            session: {
                id: row.id,
                name: row.name,
                workType: row.work_type,
                startTime: row.start_time,
                endTime: row.end_time,
                durationSeconds: row.duration_seconds,
                notes: row.notes,
                createdAt: row.created_at,
                project: row.project_id ? {
                    id: row.project_id,
                    name: row.project_name,
                    color: row.project_color
                } : null
            }
        });
    } catch (error) {
        console.error('Get session error:', error);
        res.status(500).json({
            error: 'Failed to get session',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

/**
 * DELETE /api/sessions/:id
 * Delete a session
 */
router.delete('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const { id } = req.params;

        const result = await pool.query(
            'DELETE FROM sessions WHERE id = $1 AND user_id = $2 RETURNING id',
            [id, userId]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Session not found' });
            return;
        }

        res.json({ message: 'Session deleted successfully' });
    } catch (error) {
        console.error('Delete session error:', error);
        res.status(500).json({
            error: 'Failed to delete session',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

export default router;
