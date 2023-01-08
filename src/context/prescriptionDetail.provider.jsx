import { createContext, useContext } from "react";
import { useState } from "react";
import { AuthContext } from "./auth.provider";
import axios from "axios";

const PrescriptionDetailContext = createContext();

const PrescriptionDetailProvider = ({ children }) => {
  const [prescriptionDetails, setPrescriptionDetails] = useState([]);

  const { token } = useContext(AuthContext);
  const [prescriptionId, setPrescriptionId] = useState();

  const findAllByPrescriptionId = async (id) => {
    var config = {
      method: "get",
      url:
        "http://localhost:8080/api/prescription_details/prescriptionId=" + id,
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    return new Promise((res, rej) => {
      setPrescriptionDetails("");
      axios(config)
        .then(function (response) {
          // console.log(JSON.stringify(response.data));
          setPrescriptionDetails(response.data);
          res(response);
        })
        .catch(function (error) {
          // console.log(error);
          rej(error);
        });
    });
  };

  const onDelete = (id) => {
    var config = {
      method: "delete",
      url: "http://localhost:8080/api/prescription_details/" + id,
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

  const onAddPrescriptionDetail = (data) => {
    console.log(data);

    var infoPrescriptionDetail = JSON.stringify({
      medicine: data.medicine,
      amount: data.amount,
      dosage: data.dosage,
      prescriptionDto: { id: data?.prescriptionId },
    });

    console.log(data?.prescriptionDto);

    var config = {
      method: "post",
      url: "http://localhost:8080/api/prescription_details",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: infoPrescriptionDetail,
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

  const onUpdatePrescriptionDetail = (data) => {
    console.log(data);

    var infoPrescriptionDetail = JSON.stringify({
      medicine: data.medicine,
      amount: data.amount,
      dosage: data.dosage,
      prescriptionDto: { id: data?.prescriptionDto?.id },
    });

    var config = {
      method: "put",
      url: "http://localhost:8080/api/prescription_details/" + data.id,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: infoPrescriptionDetail,
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
    prescriptionDetails,
    setPrescriptionDetails,
    onDelete,
    onAddPrescriptionDetail,
    findAllByPrescriptionId,
    onUpdatePrescriptionDetail,
  };
  return (
    <PrescriptionDetailContext.Provider value={value}>
      {children}
    </PrescriptionDetailContext.Provider>
  );
};

export { PrescriptionDetailContext, PrescriptionDetailProvider };
