import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "./userService";

const getErrorMessage = (error) => {
    return (
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong"
    );
};

export const fetchUsers = createAsyncThunk(
    "users/getAll",
    async (params, thunkAPI) => {
        try {
            return await userService.getAllUsers(params);
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error));
        }
    }
);

export const fetchMyProfile = createAsyncThunk(
    "users/getMyProfile",
    async (_, thunkAPI) => {
        try {
            return await userService.getMyProfile();
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error));
        }
    }
);

export const updateMyProfile = createAsyncThunk(
    "users/updateMyProfile",
    async (payload, thunkAPI) => {
        try {
            return await userService.updateMyProfile(payload);
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error));
        }
    }
);

export const changeMyPassword = createAsyncThunk(
    "users/changeMyPassword",
    async (payload, thunkAPI) => {
        try {
            return await userService.changeMyPassword(payload);
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error));
        }
    }
);

export const updateUserAccess = createAsyncThunk(
    "users/updateAccess",
    async (payload, thunkAPI) => {
        try {
            return await userService.updateUserStatus(payload);
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error));
        }
    }
);

export const removeUser = createAsyncThunk(
    "users/delete",
    async (id, thunkAPI) => {
        try {
            return await userService.deleteUser(id);
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error));
        }
    }
);

const initialState = {
    users: [],
    myProfile: null,
    totalUsers: 0,
    totalPages: 1,
    currentPage: 1,
    isLoading: false,
    isProfileLoading: false,
    isUpdatingProfile: false,
    isChangingPassword: false,
    isSuccess: false,
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
            state.isSuccess = false;
            state.message = "";
        },
        clearUserMessage: (state) => {
            state.message = "";
            state.isError = false;
            state.isSuccess = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
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
            .addCase(fetchMyProfile.pending, (state) => {
                state.isProfileLoading = true;
                state.isError = false;
            })
            .addCase(fetchMyProfile.fulfilled, (state, action) => {
                state.isProfileLoading = false;
                state.myProfile = action.payload;
            })
            .addCase(fetchMyProfile.rejected, (state, action) => {
                state.isProfileLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(updateMyProfile.pending, (state) => {
                state.isUpdatingProfile = true;
                state.isError = false;
                state.isSuccess = false;
            })
            .addCase(updateMyProfile.fulfilled, (state, action) => {
                state.isUpdatingProfile = false;
                state.isSuccess = true;
                state.myProfile = action.payload;
                state.message = "Profile updated successfully";
            })
            .addCase(updateMyProfile.rejected, (state, action) => {
                state.isUpdatingProfile = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(changeMyPassword.pending, (state) => {
                state.isChangingPassword = true;
                state.isError = false;
                state.isSuccess = false;
            })
            .addCase(changeMyPassword.fulfilled, (state, action) => {
                state.isChangingPassword = false;
                state.isSuccess = true;
                state.message = action.payload?.message || "Password changed successfully";
            })
            .addCase(changeMyPassword.rejected, (state, action) => {
                state.isChangingPassword = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(updateUserAccess.fulfilled, (state, action) => {
                const updatedUser = action.payload;
                state.users = state.users.map((user) =>
                    user._id === updatedUser._id ? updatedUser : user
                );
                state.isSuccess = true;
                state.isError = false;
                state.message = "User access updated";
            })
            .addCase(updateUserAccess.rejected, (state, action) => {
                state.isError = true;
                state.isSuccess = false;
                state.message = action.payload;
            })
            .addCase(removeUser.fulfilled, (state, action) => {
                state.users = state.users.filter((user) => user._id !== action.payload);
                state.totalUsers = Math.max(0, state.totalUsers - 1);
            })
            .addCase(removeUser.rejected, (state, action) => {
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { resetUserStatus, clearUserMessage } = userSlice.actions;
export default userSlice.reducer;