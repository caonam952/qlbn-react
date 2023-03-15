import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./auth.provider";
import moment from "moment";

const PrescriptionContext = createContext();

const PrescriptionProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [prescriptions, setPrescriptions] = useState([]);
  const [prescription, setPrescription] = useState([]);

  const getPrescriptionsByPatientId = (id) => {
    var axios = require("axios");

    var config = {
      method: "get",
      url: "http://localhost:8080/api/prescriptions/patientId=" + id,
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    // axios(config)
    //   .then(function (response) {
    //     console.log(JSON.stringify(response.data));
    //     setPrescriptions(response.data);
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   });

    return new Promise((res, rej) => {
      setPrescriptions("");
      axios(config)
        .then(function (response) {
          // console.log(JSON.stringify(response.data));
          setPrescriptions(response.data);
          res(response);
        })
        .catch(function (error) {
          // console.log(error);
          rej(error);
        });
    });
  };

  const onAddPrescription = (data) => {
    var axios = require("axios");
    var data = JSON.stringify({
      prescriptionDate: moment(data.prescriptionDate).format("DD/MM/YYYY"),
      appointmentDate: moment(data.appointmentDate).format("DD/MM/YYYY"),
      attendingDoctor: data.attendingDoctor,
      note: data.note,
      patientDto: {
        id: data?.patientDto,
      },
      // employeeDto: {
      //   id: data?.employeeDto,
      // },
    });

    var config = {
      method: "post",
      url: "http://localhost:8080/api/prescriptions",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    };

    return new Promise((res, rej) => {
      axios(config)
        .then(function (response) {
          console.log(JSON.stringify(response.data));
          res(response);
        })
        .catch(function (error) {
          // console.log(error);
          rej(error);
        });
    });
  };

  const onDeletePrescription = (id) => {
    var axios = require("axios");

    var config = {
      method: "delete",
      url: "http://localhost:8080/api/prescriptions/" + id,
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    return new Promise((res, rej) => {
      axios(config)
        .then(function (response) {
          res(response);
        })
        .catch(function (error) {
          console.log(error);
          rej(error);
        });
    });
  };

  const findPrescriptionById = (id) => {
    var axios = require("axios");

    var config = {
      method: "get",
      url: "http://localhost:8080/api/prescriptions/" + id,
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    return new Promise((res, rej) => {
      axios(config)
        .then(function (response) {
          console.log(JSON.stringify(response.data));
          setPrescription(response.data);
          res(response);
        })
        .catch(function (error) {
          // console.log(error);
          rej(error);
        });
    });
  };

  const value = {
    prescriptions,
    prescription,
    getPrescriptionsByPatientId,
    onAddPrescription,
    onDeletePrescription,
    findPrescriptionById,
  };

  return (
    <PrescriptionContext.Provider value={value}>
      {children}
    </PrescriptionContext.Provider>
  );
};

export { PrescriptionContext, PrescriptionProvider };
