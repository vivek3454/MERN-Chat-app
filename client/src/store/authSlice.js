import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    username: localStorage.getItem("username") || null,
    id:  localStorage.getItem("userId") || null
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            localStorage.setItem("username", action.payload.username);
            localStorage.setItem("userId", action.payload.id);
            state.username = action.payload.username;
            state.id = action.payload.id;
        },
        logout: (state) => {
            state.username = null;
            state.id = null;
        }
    }
});

export default authSlice.reducer;
export const { login, logout } = authSlice.actions;
