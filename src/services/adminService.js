import { api, errorMessage } from './api';
import { env } from '../config/env';
import { projects as staticProjects } from '../data/projects';
import { skills as staticSkills } from '../data/skills';

// Modes: API (ASP.NET Core) > Firebase (messages + stats) > static preview.
// In Firebase mode, projects/skills are edited in code (src/data/*.js).
const firebaseOnly = env.firebase.enabled && !env.apiEnabled;
const guard = () => {
  if (env.apiEnabled) return;
  throw new Error(firebaseOnly ? 'Projects aur skills abhi code se edit hote hain (src/data/projects.js, skills.js).' : 'Connect the API (VITE_API_BASE_URL) to enable this action.');
};
const wrap = async (fn) => { try { return await fn(); } catch (e) { throw new Error(errorMessage(e)); } };
const fb = () => import('./firebaseData');

export const adminService = {
  async stats() {
    if (firebaseOnly) return (await fb()).adminStats();
    if (!env.apiEnabled) return { visitors: null, projectViews: null, messages: null, projects: staticProjects.length, skills: staticSkills.length };
    return wrap(async () => (await api.get('/admin/stats')).data);
  },
  async projects() {
    if (!env.apiEnabled) return staticProjects;
    return wrap(async () => (await api.get('/projects')).data);
  },
  async saveProject(project) {
    guard();
    return wrap(async () => (project.id && project._exists ? (await api.put(`/admin/projects/${project.id}`, project)) : (await api.post('/admin/projects', project))).data);
  },
  async deleteProject(id) { guard(); return wrap(() => api.delete(`/admin/projects/${id}`)); },
  async uploadImage(file) {
    guard();
    const form = new FormData();
    form.append('file', file);
    return wrap(async () => (await api.post('/admin/uploads', form, { headers: { 'Content-Type': 'multipart/form-data' } })).data);
  },
  async skills() {
    if (!env.apiEnabled) return staticSkills;
    return wrap(async () => (await api.get('/skills')).data);
  },
  async saveSkill(skill) {
    guard();
    return wrap(async () => (skill.id ? (await api.put(`/admin/skills/${skill.id}`, skill)) : (await api.post('/admin/skills', skill))).data);
  },
  async deleteSkill(id) { guard(); return wrap(() => api.delete(`/admin/skills/${id}`)); },
  async messages() {
    if (firebaseOnly) return (await fb()).adminMessages();
    if (!env.apiEnabled) return [];
    return wrap(async () => (await api.get('/admin/messages')).data);
  },
  async deleteMessage(id) {
    if (firebaseOnly) return (await fb()).deleteMessage(id);
    guard();
    return wrap(() => api.delete(`/admin/messages/${id}`));
  },
  async uploadResume(file) {
    guard();
    const form = new FormData();
    form.append('file', file);
    return wrap(() => api.post('/admin/resume', form, { headers: { 'Content-Type': 'multipart/form-data' } }));
  },
};
