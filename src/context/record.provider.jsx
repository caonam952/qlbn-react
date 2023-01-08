import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./auth.provider";

const RecordContext = createContext();

const RecordProvider = ({ children }) => {
  const [record, setRecord] = useState([]);

  const { token } = useContext(AuthContext);

  const getRecordById = (id) => {
    var axios = require("axios");

    var config = {
      method: "get",
      url: "http://localhost:8080/api/records/" + id,
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        setRecord(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const getRecordByPatientId = async (id) => {
    var axios = require("axios");

    var config = {
      method: "get",
      url: "http://localhost:8080/api/records/patientId=" + id,
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    // await axios(config)
    //   .then(function (response) {
    //     console.log(JSON.stringify(response.data));
    //     setRecord(response.data);
    //   })
    //   .catch(function (error) {
    //     setRecord({
    //       // id: null,
    //       medicalHistory: null,
    //       productInUse: null,
    //       diagnose: null,
    //       result: null,
    //       regimen: null,
    //       preImage: null,
    //       afterImage: null,
    //     });
    //     console.log(error);
    //   });

    return new Promise((res, rej) => {
      axios(config)
        .then(function (response) {
          // console.log(JSON.stringify(response.data));
          setRecord(response.data);
          res(response);
        })
        .catch(function (error) {
          // console.log(error);
          rej(error);
        });
    });
  };

  // const getRecordByPatientId = (id) => {
  //   var axios = require("axios");

  //   var config = {
  //     method: "get",
  //     url: "http://localhost:8080/api/records/patientId=" + id,
  //     headers: {
  //       Authorization: "Bearer " + token,
  //     },
  //   };

  //   return new Promise((res, rej) => {
  //     axios(config)
  //       .then(function (response) {
  //         // console.log(JSON.stringify(response.data));
  //         setRecord(response.data);
  //         res(response);
  //       })
  //       .catch(function (error) {
  //         setRecord({
  //           id: null,
  //           medicalHistory: null,
  //           productInUse: null,
  //           diagnose: null,
  //           result: null,
  //           regimen: null,
  //           preImage: null,
  //           afterImage: null,
  //         });
  //       });
  //   });
  // };

  const onAddRecord = (data) => {
    // console.log(data);
    var axios = require("axios");
    var infoRecord = JSON.stringify({
      medicalHistory: data.medicalHistory,
      productInUse: data.productInUse,
      diagnose: data.diagnose,
      result: data.result,
      regimen: data.regimen,
      preImage: data.preImage,
      afterImage: data.afterImage,
      patientDto: { id: data?.patientDto?.id },
    });

    var config = {
      method: "post",
      url: "http://localhost:8080/api/records",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: infoRecord,
    };

    return new Promise((res, rej) => {
      axios(config)
        .then(function (response) {
          // console.log(JSON.stringify(response.data));
          res(response);
          
        })
        .catch(function (error) {
          // console.log(error);
          rej(error);
        });
    });
  };

  const onUpdateRecord = (data) => {
    console.log(data);
    var axios = require("axios");
    var infoRecord = JSON.stringify({
      medicalHistory: data.medicalHistory,
      productInUse: data.productInUse,
      diagnose: data.diagnose,
      result: data.result,
      regimen: data.regimen,
      preImage: data.preImage,
      afterImage: data.afterImage,
      patientDto: { id: data?.patientDto?.id },
    });

    var config = {
      method: "put",
      url: "http://localhost:8080/api/records/" + data.id,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: infoRecord,
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
    getRecordById,
    getRecordByPatientId,
    record,
    setRecord,
    onUpdateRecord,
    onAddRecord,
  };

  return (
    <RecordContext.Provider value={value}>{children}</RecordContext.Provider>
  );
};

export { RecordContext, RecordProvider };
