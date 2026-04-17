import api from "../../api/api";

const register = async (userData) => {
    const response = await api.post("/user/register", userData);
    return response.data.data;
};

const login = async (userData) => {
    const response = await api.post("/user/login", userData);
    return response.data.data; // Returns {user, accessToken, refreshToken}
};

const getCurrentUser = async () => {
    const response = await api.get("/user/me");
    return response.data.data;
};

const logout = async () => {
    const response = await api.post("/user/logout");
    return response.data;
};

const authService = {
    register,
    login,
    getCurrentUser,
    logout,
};

export default authService;