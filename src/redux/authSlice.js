import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        loading: false,
        user: null,

    },
    reducers: {
        // actions
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
        },
        logoutUser: (state) => {
            state.user = null;
        }
    }
});

export const { setLoading, setUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;