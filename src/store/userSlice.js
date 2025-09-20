import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name:"User",
    initialState:{},
    reducers:{
        loginUser:(store,action)=>{
            return action.payload;
        },
        logoutUser:(store,action)=>{
            return {};
        }
    }
});

export const Useraction = userSlice.actions;
export default userSlice.reducer;