import { combineReducers } from "redux";
import { loginReducer } from "@reducers/loginReducer";

export const rootReducer = combineReducers({
    login: loginReducer    
});
