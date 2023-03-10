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
                Th??ng Tin B???nh ??n
              </Button>,
              // <Button key="3" type="primary">
              //   Th??m B???nh ??n
              // </Button>,
            ]}
          >
            <Descriptions size="middle" column={3}>
              <Descriptions.Item label="Gi???i t??nh">
                {patient.sex}
              </Descriptions.Item>
              <Descriptions.Item label="?????a ch???">
                {patient?.address}
              </Descriptions.Item>
              <Descriptions.Item label="S??? ??i???n tho???i">
                {patient?.phone}
              </Descriptions.Item>
            </Descriptions>
          </PageHeader>
        </section>

        <section class="record-information">
          <div class="record-title">B???nh ??n</div>

          <Descriptions column={2} style={{ marginTop: "10px" }}>
            {/* <Descriptions.Item label="id" hidden>
              {record?.id}
            </Descriptions.Item> */}
            <Descriptions.Item label="B???nh S???">
              {record?.medicalHistory}
            </Descriptions.Item>
            <Descriptions.Item label="S???n Ph???m ??ang D??ng">
              {record?.productInUse}
            </Descriptions.Item>
          </Descriptions>

          <Descriptions column={2}>
            <Descriptions.Item label="Ch???n ??o??n">
              {record?.diagnose}
            </Descriptions.Item>
            <Descriptions.Item label="K???t Qu??? Kh??m">
              {record?.result}
            </Descriptions.Item>
          </Descriptions>

          <Descriptions column={2}>
            <Descriptions.Item label="Ph??c ?????">
              {record?.regimen}
            </Descriptions.Item>
          </Descriptions>

          {/* <Descriptions column={2}>
            <Descriptions.Item label="???nh Tr?????c Kh??m">
              {record?.preImage}
            </Descriptions.Item>
            <Descriptions.Item label="???nh Sau Kh??m">
              {record?.afterImage}
            </Descriptions.Item>
          </Descriptions> */}
        </section>

        <section class="prescription-information">
          <Prescriptions />
        </section>
      </div>

      <div className="container-fluid">
        <Modal
          title="Th??ng Tin B???nh ??n"
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
              label="B???nh S???"
              name="medicalHistory"
              // rules={[{ required: true, message: "Ch??a nh???p t??n b???nh nh??n" }]}
              // style={{ marginBottom: "30px" }}
            >
              <Input />
            </Form.Item>

            <Form.Item label="S???n ph???m ??ang d??ng" name="productInUse">
              <TextArea rows={2} />
            </Form.Item>

            <Form.Item label="Ch???n ??o??n" name="diagnose">
              <Input />
            </Form.Item>

            <Form.Item label="K???t qu??? kh??m" name="result">
              <TextArea rows={2} />
            </Form.Item>

            <Form.Item label="Ph??c ?????" name="regimen">
              <TextArea rows={2} />
            </Form.Item>

            {/* <Form.Item label="???nh tr?????c kh??m" name="preImage">
              <Input placeholder="Nh???p link drive" />
            </Form.Item>

            <Form.Item label="???nh sau kh??m" name="afterImage">
              <Input placeholder="Nh???p link drive" />
            </Form.Item> */}

            <Form.Item wrapperCol={{ offset: 11, span: 20 }}>
              <Button type="primary" htmlType="submit">
                L??u
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
};
