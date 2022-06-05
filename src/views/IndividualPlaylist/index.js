import React, { useEffect, useState } from "react";
import { BiLogOut } from "react-icons/bi";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { MdPlaylistPlay } from "react-icons/md";
import Card from "../../components/Card";
import { useSelector } from "react-redux";
import { child, get, ref } from "firebase/database";
import { rdb } from "../../services/firebaseConfig";
import { ToastContainer, toast } from "react-toastify";
import { GridLoader } from "react-spinners";
import { userLogout } from "../../services/api";

const IndividualPlaylist = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noAllow,setNoAllow] = useState(false)
  const user = useSelector((state) => state.user);
  const dbRef = ref(rdb);


  useEffect(() => {
    setNoAllow(false)
    getPlaylist();
  }, []);


  const getPlaylist = async () => {
    let tags = [];
    let s = "";
    for (let i = 0; i < location.pathname.length; i++) {
      if (location.pathname[i] == "/") {
        if (s.length) {
          tags.push(s);
        }
        s = "";
      } else {
        s = s + location.pathname[i];
      }
    }
    if (s.length) {
      tags.push(s);
    }
    get(
      child(dbRef, `Users/${tags[0]}/Playlist/${tags[2].toLowerCase()}`)
    ).then((ss) => {
      if (ss.exists()) {
        const val = ss.val();
        setLoading(false);
        if (val.view == "private" && user.id != tags[0]) {
          // toast.error("You are not allowed to see this playlist");
          setNoAllow(true)
        } else {
          val.movies = val.movies ? Object.values(val.movies) : [];
          setPlaylist(val);
        }
      } else {
        toast.error("Invalid Link");
      }
    });
  };

  const handleLogout = () => {
    userLogout()
      .then(() => {
        navigate("/login");
      })
      .catch((err) => toast.error(err.message));
  };

  return (
    <div className="w-screen h-fit md:h-screen bg-regal-dark px-4 md:px-2 ">
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
              className="ml-4 flex  items-center text-white bg-gray-800 hover:bg-gray-600 p-2 cursor-pointer"
              onClick={() => navigate("/playlist")}
            >
              <span className="mr-2 md:mr-4 text-sm pl-1">Playlist</span>
              <MdPlaylistPlay color="#b3cdd1" size={30} />
            </span>
            <span
              className="ml-2 md:ml-8 bg-gray-800 flex items-center text-white hover:bg-gray-600 p-2 cursor-pointer"
              onClick={handleLogout}
            >
              <span className="mr-2 md:mr-4 text-sm pl-1">Logout</span>
              <BiLogOut color="#b3cdd1" size={25} />
            </span>
          </aside>
        </nav>
      </header>
      <section className="mt-20 flex flex-col w-full md:w-1/2 mx-auto ">
        {loading ? (
          <section className="mb-12 md:mt-48 flex justify-center h-full">
            <GridLoader color="#42378F" loading={loading} size={20} />
          </section>
        ) : playlist && playlist.name ? (
          <React.Fragment>
            <div className="flex justify-center">
              <h1 className="bg-white  bg-clip-text text-transparent text-2xl md:text-3xl  py-2 border-t-2 border-b-2 border-stone-300 px-2 mb-4">
                {playlist.name}
              </h1>
            </div>

            <div className="grid md:grid-cols-3 gap-x-4 gap-y-8 my-12">
              {playlist.movies.length > 0 ? (
                playlist.movies.map((item, index) => {
                  return (
                    <main key={index} className="">
                      <Card key={index} details={item}></Card>
                    </main>
                  );
                })
              ) : (
                <main className="mb-24 w-full col-span-3">
                  <h1 className="text-xl text-white p-4 text-stone-400 mb-4 text-center">
                    You have not added any movies to this playlist yet
                  </h1>
                </main>
              )}
            </div>
          </React.Fragment>
        ) : (
          <main className="grid place-items-center my-8">
            <h1 className="text-xl text-white p-4 text-red-400 mb-4">
              {noAllow ? "You are not allowed to see this playlist" : "No playlist exists with this link"}
            </h1>
            {/* <button className="text-2xl border-2 border-white hover:bg-regal-blue p-4 text-white">
              Create a new Playlist
            </button> */}
          </main>
        )}
      </section>
      <ToastContainer autoClose="2000" />
    </div>
  );
};

export default IndividualPlaylist;
