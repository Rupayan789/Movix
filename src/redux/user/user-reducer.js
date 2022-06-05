import ActionTypes from "../action-type"

const INITIAL_STATE = {
    id:null,
    email:null,
    joinedOn:null,
    isLoggedIn:false,
    isSignedUp:false
}
const userReducer=(state=INITIAL_STATE,action)=>{
    switch(action.type){
        case ActionTypes.LOGIN_USER_SUCCESS:
            return {
                ...state,
                id:action.payload.id,
                email:action.payload.email,
                joinedOn:action.payload.joinedOn,
                isLoggedIn:true,
                isSignedUp:true
            }
        case ActionTypes.SIGNUP_USER_SUCCESS:
            return {
                ...state,
                id:action.payload.id,
                email:action.payload.email,
                joinedOn:action.payload.joinedOn,
                isLoggedIn:true,
                isSignedUp:true
            }
        case ActionTypes.CLEAR_USER:
            return {
                ...INITIAL_STATE
            }
        default:
            return state;
    }

}

export default userReducer
