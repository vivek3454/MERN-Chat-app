import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    username: null,
    id: null
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
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
