// src/services/toolService.js
// All tool-related API calls

import api from './api';

const getTools = async (params = {}) => {
  const response = await api.get('/tools', { params });
  return response.data;
};

const getToolById = async (id) => {
  const response = await api.get(`/tools/${id}`);
  return response.data.data;
};

const getCategories = async () => {
  const response = await api.get('/categories');
  return response.data.data;
};

const submitTool = async (toolData) => {
  const response = await api.post('/tools/submit', toolData);
  return response.data.data;
};

const getMySubmissions = async () => {
  const response = await api.get('/users/submissions');
  return response.data.data;
};

const getMyFavourites = async () => {
  const response = await api.get('/users/favourites');
  return response.data.data;
};

const addToFavourites = async (toolId) => {
  const response = await api.post(`/users/favourites/${toolId}`);
  return response.data.data;
};

const removeFromFavourites = async (toolId) => {
  const response = await api.delete(`/users/favourites/${toolId}`);
  return response.data;
};

// Admin services
const adminGetDashboard = async () => {
  const response = await api.get('/admin/dashboard');
  return response.data.data;
};

const adminGetSubmissions = async (status = 'pending') => {
  const response = await api.get('/admin/submissions', { params: { status } });
  return response.data.data;
};

const adminReviewSubmission = async (id, payload) => {
  const response = await api.patch(`/admin/submissions/${id}/status`, payload);
  return response.data;
};

const adminGetAllTools = async (params = {}) => {
  const response = await api.get('/admin/tools', { params });
  return response.data;
};

const adminCreateTool = async (toolData) => {
  const response = await api.post('/admin/tools', toolData);
  return response.data.data;
};

const adminUpdateTool = async (id, toolData) => {
  const response = await api.put(`/admin/tools/${id}`, toolData);
  return response.data.data;
};

const adminDeleteTool = async (id) => {
  const response = await api.delete(`/admin/tools/${id}`);
  return response.data;
};

const adminGetUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data.data;
};

const adminToggleUserStatus = async (id) => {
  const response = await api.patch(`/admin/users/${id}/status`);
  return response.data.data;
};

const adminCreateCategory = async (data) => {
  const response = await api.post('/categories', data);
  return response.data.data;
};

const adminDeleteCategory = async (id) => {
  const response = await api.delete(`/categories/${id}`);
  return response.data;
};

const toolService = {
  getTools, getToolById, getCategories, submitTool,
  getMySubmissions, getMyFavourites, addToFavourites, removeFromFavourites,
  adminGetDashboard, adminGetSubmissions, adminReviewSubmission,
  adminGetAllTools, adminCreateTool, adminUpdateTool, adminDeleteTool,
  adminGetUsers, adminToggleUserStatus, adminCreateCategory, adminDeleteCategory,
};

export default toolService;

