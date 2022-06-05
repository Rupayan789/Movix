import ActionTypes from "../action-type"

export const userSignupSuccess = (user) => ({
    type:ActionTypes.SIGNUP_USER_SUCCESS,
    payload:user
})

export const userLoginSuccess = (user) => ({
    type:ActionTypes.LOGIN_USER_SUCCESS,
    payload:user
})

export const clearUser = (user) => ({
    type:ActionTypes.CLEAR_USER,
})