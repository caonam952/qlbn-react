import { Col, Row, Statistic } from "antd";
import { useContext } from "react";
import { useEffect } from "react";
import { ChartPrescriptionAttendingDoctor } from "../../component/chart/ChartPrescriptionAttendingDoctor";
import { ChartPrescriptionMonth } from "../../component/chart/ChartPrescriptionMonth";
import { ChartPrescriptionPatient } from "../../component/chart/ChartPrescriptionPatient";
import { StatisticsContext } from "../../context/statistics.provider";
import "./Statistics.css";

export const Statistics = () => {
  const {
    totalPatient,
    getTotalPatient,
    getTotalPrescription,
    totalPrescription,
  } = useContext(StatisticsContext);

  useEffect(() => {
    getTotalPatient();
    getTotalPrescription();
  }, []);

  return (
    <div className="statistics-page">
      <Row
        className="number-statistics"
        align="middle"
        style={{ marginLeft: "110px" }}
      >
        <Col span={12}>
          <Statistic
            title="Tổng số bệnh nhân"
            value={totalPatient}
            valueStyle={{
              color: "#3f8600",
            }}
          />
        </Col>

        <Col span={12}>
          <Statistic
            title="Tổng số đơn thuốc đã kê"
            value={totalPrescription}
            valueStyle={{
              color: "#af2705",
            }}
          />
        </Col>
      </Row>
      <Row
        className="chart-statistics"
        justify="space-around"
        align="middle"
        style={{ marginTop: "30px" }}
      >
        <Col span={12} className="col-chart">
          <ChartPrescriptionMonth />
        </Col>
      </Row>
      
      <Row
        className="chart-statistics"
        justify="space-around"
        align="middle"
        style={{ marginTop: "30px" }}
      >
        <Col span={10} className="col-chart">
          <ChartPrescriptionAttendingDoctor />
        </Col>
        <Col span={10} className="col-chart">
          <ChartPrescriptionPatient />
        </Col>
      </Row>

    </div>
  );
};
