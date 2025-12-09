import apiClient from "./axiosClient"; 
const userApi = {
  getUsers: (params) => apiClient.get("/users", { params }),
  getUserById: (id) => apiClient.get(`/users/${id}`),      
  createUser: (data) => apiClient.post("/users", data),
  updateUser: (id, data) => apiClient.put(`/users/${id}`, data),
  deleteUser: (id) => apiClient.delete(`/users/${id}`),
};

export default userApi;
