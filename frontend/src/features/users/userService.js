import api from "../../api/api";

const getAllUsers = async (params) => {
    const response = await api.get("/user/all-users", { params });
    return response.data.data;
};

const getMyProfile = async () => {
    const response = await api.get("/user/me");
    return response.data.data;
};

const updateMyProfile = async (payload) => {
    const response = await api.patch("/user/me/update", payload);
    return response.data.data;
};

const changeMyPassword = async (payload) => {
    const response = await api.patch("/user/me/change-password", payload);
    return response.data;
};

const updateUserStatus = async (userData) => {
    const response = await api.patch("/user/update-status", userData);
    return response.data.data;
};

const deleteUser = async (userId) => {
    const response = await api.delete(`/user/delete/${userId}`);
    if (!response?.data?.success) {
        throw new Error(response?.data?.message || "Failed to delete user");
    }

    return userId;
};

const userService = {
    getAllUsers,
    getMyProfile,
    updateMyProfile,
    changeMyPassword,
    updateUserStatus,
    deleteUser,
};

export default userService;