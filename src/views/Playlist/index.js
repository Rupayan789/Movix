import React, { useEffect, useState } from "react";
import { BiLogOut } from "react-icons/bi";
import { useNavigate, useParams } from "react-router-dom";
import { MdPlaylistPlay } from "react-icons/md";
import PlaylistSvg from "../../assets/playlist.svg";
import Modal from "../../components/Modal";
import { useDispatch, useSelector } from "react-redux";
import { rdb } from "../../services/firebaseConfig";
import { child, get, ref, set } from "firebase/database";
import { userLogout } from "../../services/api";
import { fillUserPlaylists } from "../../redux/playlist/playlist-action";
import { ToastContainer, toast } from 'react-toastify';

const Playlist = () => {
  const dbRef = ref(rdb);
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [access, setAccess] = useState(1);
  const [error, setError] = useState(null);
  const user = useSelector((state) => state.user);
  const playlist = useSelector((state) => state.playlists);
  const [userPlaylist, setUserPlaylist] = useState(playlist);
  const dispatch = useDispatch();

  const handleLogout = () => {
    userLogout()
      .then(() => {
        navigate("/login");
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const createPlaylist = async (e) => {
    e.preventDefault();
    setError(null);
    const playlistName = e.target.name.value;
    get(child(dbRef, `Users/${user.id}/Playlist/${playlistName.toLowerCase()}`))
      .then((ss) => {
        if (ss.exists()) {
          setError("Playlist with this name already exists");
        } else {
          set(
            child(
              dbRef,
              `Users/${user.id}/Playlist/${playlistName.toLowerCase()}`
            ),
            {
              name: playlistName,
              view: access == 1 ? "public" : "private",
            }
          )
            .then(() => {
              toast.success("Successfully created playlist");
              
              playlist.playlists.push({
                name: playlistName,
                view: access == 1 ? "public" : "private",
              });
              
              setUserPlaylist(playlist);
              dispatch(
                fillUserPlaylists({
                  id: user.id,
                  playlists: playlist.playlists,
                })
              );
              setShow(false);
            })
            .catch((err) => {
              setShow(false);
              toast.error(err.message);
            });
        }
      })
      .catch((err) =>toast.error(err.message));
  };

  return (
    <div className="w-screen h-fit md:h-screen bg-regal-dark px-4 md:px-2  ">
      <header className="w-full md:w-1/2 mx-auto pt-4">
        <nav className="flex justify-between items-center">
          <h1
            className="bg-regal-blue bg-clip-text text-transparent flex-1   font-bold  text-2xl md:text-4xl text-white text-lg cursor-pointer"
            onClick={() => navigate("/home")}
          >
            Movix
          </h1>

          <aside className=" flex  ">
            <span
              className="ml-4 flex items-center text-white bg-gray-800 hover:bg-gray-600 p-2 cursor-pointer"
              onClick={() => navigate("/playlist")}
            >
              <span className="mr-2 md:mr-4 pl-1 text-sm">Playlist</span>
              <MdPlaylistPlay color="#b3cdd1" size={30} />
            </span>
            <span
              className="ml-2 md:ml-8 bg-gray-800 flex items-center  text-white hover:bg-gray-600 p-2 cursor-pointer"
              onClick={() => navigate("/playlist")}
            >
              <span className="mr-2 md:mr-4 pl-1 text-sm" onClick={handleLogout}>
                Logout
              </span>
              <BiLogOut color="#b3cdd1" size={25} />
            </span>
          </aside>
        </nav>
      </header>
      <section className="mt-20 flex flex-col w-full md:w-1/2 mx-auto ">
        {userPlaylist && userPlaylist.playlists.length > 0 ? (
          <React.Fragment>
            <div className="flex justify-between" >
              <h1 className="bg-white  bg-clip-text text-transparent text-2xl mb-4">
                My Playlists{" "}
              </h1>
              <button
                className="text-sm border-2  px-4 border-zinc-700 hover:bg-regal-blue p-2 text-white"
                onClick={() => setShow(true)}
              >
                Create a new Playlist
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8  my-12">
              {userPlaylist.playlists.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="w-full bg-zinc-700 hover:bg-zinc-800 shadow-lg rounded-md w-full md:w-4/5 hover:scale-110 transition-all mb-4 md:mb-0 px-4 py-8"
                    onClick={() =>
                      navigate(`/${user.id}/playlist/${item.name}`)
                    }
                  >
                    <img
                      className="w-28 mx-auto "
                      src={PlaylistSvg}
                      alt="movie-poster"
                    />
                    <div className="bg-regal-blue bg-clip-text text-transparent text-xl text-center mt-8">
                      {item.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </React.Fragment>
        ) : (
          <main className="grid place-items-center my-8">
            <h1 className="text-4xl text-white p-4 text-stone-400 mb-4">
              You have not created any playlist yet
            </h1>
            <button
              className="text-2xl border-2 border-white hover:bg-regal-blue p-4 text-white"
              onClick={() => setShow(true)}
            >
              Create a new Playlist
            </button>
          </main>
        )}
      </section>
      <Modal show={show} onClose={() => setShow(false)}>
        <form className="text-white h-full  my-8 mx-8" onSubmit={createPlaylist}>
          <h1 className="text-white text-2xl text-center">
            Enter the name of the playlist
          </h1>
          {error && (
            <p className="text-sm text-red-600 text-center my-2">{error}</p>
          )}
          <div className="text-white flex justify-between my-4">
            <input
              type="text"
              name="name"
              className="rounded-md p-4 bg-transparent w-full focus:outline-none border-2 border-zinc-600"
            />
          </div>
          <div className="flex justify-between rounded-full overflow-hidden ">
            <span
              className={`flex-1 px-5 py-3 ${
                access == 1 ? "bg-regal-blue" : "bg-stone-800"
              }  rounded-tl-full rounded-bl-full text-center cursor-pointer`}
              onClick={() => setAccess(1)}
            >
              Public
            </span>
            <span
              className={`flex-1 px-5 py-3 ${
                access == 2 ? "bg-regal-blue" : "bg-stone-800"
              }  rounded-tr-full rounded-br-full border-zinc-400 text-center cursor-pointer`}
              onClick={() => setAccess(2)}
            >
              Private
            </span>
          </div>
          <button
            type="submit"
            className="bg-transparent  border-2 border-stone-500 py-2 px-4 rounded-md mt-12 w-full hover:border-white transition-all ease-in-out delay-50"
          >
            Create
          </button>
        </form>
      </Modal>
      <ToastContainer autoClose="2000"/>
    </div>
  );
};

export default Playlist;
