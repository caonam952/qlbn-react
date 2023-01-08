import "./App.css";
import { Login } from "./page/login/Login";
import { AuthContext, AuthProvider } from "./context/auth.provider";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import React, { useContext, useState, useEffect } from "react";
import MyLayout from "./component/layout/Layout";
import { Patient } from "./page/patient/Patient";
import { Employee } from "./page/employee/Employee";
import { Medicine } from "./page/medicine/Medicine";
import Unauthorize from "./page/notification/Unauthorize";
import { User } from "./page/User/User";
import { Record } from "./page/record/Record";
import { PrintPrescription } from "./page/print/PrintPrescription";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/dang-nhap" element={<Login />} />

          <Route path="/" element={<MyLayout />}>
            <Route path="/moderator/patient" element={<Patient />} />

            <Route path="/moderator/medicine" element={<Medicine />} />

            <Route path="/admin/employee" element={<Employee />} />

            <Route path="/admin/user" element={<User />} />

            <Route path="/record/patientId=:id" element={<Record />} />
          </Route>
          <Route path="/not-found" element={<Unauthorize />} />
          <Route
            path="/record/print_prescription/prescriptionId=:id"
            element={<PrintPrescription />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
