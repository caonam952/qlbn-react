import { useContext } from "react";
import { useState } from "react";
import { createContext } from "react";
import { AuthContext } from "./auth.provider";

const StatisticsContext = createContext();

const StatisticsProvider = ({ children }) => {
  const { token } = useContext(AuthContext);

  const [totalPatient, setTotalPatient] = useState(0);
  const [totalPrescription, setTotalPrescription] = useState(0);

  const [prescriptionAttendingDoctor, setPrescriptionAttendingDoctor] =
    useState([]);

  const [prescriptionPatient, setPrescriptionPatient] = useState([]);
  const [prescriptionMonth, setPrescriptionMonth] = useState([]);

  const getTotalPatient = () => {
    var axios = require("axios");

    var config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "http://localhost:8080/api/patients/countPatient",
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        setTotalPatient(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const getTotalPrescription = () => {
    var axios = require("axios");

    var config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "http://localhost:8080/api/prescriptions/countPrescription",
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        setTotalPrescription(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const getPrescriptionAttendingDoctor = () => {
    var axios = require("axios");

    var config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "http://localhost:8080/api/prescriptions/countByAttendingDoctor",
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        setPrescriptionAttendingDoctor(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const getPrescriptionPatient = () => {
    var axios = require("axios");

    var config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "http://localhost:8080/api/prescriptions/countByPatient",
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        setPrescriptionPatient(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const getPrescriptionMonth = () => {
    var axios = require("axios");

    var config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "http://localhost:8080/api/prescriptions/countByMonth",
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        setPrescriptionMonth(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const value = {
    getTotalPatient,
    totalPatient,
    getPrescriptionAttendingDoctor,
    prescriptionAttendingDoctor,
    getTotalPrescription,
    totalPrescription,
    getPrescriptionPatient,
    prescriptionPatient,
    getPrescriptionMonth,
    prescriptionMonth,
  };

  return (
    <StatisticsContext.Provider value={value}>
      {children}
    </StatisticsContext.Provider>
  );
};

export { StatisticsContext, StatisticsProvider };
