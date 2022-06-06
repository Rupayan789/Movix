import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import { rdb } from "../../services/firebaseConfig";
import {
  child,
  equalTo,
  get,
  orderByChild,
  query,
  ref,
  set,
} from "firebase/database";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { ToastContainer, toast } from 'react-toastify';

import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearUser, userSignupSuccess } from "../../redux/user/user-action";
import { clearPlaylists } from "../../redux/playlist/playlist-action";
import { ClipLoader } from "react-spinners";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading,setLoading] = useState(false)
  const dbRef = ref(rdb);
  const auth = getAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(clearUser())
    dispatch(clearPlaylists())
  },[])

  const onSubmit = async (e) => {
    setPasswordError("");
    setEmailError("")
    e.preventDefault();
    if(!email) {
      setEmailError("Email field can't be blank");
    }
    if(!password || !confirmPassword) {
      setPasswordError("Password field can't be blank")
    }
    if (
      !email.match(
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
      )
    ) {
      setEmailError("Please include an '@' in the email address");
      return;
    } else if (password && confirmPassword && password != confirmPassword) {
      setPasswordError("Password doesn't matches");
      return;
    } else if (password.length < 8) {
      setPasswordError("Password cant be less than 8 characters");
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
          setLoading(false);
          setEmailError("Email already exists");
          return;
        } else {
          createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
              const user = userCredential.user;
              // console.log(userCredential)
              set(child(dbRef, `Users/${user.uid}`), {
                id: user.uid,
                email: email,
                joinedOn: Date.now(),
              })
                .then((res) => {
                  dispatch(
                    userSignupSuccess({
                      id: user.uid,
                      email: email,
                      joinedOn: Date.now(),
                    })
                  );
                  toast.success("Signed Up successfully")
                  navigate("/home");
                })
                .catch((err) => {
                  setLoading(false)
                  toast.error(err.message);
                });
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              setLoading(false)
              toast.error(errorMessage, errorCode);
            });
        }
      })
      .catch((err) => {
        setLoading(false)
        toast.error(err.message);
      });
  };
  return (
    <section
      className={`${styles.loginbg} grid place-items-center w-screen h-screen`}
    >
      <main className="flex flex-col bg-regal-dark md:w-1/4 sm:w-4/5 p-6 bg-gray-600 rounded-lg">
        <header className="text-2xl text-white font-bold tracking-wide text-center bg-regal-blue  bg-clip-text text-transparent">
          Sign Up to Movix
        </header>
        <ToastContainer autoClose="2000"/>
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
            className="py-2 bg-zinc-900 border-2 border-zinc-500 shadow-lg focus:outline-none text-white text-md tracking-widest rounded-lg px-4"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <p className="text-sm text-red-700">{passwordError}</p>
          <label className="bg-regal-blue  bg-clip-text text-transparent mt-4 mb-1">
            Confirm Password
          </label>
          <input
            className="py-2 bg-zinc-900 border-2 border-zinc-500 shadow-lg focus:outline-none text-white text-md tracking-widest rounded-lg px-4"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            className="bg-blue-400 bg-regal-blue text-white mt-4 py-2 text-lg rounded-lg w-1/3 mx-auto focus:outline-none grid place-items-center"
            type="submit"
            disabled={loading}
          >
            {loading ? <ClipLoader size={20} color="#fff"/> :  "Sign Up"}
          </button>
        </form>
        <p className="text-center text-gray-300 mt-2 text-md">
          Already have an account?{" "}
          <span
            className="bg-regal-blue  bg-clip-text text-transparent cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Sign In
          </span>
        </p>
      </main>
    </section>
  );
};

export default Signup;
