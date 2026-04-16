import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "./userService";

export const fetchUsers = createAsyncThunk(
    "users/getAll",
    async (params, thunkAPI) => {
        try {
            return await userService.getAllUsers(params);
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const removeUser = createAsyncThunk(
    "users/delete",
    async (id, thunkAPI) => {
        try {
            return await userService.deleteUser(id);
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const initialState = {
    users: [],
    totalUsers: 0,
    totalPages: 1,
    currentPage: 1,
    isLoading: false,
    isError: false,
    message: "",
};

const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        resetUserStatus: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.message = "";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.users = action.payload.users;
                state.totalUsers = action.payload.totalUsers;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(removeUser.fulfilled, (state, action) => {
                state.users = state.users.filter((user) => user._id !== action.payload);
            });
    },
});

export const { resetUserStatus } = userSlice.actions;
export default userSlice.reducer;