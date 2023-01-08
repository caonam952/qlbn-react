import { Descriptions } from "antd";

export const Prescription = ({ data }) => {
  return (
    <>
      <section>
        <h3>Đơn Thuốc</h3>

        <Descriptions column={3} style={{ marginTop: "10px" }}>
          {/* <Descriptions.Item label="id" hidden>{record?.id}</Descriptions.Item> */}
          <Descriptions.Item label="Ngày khám">
            {data?.prescriptionDate}
          </Descriptions.Item>

          <Descriptions.Item label="Ngày tái khám">
            {data?.appointmentDate}
          </Descriptions.Item>

          <Descriptions.Item label="Bác sĩ khám">
            {data?.employeeDto?.name}
          </Descriptions.Item>

          <Descriptions.Item label="Ghi chú">
            {data?.note}
          </Descriptions.Item>

        </Descriptions>
      </section>
    </>
  );
};
