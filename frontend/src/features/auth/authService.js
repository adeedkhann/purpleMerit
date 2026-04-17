import api from "../../api/api";

const register = async (userData) => {
    const response = await api.post("/user/register", userData);
    return response.data.data;
};

const login = async (userData) => {
    const response = await api.post("/user/login", userData);
    return response.data.data; // Returns {user, accessToken, refreshToken}
};

const logout = async () => {
    const response = await api.post("/user/logout");
    return response.data;
};

const authService = {
    register,
    login,
    logout,
};

export default authService;