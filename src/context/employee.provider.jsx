import { Modal } from "antd";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./auth.provider";

const EmployeeContext = createContext();

const EmployeeProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]);

  const { token } = useContext(AuthContext);

  const findAllEmployees = () => {
    var axios = require("axios");

    var config = {
      method: "get",
      url: "http://localhost:8080/api/employees/list",
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        setEmployees(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const onDelete = (id) => {
    var axios = require("axios");

    var config = {
      method: "delete",
      url: "http://localhost:8080/api/employees/" + id,
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
          Modal.error({
            title: "Không thể xóa nhân viên này!!!",
            content: "Nhân viên này đã kê đơn.",
          });
          console.log(error);
          rej(error);
        });
    });
  };

  const onAddEmployee = (data) => {
    console.log(data);
    var axios = require("axios");
    var infoEmployee = JSON.stringify({
      name: data.name,
      position: data.position,
      phone: data.phone,
      email: data.email,
      conditionStatus: data.conditionStatus,
    });

    var config = {
      method: "post",
      url: "http://localhost:8080/api/employees",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: infoEmployee,
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

  const onUpdateEmployee = (data) => {
    console.log(data);
    var axios = require("axios");
    var infoEmployee = JSON.stringify({
      name: data.name,
      position: data.position,
      phone: data.phone,
      email: data.email,
      conditionStatus: data.conditionStatus,
    });

    var config = {
      method: "put",
      url: "http://localhost:8080/api/employees/" + data.id,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: infoEmployee,
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

  const detailEmployee = (id) => {
    var axios = require("axios");

    var config = {
      method: "get",
      url: "http://localhost:8080/api/employees/" + id,
      headers: {
        Authorization: "Bearer " + token,
      },
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

  const value = {
    findAllEmployees,
    employees,
    setEmployees,
    onDelete,
    onAddEmployee,
    onUpdateEmployee,
    detailEmployee,
  };

  useEffect(() => {
    findAllEmployees();
  }, []);

  return (
    <EmployeeContext.Provider value={value}>
      {children}
    </EmployeeContext.Provider>
  );
};

export { EmployeeContext, EmployeeProvider };
