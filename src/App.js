import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./views/Login";
import Signup from "./views/Signup";
import Home from "./views/home";
import Movie from "./views/Movie";
import Playlist from "./views/Playlist";
import IndividualPlaylist from "./views/IndividualPlaylist";
import { useSelector } from "react-redux";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import 'react-toastify/dist/ReactToastify.css';
import { css } from "@emotion/react";
import NoResource from "./views/NoResource/NoResource";
function App() {
  const user = useSelector((state) => state.user);
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/home" element={<PrivateRoute />}>
        <Route path="/home" element={<Home />} />
      </Route>
      <Route path="/playlist" element={<PrivateRoute />}>
        <Route path="/playlist" element={<Playlist />} />
      </Route>
      <Route path="/movie/:id" element={<PrivateRoute />}>
        <Route path="/movie/:id" element={<Movie />} />
      </Route>
      <Route
        path={`/:userId/playlist/:playlistname`}
        element={<PrivateRoute />}
      >
        <Route
          path={`/:userId/playlist/:playlistname`}
          element={<IndividualPlaylist />}
        />
      </Route>
      <Route path="*" element={<NoResource/>}/>
    </Routes>
  );
}

export default App;
