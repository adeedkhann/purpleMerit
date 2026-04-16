import api from "../../api/api";

// Fetch paginated and searchable users (Requirement 3.4)
const getAllUsers = async (params) => {
    // params can include { page, limit, search, role, status }
    const response = await api.get("/user/all-users", { params });
    return response.data.data; 
};

const updateUserStatus = async (userData) => {
    const response = await api.patch("/user/update-status", userData);
    return response.data.data;
};

// Delete user 
const deleteUser = async (userId) => {
    const response = await api.delete(`/user/delete/${userId}`);
    return userId; // Return ID to remove it from state locally
};

const userService = {
    getAllUsers,
    updateUserStatus,
    deleteUser,
};

export default userService;