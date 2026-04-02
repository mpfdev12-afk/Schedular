import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name:"User",
    initialState:{},
    reducers:{
        loginUser:(state,action)=>{
            return action.payload || {};
        },
        logoutUser:(state,action)=>{
            return {};
        }
    }
});

export const Useraction = userSlice.actions;
export default userSlice.reducer;