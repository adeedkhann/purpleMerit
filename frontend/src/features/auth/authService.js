import api from "../../api/api";

const login = async (userData) => {
    const response = await api.post("/user/login", userData);
    return response.data.data; // Returns {user, accessToken, refreshToken}
};

const logout = async () => {
    const response = await api.post("/user/logout");
    return response.data;
};

const authService = {
    login,
    logout,
};

export default authService;