import { createSlice } from "@reduxjs/toolkit";

const roleSlice = createSlice({
    name: "role",
    initialState: "",
    reducers: {
        loginRole: (state, action) => action.payload,
        logoutRole: () => ""
    }
});

export const RoleAction = roleSlice.actions;
export default roleSlice.reducer;
