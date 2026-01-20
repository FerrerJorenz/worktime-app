import apiClient from './client';

export interface ProjectData {
    name: string;
    description?: string;
    color?: string;
}

export interface Project {
    id: string;
    name: string;
    description?: string;
    color: string;
    isArchived: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ProjectsResponse {
    projects: Project[];
    count: number;
}

export interface CreateProjectResponse {
    message: string;
    project: Project;
}

/**
 * Create a new project
 */
export const createProject = async (data: ProjectData): Promise<Project> => {
    const response = await apiClient.post<CreateProjectResponse>('/api/projects', data);
    return response.data.project;
};

/**
 * Get all projects for the current user
 */
export const getProjects = async (includeArchived = true): Promise<Project[]> => {
    const response = await apiClient.get<ProjectsResponse>('/api/projects', {
        params: { include_archived: includeArchived }
    });
    return response.data.projects;
};

/**
 * Update a project
 */
export const updateProject = async (
    id: string,
    data: Partial<ProjectData & { is_archived: boolean }>
): Promise<Project> => {
    const response = await apiClient.put<CreateProjectResponse>(`/api/projects/${id}`, data);
    return response.data.project;
};

/**
 * Delete (archive) a project
 */
export const deleteProject = async (id: string): Promise<void> => {
    await apiClient.delete(`/api/projects/${id}`);
};
