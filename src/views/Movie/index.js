import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BiSearch, BiLogOut } from "react-icons/bi";
import axios from "axios";
import { Baseurl } from "../../baseurl";
import Modal from "../../components/Modal";
import { MdPlaylistPlay } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { ref, update } from "firebase/database";
import { rdb } from "../../services/firebaseConfig";
import { fillUserPlaylists } from "../../redux/playlist/playlist-action";
import { userLogout } from "../../services/api";
import { ToastContainer, toast } from "react-toastify";
import { css } from "@emotion/react";
import { GridLoader } from "react-spinners";
const Movie = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [show, setShow] = useState(false);
  const [added, setAdded] = useState(false);
  const playlist = useSelector((state) => state.playlists);
  const dbRef = ref(rdb);
  const dispatch = useDispatch();

  useEffect(() => {
    searchMovieById(params.id);
  }, []);

  const addToPlaylist = async (e) => {
    e.preventDefault();
    const form = document.querySelector("#addplaylist");
    let inputs = form.getElementsByTagName("input");
    const p = [];
    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i].checked) {
        p.push(inputs[i].name);
      }
    }
    let updates = {};
    const promises = await p.map((item, index) => {
      return new Promise((resolve, reject) => {
        updates = {};
        updates[
          `Users/${playlist.id}/Playlist/${item.toLowerCase()}/movies/${
            movie.imdbID
          }`
        ] = movie;
        update(dbRef, updates)
          .then(async () => {
            playlist.playlists = await playlist.playlists.map((ppl, index) => {
              if (ppl.name == item) {
                if (!ppl.movies) {
                  ppl.movies = [movie];
                } else {
                  ppl.movies.push(movie);
                }
              }
              return ppl;
            });
            resolve(true);
          })
          .catch((err) => {
            reject(err.message);
          });
      });
    });
    Promise.all(promises)
      .then(() => {
        try {
          setAdded(true);
          setShow(false);
          toast.success("Added to playlist");
          dispatch(fillUserPlaylists(playlist));
        } catch (err) {
          toast.error(err);
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  const searchMovieById = async (id) => {
    try {
      const response = await axios.get(
        `${Baseurl}?apikey=${process.env.REACT_APP_API_KEY}&i=${id}`
      );
      setMovie(response.data);
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const handleLogout = () => {
    userLogout()
      .then(() => {
        navigate("/login");
      })
      .catch((err) => toast.error(err.message));
  };

  return (
    <div className="w-screen h-fit md:h-screen bg-regal-dark px-6 md:px-2">
      <header className="w-full md:w-1/2 mx-auto pt-4">
        <nav className="flex justify-between items-center">
          <h1
            className="bg-regal-blue bg-clip-text text-transparent flex-1   font-bold  text-2xl md:text-4xl text-white text-lg cursor-pointer"
            onClick={() => navigate("/home")}
          >
            Movix
          </h1>
          <aside className="flex ">
          <span
              className="ml-4 flex items-center text-white bg-gray-800 hover:bg-gray-600 p-2 cursor-pointer"
              onClick={() => navigate("/playlist")}
            >
              <span className="mr-2 md:mr-4 pl-1 text-sm">Playlist</span>
              <MdPlaylistPlay color="#b3cdd1" size={30} />
            </span>
            <span
              className="ml-2 md:ml-4 bg-gray-800 flex items-center text-white hover:bg-gray-600 px-2 py-1 cursor-pointer"
              onClick={handleLogout}
            >
              <span className="mr-2 md:mr-4 pl-1 text-sm">Logout</span>
              <BiLogOut color="#b3cdd1" size={25} />
            </span>
          </aside>
        </nav>
      </header>
      {movie ? (
        <section className="mb-12 md:mb-0">
          <section className="flex flex-col md:flex-row mt-12 w-full md:w-1/2 mx-auto text-xl text-gray-500 ">
            <aside className="w-1/2 md:w-1/3 ">
              <img src={movie.Poster} alt="movie-poster" />
            </aside>
            <main className="mt-4 md:mt-0 md:ml-8 md:w-2/3">
              <h1 className="text-white text-2xl md:text-5xl">{movie.Title}</h1>
              <h4 className="mt-4">
                Genre : <span>{movie.Genre}</span>
              </h4>
              <h4 className="mt-4 text-sm text-yellow-300">
                Director : <span>{movie.Director}</span>
              </h4>
              <h4 className="mt-4 text-sm text-yellow-300">
                Actors : <span>{movie.Actors}</span>
              </h4>
              <h3 className="mt-4 text-sm text-yellow-300">
                IMdB Rating : <span>{movie.imdbRating}</span>
              </h3>
              <div className="mt-4 text-sm text-gray-300">{movie.Plot}</div>
            </main>
          </section>
          <section className="mt-4 md:w-1/2 mx-auto flex justify-end">
            {added ? (
              <button className="bg-regal-blue py-2 px-4 focus:outline-none border-none font-bold">
                Added
              </button>
            ) : (
              <button
                className="bg-regal-blue py-2 px-4 focus:outline-none border-none font-bold"
                onClick={() => setShow(true)}
              >
                Add To Playlist
              </button>
            )}
          </section>
          <Modal show={show} onClose={() => setShow(false)}>
            <div className="text-white  my-8 mx-8">
              {playlist.playlists.length == 0 ? (
                <div>
                  <h1 className="text-white text-xl text-center mt-24">
                    There are no playlists created yet
                  </h1>
                  <button className="bg-transparent border-2 border-stone-500 py-2 px-4 rounded-md mt-4 w-full hover:border-white transition-all ease-in-out delay-50"
                   onClick={()=>navigate('/playlist')}>
                    Create one
                  </button>
                </div>
              ) : (
                <React.Fragment>
                  <h1 className="text-white text-2xl text-center">
                    Add to Playlist
                  </h1>
                  <div className="text-white flex justify-between my-4">
                    <label>Select Playlists to add to</label>
                    {/* <button className="flex items-center hover:text-stone-400">Create a new Playlist <AiOutlinePlus className="ml-2" size={20}/></button> */}
                  </div>
                  <form
                    id="addplaylist"
                    className="flex flex-col w-full"
                    onSubmit={addToPlaylist}
                  >
                    {playlist.playlists.length > 0 &&
                      playlist.playlists.map((item, index) => {
                        return (
                          <div
                            key={index}
                            className="flex items-center w-full mb-4"
                          >
                            <input
                              className="w-5 h-5"
                              type="checkbox"
                              value={item.name}
                              name={item.name}
                            />
                            <aside className="ml-8 text-xl hover:text-stone-400">
                              {item.name}
                            </aside>
                          </div>
                        );
                      })}

                    <button
                      type="submit"
                      className="bg-transparent border-2 border-stone-500 py-2 px-4 rounded-md mt-4 w-full hover:border-white transition-all ease-in-out delay-50"
                    >
                      Add
                    </button>
                  </form>
                </React.Fragment>
              )}
            </div>
          </Modal>
          <ToastContainer autoClose="2000" />
        </section>
      ) : (
        <section className="mt-20 md:mt-48 flex justify-center h-full">
          <GridLoader color="#42378F" loading={!movie} size={20} />
        </section>
      )}
    </div>
  );
};

export default Movie;
