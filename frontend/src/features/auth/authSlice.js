import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";

export const register = createAsyncThunk(
    "auth/register",
    async (user, thunkAPI) => {
        try {
            return await authService.register(user);
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const login = createAsyncThunk(
    "auth/login",
    async (user, thunkAPI) => {
        try {
            return await authService.login(user);
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
    try {
        return await authService.logout();
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});
const initialState = {
    user: null, 
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: "",
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = "";
        },
        setUser: (state, action) => {
            state.user = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.isSuccess = false;
                state.message = "";
            })
            .addCase(register.fulfilled, (state) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = "Registration completed successfully";
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.message = action.payload;
            })
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.isSuccess = false;
                state.message = "";
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload.user;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
            });
    },
});

export const { reset, setUser } = authSlice.actions;
export default authSlice.reducer;