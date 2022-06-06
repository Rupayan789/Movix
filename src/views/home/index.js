import axios from "axios";
import React, { useState } from "react";
import { BiSearch, BiLogOut } from "react-icons/bi";
import { MdPlaylistPlay } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { Baseurl } from "../../baseurl";
import Card from "../../components/Card";
import MovieList from "../../MovieList.json";
import { userLogout } from "../../services/api";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
  const [movies, setMovies] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    userLogout()
      .then(() => {
        navigate("/login");
      })
      .catch((err) => toast.error(err.message));
  };

  const debounce = (fn, d) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn.apply(this, args);
      }, d);
    };
  };

  const handleSearch = debounce((e) => {
    setError(null)
    if (e.target.value) searchMovie(e.target.value);
    else {
      setMovies(null);
      setError(null)
    }
  }, 500);

  const searchMovie = async (title) => {
    try {
      const response = await axios.get(
        `${Baseurl}?apikey=${process.env.REACT_APP_API_KEY}&t=${title}`
      );
    
      if (response.data.Response == "True") {
        setError(null);
        setMovies(response.data);
      } else {
        setError("No movies found with this name,Try something else");
        setMovies(null);
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="w-screen h-fit md:h-screen bg-regal-dark px-6 md:px-2  overflow-x-hidden">
      <header className="w-full md:w-1/2 mx-auto pt-4">
        <nav className="flex justify-between items-center">
          <h1
            className="bg-regal-blue bg-clip-text text-transparent flex-1   font-bold  text-2xl md:text-4xl text-white text-lg cursor-pointer"
            onClick={() => navigate("/home")}
          >
            Movix
          </h1>
          <aside className="w-1/3 flex justify-between items-center bg-gray-800 shadow-lg py-1 px-2 mr-4">
            <input
              className=" text-gray-400 w-full bg-gray-800 py-1 px-2 focus:outline-none"
              placeholder="Search"
              type="text"
              onChange={handleSearch}
            />
            <BiSearch color="#b3cdd1" />
          </aside>
          <aside className=" flex">
            <span
              className=" flex items-center text-white bg-gray-800 hover:bg-gray-600 px-2 py-1 cursor-pointer"
              onClick={() => navigate("/playlist")}
            >
              <span className="mr-4 pl-1 hidden md:inline-block">Playlist</span>
              <MdPlaylistPlay color="#b3cdd1" size={30} />
            </span>
            <span
              className="ml-2 md:ml-4 bg-gray-800 flex items-center text-white hover:bg-gray-600 px-2 py-1 cursor-pointer"
              onClick={handleLogout}
            >
              <span className="mr-4 pl-1 hidden md:inline-block">Logout</span>
              <BiLogOut color="#b3cdd1" size={25} />
            </span>
          </aside>
        </nav>
      </header>
      <section className="mt-20 w-full md:w-1/2 mx-auto text-xl text-gray-500">
        <header className="bg-regal-blue bg-clip-text text-transparent text-xl md:text-3xl font-bold md:text-left text-center">
          {movies || error ? "Search Result" : "Trending Movies"}
        </header>
        {/* <label className="bg-regal-blue bg-clip-text text-transparent text-4xl font-bold">
          A
        </label> */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-4 justify-between w-full mt-16">
          {error ? (
            <div className="text-xl col-span-3">{error}</div>
          ) : !movies ? (
            MovieList.map((item, index) => {
              return (
                <Card key={index} details={item} addPlaylist={(e) => 1}></Card>
              );
            })
          ) : (
            <Card details={movies} addPlaylist={(e) => 1} />
          )}
        </div>
      </section>
      <ToastContainer autoClose="2000"/>
    </div>
  );
};

export default Home;
