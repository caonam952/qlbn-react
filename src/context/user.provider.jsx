import { Modal } from "antd";
import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./auth.provider";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);

  const { token } = useContext(AuthContext);

  const findAll = () => {
    var axios = require("axios");

    var config = {
      method: "get",
      url: "http://localhost:8080/api/user/list",
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    axios(config)
      .then(function (response) {
        // console.log(JSON.stringify(response.data));
        setUsers(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const onDelete = (id) => {
    var axios = require("axios");

    var config = {
      method: "delete",
      url: "http://localhost:8080/api/user/" + id,
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    return new Promise((res, rej) => {
      axios(config)
        .then(function (response) {
          console.log(JSON.stringify(response.data));
          res(response);
        })
        .catch(function (error) {
          console.log(error);
          rej(error);
        });
    });
  };

  const onAddUser = (data) => {
    console.log(data);
    const role = [data.role];

    var axios = require("axios");
    var infoUser = JSON.stringify({
      username: data.username,
      name: data.name,
      email: data.email,
      password: data.password,
      role: role,
    });

    var config = {
      method: "post",
      url: "http://localhost:8080/api/auth/signup",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: infoUser,
    };

    return new Promise((res, rej) => {
      axios(config)
        .then(function (response) {
          // console.log(JSON.stringify(response.data));
          res(response);
        })
        .catch(function (error) {
          console.log(error);
          rej(error);
        });
    });
  };

  // const onUpdateUser = (data) => {

  //   const role = [data.role];

  //   console.log(data);
  //   var axios = require("axios");
  //   var infoUser = JSON.stringify({
  //     username: data.username,
  //     email: data.email,
  //     password: data.password,
  //     role: role,
  //   });

  //   var config = {
  //     method: "put",
  //     url: "http://localhost:8080/api/users/" + data.id,
  //     headers: {
  //       Authorization: "Bearer " + token,
  //       "Content-Type": "application/json",
  //     },
  //     data: infoUser,
  //   };

  //   return new Promise((res, rej) => {
  //     axios(config)
  //       .then(function (response) {
  //         // console.log(JSON.stringify(response.data));
  //         res(response);
  //       })
  //       .catch(function (error) {
  //         console.log(error);
  //         rej(error);
  //       });
  //   });
  // };

  const value = { findAll, users, setUsers, onDelete, onAddUser };

  useEffect(() => {
    findAll();
  }, []);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export { UserContext, UserProvider };
