import { Modal } from "antd";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./auth.provider";
import moment from "moment";

const PatientContext = createContext();

const PatientProvider = ({ children }) => {
  const [patients, setPatients] = useState([]);

  const [patient, setPatient] = useState([]);

  const { token } = useContext(AuthContext);

  const findAllPatients = () => {
    var config = {
      method: "get",
      url: "http://localhost:8080/api/patients/list",
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    axios(config)
      .then(function (response) {
        // console.log(JSON.stringify(response.data));
        setPatients(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const onAddPatient = (data) => {
    // console.log(data);
    var axios = require("axios");
    var infoPatient = JSON.stringify({
      name: data.name,
      birth: moment(data.birth).format("DD/MM/YYYY"),
      sex: data.sex,
      address: data.address,
      phone: data.phone,
      email: data.email,
      note: data.note,
    });

    var config = {
      method: "post",
      url: "http://localhost:8080/api/patients",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: infoPatient,
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

  const onUpdatePatient = (data) => {
    console.log(data);
    var axios = require("axios");
    var infoPatient = JSON.stringify({
      name: data.name,
      birth: moment(data.birth).format("DD/MM/YYYY"),
      sex: data.sex,
      address: data.address,
      phone: data.phone,
      email: data.email,
      note: data.note,
    });

    var config = {
      method: "put",
      url: "http://localhost:8080/api/patients/" + data.id,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: infoPatient,
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

  const getPatientById = (id) => {
    var axios = require("axios");

    var config = {
      method: "get",
      url: "http://localhost:8080/api/patients/" + id,
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        setPatient(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const onDeletePatient = (id) => {
    var axios = require("axios");

    var config = {
      method: "delete",
      url: "http://localhost:8080/api/patients/" + id,
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
    findAllPatients,
    patients,
    setPatients,
    onDeletePatient,
    onAddPatient,
    onUpdatePatient,
    getPatientById,
    patient, setPatient
  };

  useEffect(() => {
    findAllPatients();
  }, []);

  return (
    <PatientContext.Provider value={value}>{children}</PatientContext.Provider>
  );
};

export { PatientContext, PatientProvider };
