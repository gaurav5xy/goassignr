import { configureStore } from "@reduxjs/toolkit";
import loaderSlice from "./loaderSlice";

const store = configureStore ({
    reducer : {
        load : loaderSlice,
    }
})

export default store