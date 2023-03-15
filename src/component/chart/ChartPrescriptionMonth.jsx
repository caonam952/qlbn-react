import { useContext, useEffect } from "react";
import { StatisticsContext } from "../../context/statistics.provider";
import { Line } from "@ant-design/plots";
import { Divider } from "antd";

export const ChartPrescriptionMonth = () => {
  const { prescriptionMonth, getPrescriptionMonth } =
    useContext(StatisticsContext);

  useEffect(() => {
    getPrescriptionMonth();
  }, []);

  const data = prescriptionMonth;

  const config = {
    data,
    padding: "auto",
    xField: "name",
    yField: "value",
    xAxis: {
      tickCount: 5,
    },
    slider: {
      start: 0,
      end: 1,
    },
  };

  return (
    <div>
    <Divider orientation="left">Tổng số bệnh nhân đến khám theo tháng</Divider>

    <Line {...config} />
  </div>
  );
};
