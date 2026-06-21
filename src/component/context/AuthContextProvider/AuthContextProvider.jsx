import axios from "axios";
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);

  const [token, setToken] = useState(function () {
    return localStorage.getItem("token");
  });

  async function getUserData() {
    if (!localStorage.getItem("token")) return null;

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}users/profile-data`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        },
      );

      setUserData(res.data.user || res.data.data?.user); 
      return res.data.user;
    } catch (error) {
      setUserData(null);
      return null;
    }
  }

  useEffect(() => {
    if (token) {
      getUserData();
    }
  }, []);

  const T = { userData, setUserData, getUserData };
  
  return <AuthContext.Provider value={T}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;