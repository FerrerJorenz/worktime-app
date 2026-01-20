import apiClient from './client';

export interface SessionData {
    name: string;
    workType: string;
    startTime: string;
    endTime: string;
    durationSeconds: number;
    projectId?: string;
    notes?: string;
}

export interface Session {
    id: string;
    name: string;
    workType: string;
    startTime: string;
    endTime: string;
    durationSeconds: number;
    notes?: string;
    createdAt: string;
    project?: {
        id: string;
        name: string;
        color: string;
    };
}

export interface SessionsResponse {
    sessions: Session[];
    count: number;
    limit: number;
    offset: number;
}

export interface CreateSessionResponse {
    message: string;
    session: Session;
}

/**
 * Create a new work session
 */
export const createSession = async (data: SessionData): Promise<Session> => {
    const payload = {
        name: data.name,
        work_type: data.workType,
        start_time: data.startTime,
        end_time: data.endTime,
        duration_seconds: data.durationSeconds,
        project_id: data.projectId,
        notes: data.notes
    };

    const response = await apiClient.post<CreateSessionResponse>('/api/sessions', payload);
    return response.data.session;
};

/**
 * Get all sessions for the current user
 */
export const getSessions = async (params?: {
    limit?: number;
    offset?: number;
    workType?: string;
}): Promise<SessionsResponse> => {
    const response = await apiClient.get<SessionsResponse>('/api/sessions', { params });
    return response.data;
};

/**
 * Get a single session by ID
 */
export const getSession = async (id: string): Promise<Session> => {
    const response = await apiClient.get<{ session: Session }>(`/api/sessions/${id}`);
    return response.data.session;
};

/**
 * Delete a session
 */
export const deleteSession = async (id: string): Promise<void> => {
    await apiClient.delete(`/api/sessions/${id}`);
};
