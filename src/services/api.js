import { getAuth, signOut } from "firebase/auth";
export const userLogout = () => {
  const auth = getAuth();
  
  return signOut(auth)
    // .then(() => {
    //   return {
    //     status: true,
    //     message: "",
    //   };
    // })
    // .catch((error) => {
    //   return {
    //     status: false,
    //     message: "",
    //   };
    // });
};
