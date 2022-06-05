import ActionTypes from "../action-type"

const INITIAL_STATE = {
    id:null,
    playlists:[],
}
const playlistReducer=(state=INITIAL_STATE,action)=>{
    switch(action.type){
        case ActionTypes.FILL_USER_PLAYLISTS:
            return {
                ...state,
                id:action.payload.id,
                playlists:action.payload.playlists
            }
        case ActionTypes.UPDATE_USER_PLAYLISTS:
            return {
                ...state,
                id:action.payload.id,
                playlists:action.payload.playlists
            }
        case ActionTypes.CLEAR_PLAYLISTS:
            return {
                ...INITIAL_STATE
            }
        default:
            return state;
    }

}

export default playlistReducer
