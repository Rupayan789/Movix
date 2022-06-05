import ActionTypes from "../action-type";

export const fillUserPlaylists = (playlists) => {
  return ({
    type: ActionTypes.FILL_USER_PLAYLISTS,
    payload: playlists,
  });
};
export const clearPlaylists = () => ({
    type:ActionTypes.CLEAR_PLAYLISTS,
})