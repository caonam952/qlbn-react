import { Column } from "@ant-design/plots";
import { Divider, Typography } from "antd";
import { useContext, useEffect } from "react";
import { StatisticsContext } from "../../context/statistics.provider";

const { Text } = Typography;

export const ChartPrescriptionPatient = () => {
  const { prescriptionPatient, getPrescriptionPatient } =
    useContext(StatisticsContext);

  useEffect(() => {
    getPrescriptionPatient();
  }, []);
  const data = prescriptionPatient;
  console.log(data);

  const loyal = "#F4664A";
  const normal = "#5B8FF9";
  const config = {
    data,
    xField: "name",
    yField: "value",
    seriesField: "value",
    legend: false,
    // minBarWidth: 50,
    // maxBarWidth: 50,
    scrollbar: {
      type: "horizontal",
    },
    xAxis: {
      label: {
        autoRotate: false,
      },
    },
    color: ({ value }) => {
      if (value >= 5) {
        return loyal;
      }
      return normal;
    },
  };

  return (
    <div>
      <Divider orientation="left">Số lượt đến khám mỗi bệnh nhân</Divider>
      <Text
        code
        style={{ color: "white", backgroundColor: loyal, marginBottom: "4px" }}
      >
        Thân thiết
      </Text>
      <Column {...config} />
    </div>
  );
};
