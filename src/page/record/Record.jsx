import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  DatePicker,
  Descriptions,
  PageHeader,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import "./Record.css";
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useContext } from "react";
import { PatientContext } from "../../context/patient.provider";
import { RecordContext } from "../../context/record.provider";
import { Prescriptions } from "../prescription/Prescriptions";
import { AuthContext } from "../../context/auth.provider";

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 14,
  },
};

const { TextArea } = Input;

export const Record = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { patient, getPatientById, setPatient } = useContext(PatientContext);
  const { record, getRecordByPatientId, onUpdateRecord } =
    useContext(RecordContext);
  const [isOpenEdit, setIsOpenEdit] = useState(false);

  const params = useParams();

  useEffect(() => {
    const getUser = JSON.parse(window.sessionStorage.getItem("user"));
    // console.log(getUser);
    if (getUser) {
      if (getUser.roles[0] === "ROLE_MODERATOR") {
        getRecordByPatientId();
        return;
      }
    }
    navigate("/not-found");
  }, []);

  useEffect(() => {
    getPatientById(params.id);
    setPatient(params.id);
    console.log(params);
    getRecordByPatientId(params.id);
  }, []);

  useEffect(() => {
    getPatientById(params.id);
    setPatient(params.id);
    getRecordByPatientId(params.id);
  }, [params.id]);

  const showFormEditRecord = (record) => {
    console.log(record);
    setIsOpenEdit(true);
    form.setFieldsValue({
      id: record.id,
      medicalHistory: record.medicalHistory,
      productInUse: record.productInUse,
      diagnose: record.diagnose,
      result: record.result,
      regimen: record.regimen,
      preImage: record.preImage,
      afterImage: record.afterImage,
      patientDto: { id: record.patientDto.id },
    });
  };

  const onEditFinish = async (values) => {
    await onUpdateRecord(values).then((res) => {
      getRecordByPatientId(params.id);
    });
    setIsOpenEdit(false);
  };

  return (
    <>
      <div className="site-page-header-record">
        <section class="patient-information">
          <PageHeader
            ghost={false}
            onBack={() => window.history.back()}
            title={patient?.name}
            extra={[
              <Button key="2" onClick={() => showFormEditRecord(record)}>
                Thông Tin Bệnh Án
              </Button>,
              // <Button key="3" type="primary">
              //   Thêm Bệnh Án
              // </Button>,
            ]}
          >
            <Descriptions size="middle" column={3}>
              <Descriptions.Item label="Giới tính">
                {patient.sex}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ">
                {patient?.address}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {patient?.phone}
              </Descriptions.Item>
            </Descriptions>
          </PageHeader>
        </section>

        <section class="record-information">
          <div class="record-title">Bệnh án</div>

          <Descriptions column={2} style={{ marginTop: "10px" }}>
            {/* <Descriptions.Item label="id" hidden>
              {record?.id}
            </Descriptions.Item> */}
            <Descriptions.Item label="Bệnh Sử">
              {record?.medicalHistory}
            </Descriptions.Item>
            <Descriptions.Item label="Sản Phẩm Đang Dùng">
              {record?.productInUse}
            </Descriptions.Item>
          </Descriptions>

          <Descriptions column={2}>
            <Descriptions.Item label="Chẩn Đoán">
              {record?.diagnose}
            </Descriptions.Item>
            <Descriptions.Item label="Kết Quả Khám">
              {record?.result}
            </Descriptions.Item>
          </Descriptions>

          <Descriptions column={2}>
            <Descriptions.Item label="Phác Đồ">
              {record?.regimen}
            </Descriptions.Item>
          </Descriptions>

          <Descriptions column={2}>
            <Descriptions.Item label="Ảnh Trước Khám">
              {record?.preImage}
            </Descriptions.Item>
            <Descriptions.Item label="Ảnh Sau Khám">
              {record?.afterImage}
            </Descriptions.Item>
          </Descriptions>
        </section>

        <section class="prescription-information">
          <Prescriptions />
        </section>
      </div>

      <div className="container-fluid">
        <Modal
          title="Thông Tin Bệnh Án"
          centered
          visible={isOpenEdit}
          footer={null}
          width={700}
          onCancel={() => setIsOpenEdit(false)}
          // destroyOnClose={true}
        >
          <Form
            form={form}
            name="formEditPatient"
            onFinish={onEditFinish}
            {...layout}
            // destroyOnClose={true}
          >
            <Form.Item name="id" hidden>
              <Input />
            </Form.Item>

            <Form.Item name="patientDto" hidden>
              <Input />
            </Form.Item>

            <Form.Item
              label="Bệnh Sử"
              name="medicalHistory"
              // rules={[{ required: true, message: "Chưa nhập tên bệnh nhân" }]}
              // style={{ marginBottom: "30px" }}
            >
              <Input />
            </Form.Item>

            <Form.Item label="Sản phẩm đang dùng" name="productInUse">
              <TextArea rows={2} />
            </Form.Item>

            <Form.Item label="Chẩn đoán" name="diagnose">
              <Input />
            </Form.Item>

            <Form.Item label="Kết quả khám" name="result">
              <TextArea rows={2} />
            </Form.Item>

            <Form.Item label="Phác đồ" name="regimen">
              <TextArea rows={2} />
            </Form.Item>

            <Form.Item label="Ảnh trước khám" name="preImage">
              <Input placeholder="Nhập link drive" />
            </Form.Item>

            <Form.Item label="Ảnh sau khám" name="afterImage">
              <Input placeholder="Nhập link drive" />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 11, span: 20 }}>
              <Button type="primary" htmlType="submit">
                Lưu
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
};
