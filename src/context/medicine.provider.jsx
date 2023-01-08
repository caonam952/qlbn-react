import { useContext } from "react";
import { useState } from "react";
import { createContext } from "react";
import { AuthContext } from "./auth.provider";
import { Button, Table, Modal, Input, Select, Form, InputNumber } from "antd";
import moment from "moment";

const MedicineContext = createContext();

const MedicineProvider = ({ children }) => {
  const [medicines, setMedicines] = useState([]);

  const { token } = useContext(AuthContext);

  const findAll = () => {
    var axios = require("axios");

    var config = {
      method: "get",
      url: "http://localhost:8080/api/medicines/list",
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    axios(config)
      .then(function (response) {
        // console.log(JSON.stringify(response.data));
        setMedicines(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const onAddMedicine = (data) => {
    var axios = require("axios");
    var infoMedicine = JSON.stringify({
      id: data.id,
      name: data.name,
      origin: data.origin,
      uni: data.uni,
      amount: data.amount,
      importDate: moment(data.importDate).format("DD/MM/YYYY"),
      expDate: moment(data.expDate).format("DD/MM/YYYY"),
      manual: data.manual,
      importPrice: data.importPrice,
      price: data.price,
      note: data.note,
    });

    var config = {
      method: "post",
      url: "http://localhost:8080/api/medicines",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: infoMedicine,
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

  const onUpdateMedicine = (data) => {
    console.log(data);
    var axios = require("axios");
    var infoMedicine = JSON.stringify({
      name: data.name,
      origin: data.origin,
      uni: data.uni,
      amount: data.amount,
      importDate: moment(data.importDate).format("DD/MM/YYYY"),
      expDate: moment(data.expDate).format("DD/MM/YYYY"),
      manual: data.manual,
      importPrice: data.importPrice,
      price: data.price,
      note: data.note,
    });

    var config = {
      method: "put",
      url: "http://localhost:8080/api/medicines/" + data.id,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: infoMedicine,
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

  const onDelete = (id) => {
    var axios = require("axios");

    var config = {
      method: "delete",
      url: "http://localhost:8080/api/medicines/" + id,
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

  const value = { findAll, medicines, setMedicines, onDelete, onAddMedicine, onUpdateMedicine };

  return (
    <MedicineContext.Provider value={value}>
      {children}
    </MedicineContext.Provider>
  );
};

export { MedicineContext, MedicineProvider };
