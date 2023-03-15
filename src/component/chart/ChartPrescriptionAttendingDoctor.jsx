import { Column } from "@ant-design/plots";
import { Divider } from "antd";
import { useContext, useEffect } from "react";
import { StatisticsContext } from "../../context/statistics.provider";

export const ChartPrescriptionAttendingDoctor = () => {
  const { prescriptionAttendingDoctor ,getPrescriptionAttendingDoctor } = useContext(StatisticsContext);

  useEffect(() => {
    getPrescriptionAttendingDoctor();
  }, []);
  const data = prescriptionAttendingDoctor;
  console.log(data);

  const config = {
    data,
    xField: "name",
    yField: "value",
    seriesField: "name",
    legend: {
      position: "top-left",
    },

    minBarWidth: 30,
    maxBarWidth: 30,
  };

  return (
    <div>
      <Divider orientation="left">
        Số lượng đơn thuốc đã được kê theo bác sĩ phụ trách
      </Divider>
      <Column {...config} />
    </div>
  );
};
