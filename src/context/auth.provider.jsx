import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Alert, notification } from "antd";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(window.sessionStorage.getItem("token"));
  const [user, setUser] = useState(null);

  const [formdata, setFormdata] = useState({
    username: "",
    password: "",
  })

  useEffect(() => {
    setUser(JSON.parse(window.sessionStorage.getItem("user")));
    setToken(window.sessionStorage.getItem("token"));
  }, [token]);

  const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("user"));
  };  

  const login = async () => {
    var data = JSON.stringify(formdata);

    // console.log(data);

    var config = {
      method: "post",
      url: "http://localhost:8080/api/auth/signin",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        var responseJson = response.data;
        // console.log(responseJson);
        if (response.status === 200) {
          notification.success({
            message: "SUCCESS",
            description: "Successful Login.",
            duration: 2
          });
          setUser(response.data.user);
          window.sessionStorage.setItem("token", responseJson["token"]);
          setToken(response.data.token);
          window.sessionStorage.setItem("user", JSON.stringify(responseJson));
          // if (response.data.user?.roles?.includes("ROLE_ADMIN")) {
          //   return navigate("/admin");
          // }
          // if (response.data.user?.roles?.includes("ROLE_MODERATOR")) {
          //   return navigate("/moderator");
          // }
          // if (response.data.user?.roles?.includes("ROLE_USER")) {
          //   return navigate("/user");
          // }
          // navigate("/");
        }
      })
      .catch(function (error) {
        notification["error"]({
          message: "ERROR",
          description: "Invalid Username/Password" ,
          duration: 2
        });
        console.log(error);
      });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    window.sessionStorage.removeItem("token");
    window.sessionStorage.removeItem("user");
  }

  const value = {
    user,
    token,
    setToken,
    setUser,
    getCurrentUser,
    logout,
    login,
    formdata, 
    setFormdata
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthProvider, AuthContext };
