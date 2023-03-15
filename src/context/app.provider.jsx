import { Record } from "../page/record/Record";
import { AuthProvider } from "./auth.provider";
import { EmployeeProvider } from "./employee.provider";
import { MedicineProvider } from "./medicine.provider";
import { PatientProvider } from "./patient.provider";
import { PrescriptionProvider } from "./prescription.provider";
import { PrescriptionDetailProvider } from "./prescriptionDetail.provider";
import { RecordProvider } from "./record.provider";
import { StatisticsProvider } from "./statistics.provider";
import { UserProvider } from "./user.provider";

const combineComponents = (...components) => {
  return components.reduce(
    (AccumulatedComponents, CurrentComponent) => {
      return ({ children }) => {
        return (
          <AccumulatedComponents>
            <CurrentComponent>{children}</CurrentComponent>
          </AccumulatedComponents>
        );
      };
    },
    ({ children }) => <>{children}</>
  );
};

const providers = [
  AuthProvider,
  PatientProvider,
  EmployeeProvider,
  MedicineProvider,
  UserProvider,
  RecordProvider,
  PrescriptionProvider,
  PrescriptionDetailProvider,
  StatisticsProvider
];

export const AppContextProvider = combineComponents(...providers);
