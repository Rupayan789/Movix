import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import { rdb } from "../../services/firebaseConfig";
import { equalTo, get, orderByChild, query, ref } from "firebase/database";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { ToastContainer, toast } from 'react-toastify';

import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearUser, userLoginSuccess } from "../../redux/user/user-action";
import { clearPlaylists, fillUserPlaylists } from "../../redux/playlist/playlist-action";
import { ClipLoader } from "react-spinners";

const Login = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [password, setPassword] = useState("");
  const [loading,setLoading] = useState(false)

  const auth = getAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearUser())
    dispatch(clearPlaylists())
  },[])


  const onSubmit = async (e) => {
    e.preventDefault();
    if(!email) {
      setEmailError("Email field can't be blank");
    }
    if(!password) {
      setPasswordError("Password field can't be blank")
    }
    if (
      !email.match(
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
      )
    ) {
      setLoading(false);
      setEmailError("Please include an '@' in the email address");
      return;
    }
    setLoading(true)
    const isEmailPresent = await query(
      ref(rdb, "Users"),
      orderByChild("email"),
      equalTo(email)
    );
   
    get(isEmailPresent)
      .then((snapShot) => {
        if (snapShot.exists()) {
          signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
              const user = userCredential.user;
              const userValue = Object.values(snapShot.val())[0];
              const playlists = Object.values(userValue.Playlist)
              playlists.map((item,index)=>{
                if(item.movies){
                  item.movies=Object.values(item.movies);
                }
                return item;
              })
              dispatch(userLoginSuccess({
                id: userValue.id,
                email: userValue.email,
                joinedOn: userValue.joinedOn,
              }));
              dispatch(fillUserPlaylists({
                id:userValue.id,
                playlists:playlists,
              }))
              toast.success("Signed In Successfully")
              navigate("/home");
            })
            .catch((error) => {
              const errorMessage = error.message;
              setLoading(false);
              if (errorMessage.includes("wrong-password")) {
                toast.error("Wrong email or password");
              }
            });
          return;
        } else {
          setLoading(false);
          toast.error("User doesn't exist,Sign Up Instead");
          setEmailError("User doesn't exist,Sign Up Instead");
        }
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.message);
      });
  };
  return (
    <section
      className={`${styles.loginbg} grid place-items-center w-screen h-screen`}
    >
      <main className="flex flex-col bg-regal-dark md:w-1/4 sm:w-4/5 p-6 bg-gray-600 rounded-lg">
        <header className="text-2xl text-white font-bold tracking-wide text-center bg-regal-blue  bg-clip-text text-transparent">
          Sign In to Movix
        </header>
        <ToastContainer autoClose={2000}/>
        <br />
        <form className="flex flex-col" onSubmit={onSubmit}>
          <label className="bg-regal-blue  bg-clip-text text-transparent mb-1">
            Email
          </label>
          <input
            className="py-2 bg-zinc-900 border-2 border-zinc-500 shadow-lg focus:outline-none text-white text-md tracking-widest mb-4 rounded-lg px-4"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <p className="text-sm text-red-700">{emailError}</p>
          <label className="bg-regal-blue  bg-clip-text text-transparent mb-1">
            Password
          </label>
          <input
            className="py-2  bg-zinc-900 border-2 border-zinc-500 shadow-lg focus:outline-none text-white text-md tracking-widest rounded-lg px-4"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <p className="text-sm text-red-700">{passwordError}</p>
          <button
            className="bg-blue-400 bg-regal-blue text-white mt-4 py-2 text-lg rounded-lg w-1/3 mx-auto grid place-items-center"
            type="submit"
            disabled={loading}
            >
              {loading ? <ClipLoader size={20} color="#fff"/> :  "Sign In"}
          </button>
        </form>
        <p className="text-center text-gray-300 mt-2 text-md">
          Dont have an account yet?{" "}
          <span
            className="bg-regal-blue  bg-clip-text text-transparent cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </span>
        </p>
      </main>
      
    </section>
  );
};

export default Login;
