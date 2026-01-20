import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { pool } from '../config/database';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * POST /api/projects
 * Create a new project
 */
router.post(
    '/',
    [
        body('name').trim().notEmpty().withMessage('Project name is required'),
        body('description').optional().trim(),
        body('color').optional().matches(/^#[0-9A-F]{6}$/i).withMessage('Color must be a valid hex code')
    ],
    async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            const { name, description, color } = req.body;
            const userId = req.user?.userId;

            if (!userId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const result = await pool.query(
                `INSERT INTO projects (user_id, name, description, color)
                 VALUES ($1, $2, $3, $4)
                 RETURNING id, user_id, name, description, color, is_archived, created_at`,
                [userId, name, description || null, color || '#00E599']
            );

            const project = result.rows[0];

            res.status(201).json({
                message: 'Project created successfully',
                project: {
                    id: project.id,
                    name: project.name,
                    description: project.description,
                    color: project.color,
                    isArchived: project.is_archived,
                    createdAt: project.created_at
                }
            });
        } catch (error) {
            console.error('Create project error:', error);
            res.status(500).json({
                error: 'Failed to create project',
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
);

/**
 * GET /api/projects
 * Get all projects for the authenticated user
 */
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const includeArchived = req.query.include_archived !== 'false';

        let query = `
            SELECT id, name, description, color, is_archived, created_at, updated_at
            FROM projects
            WHERE user_id = $1
        `;

        if (!includeArchived) {
            query += ' AND is_archived = false';
        }

        query += ' ORDER BY created_at DESC';

        const result = await pool.query(query, [userId]);

        const projects = result.rows.map(row => ({
            id: row.id,
            name: row.name,
            description: row.description,
            color: row.color,
            isArchived: row.is_archived,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        }));

        res.json({
            projects,
            count: projects.length
        });
    } catch (error) {
        console.error('Get projects error:', error);
        res.status(500).json({
            error: 'Failed to get projects',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

/**
 * PUT /api/projects/:id
 * Update a project
 */
router.put(
    '/:id',
    [
        body('name').optional().trim().notEmpty().withMessage('Project name cannot be empty'),
        body('description').optional().trim(),
        body('color').optional().matches(/^#[0-9A-F]{6}$/i).withMessage('Color must be a valid hex code'),
        body('is_archived').optional().isBoolean().withMessage('is_archived must be a boolean')
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

            const { id } = req.params;
            const { name, description, color, is_archived } = req.body;

            // Check if project exists and belongs to user
            const checkResult = await pool.query(
                'SELECT id FROM projects WHERE id = $1 AND user_id = $2',
                [id, userId]
            );

            if (checkResult.rows.length === 0) {
                res.status(404).json({ error: 'Project not found' });
                return;
            }

            // Build update query dynamically
            const updates: string[] = [];
            const values: any[] = [];
            let paramIndex = 1;

            if (name !== undefined) {
                updates.push(`name = $${paramIndex++}`);
                values.push(name);
            }
            if (description !== undefined) {
                updates.push(`description = $${paramIndex++}`);
                values.push(description);
            }
            if (color !== undefined) {
                updates.push(`color = $${paramIndex++}`);
                values.push(color);
            }
            if (is_archived !== undefined) {
                updates.push(`is_archived = $${paramIndex++}`);
                values.push(is_archived);
            }

            if (updates.length === 0) {
                res.status(400).json({ error: 'No updates provided' });
                return;
            }

            values.push(id, userId);

            const result = await pool.query(
                `UPDATE projects 
                 SET ${updates.join(', ')}
                 WHERE id = $${paramIndex++} AND user_id = $${paramIndex++}
                 RETURNING id, name, description, color, is_archived, created_at, updated_at`,
                values
            );

            const project = result.rows[0];

            res.json({
                message: 'Project updated successfully',
                project: {
                    id: project.id,
                    name: project.name,
                    description: project.description,
                    color: project.color,
                    isArchived: project.is_archived,
                    createdAt: project.created_at,
                    updatedAt: project.updated_at
                }
            });
        } catch (error) {
            console.error('Update project error:', error);
            res.status(500).json({
                error: 'Failed to update project',
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
);

/**
 * DELETE /api/projects/:id
 * Delete (archive) a project
 */
router.delete('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const { id } = req.params;

        // Archive instead of hard delete
        const result = await pool.query(
            `UPDATE projects 
             SET is_archived = true 
             WHERE id = $1 AND user_id = $2
             RETURNING id`,
            [id, userId]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Project not found' });
            return;
        }

        res.json({ message: 'Project archived successfully' });
    } catch (error) {
        console.error('Delete project error:', error);
        res.status(500).json({
            error: 'Failed to delete project',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

export default router;
