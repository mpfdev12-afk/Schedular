import {configureStore} from "@reduxjs/toolkit";
import Userslice from "./userSlice";
import RoleSlice from "./roleSlice";
const store = configureStore({
    reducer:{
        user:Userslice,
        role:RoleSlice
    }
});

export default store;