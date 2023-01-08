import { useContext, useEffect } from "react";
import { Col, Layout, Row, Table, Button } from "antd";
import { useParams, useLocation } from "react-router-dom";
import { PrescriptionContext } from "../../context/prescription.provider";
import "./PrintPrescription.css";

const { Header, Footer, Sider, Content } = Layout;

export const PrintPrescription = () => {
  const location = useLocation();
  const params = useParams();
  const { prescription, findPrescriptionById } =
    useContext(PrescriptionContext);

  console.log(location, params);

  useEffect(() => {
    findPrescriptionById(params.id);
  }, []);

  const columns = [
    {
      title: "Tên thuốc",
      dataIndex: "medicine",
      key: "medicine",
    },

    {
      title: "Số lượng",
      dataIndex: "amount",
      key: "amount",
    },

    {
      title: "Liều dùng",
      dataIndex: "dosage",
      key: "dosage",
    },
  ];

  return (
    <>
      <Layout className="container">
        <div className="header-print">
          <Row>
            <h2>PHÒNG KHÁM DA LIỄU VŨ HỒNG</h2>
          </Row>
          <Row>
            <h4>Địa chỉ: ngõ 88, Phường Hồng Hà, Hạ Long, Quảng Ninh</h4>
          </Row>
          <Row>
            <h4>SĐT: 0943450073</h4>
          </Row>
          <Row>
            <h3 className="prescription">ĐƠN THUỐC</h3>
          </Row>
        </div>

        <div className="content-print">
          <Row>
            <h3 style={{ marginRight: "350px" }}>
              Họ tên: {prescription?.patientDto?.name}
            </h3>
            <h3>Giới tính: {prescription?.patientDto?.sex}</h3>
          </Row>

          <Row>
            <h3>Địa chỉ: {prescription?.patientDto?.address}</h3>
          </Row>

          <Row>
            <h3>Đơn thuốc: </h3>
          </Row>
          <Row>
            <Table
              columns={columns}
              dataSource={prescription?.prescriptionDetailDtos}
              style={{ textAlign: "center", width: "800px" }}
              pagination={false}
              title={null}
            ></Table>
          </Row>

          <Row>
            <h3>Ghi chú: </h3>
          </Row>

          <Row>
            <h3 style={{ marginBottom: "70px"}}>{prescription?.note}</h3>
          </Row>

          <Row>
            <h3 style={{ marginRight: "35px"}}>
              Ngày khám: {prescription?.prescriptionDate}
            </h3>
            <h3>Ngày tái khám: {prescription?.appointmentDate}</h3>
          </Row>
          <Row>Bất thường khám lại (khi khám mai theo đơn thuốc cũ)</Row>
        </div>

        <div className="footer-print">
          <h3 style={{ marginBottom: "85px" }}>Bác sĩ điều trị</h3>
          <h3>{prescription?.employeeDto?.name}</h3>
        </div>
      </Layout>

      <button
        class="hide-on-print"
        type="primary"
        onClick={() => window.print()}
      >
        Print
      </button>
    </>
  );
};
