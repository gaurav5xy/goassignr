import { createSlice } from "@reduxjs/toolkit";

const loaderSlice = createSlice({
    name : "Loader",

    initialState : {
        loading : false
    },

    reducers : {
        isLoading : (state, action)=>{
            state.loading = action.payload;
        }
    }
})

export const {isLoading} = loaderSlice.actions;
export default loaderSlice.reducer