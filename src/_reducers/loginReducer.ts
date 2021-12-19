import { constants } from "@actions/constants";
import { AnyAction } from "redux";

interface LoginState {
    user: string
}

const initialState: LoginState = {
    user: ''
}

export function loginReducer(state = initialState, action: AnyAction) {
    switch(action.type) {
        default:
            return state;
        case constants.LOGIN:
            return {
                user: action.user
            };
        case constants.LOGOUT:
            return initialState;
    }
}
