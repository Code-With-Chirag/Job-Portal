import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    users: [],
    status: 'idle',
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setAllUsers: (state, action) => {
            state.users = action.payload;
            state.status = 'succeeded';
        },
        // Add other reducers as needed
    },
});

export const { setAllUsers } = userSlice.actions;

export default userSlice.reducer;