import { combineReducers } from 'redux';
import playlistReducer from './playlist/playlist-reducer';
import userReducer from './user/user-reducer';

export const rootReducer=combineReducers({
    user:userReducer,
    playlists:playlistReducer
})

export default rootReducer