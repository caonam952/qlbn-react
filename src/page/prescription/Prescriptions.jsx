import {
  Tabs,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Radio,
  DatePicker,
  Spin,
  Select,
} from "antd";
import React, { useContext, useEffect, useState, useRef } from "react";
import { PatientContext } from "../../context/patient.provider";
import { PrescriptionContext } from "../../context/prescription.provider";
import { Prescription } from "./Prescription";
import { Link, useNavigate, useParams } from "react-router-dom";
import { EmployeeContext } from "../../context/employee.provider";
import { AuthContext } from "../../context/auth.provider";
import { PrescriptionDetail } from "../prescriptionDetail/PrescriptionDetail";
import { PrescriptionDetailContext } from "../../context/prescriptionDetail.provider";
const moment = require("moment");
const { TextArea } = Input;

const initialItems = [];

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 13,
  },
};

export const Prescriptions = ({ activekey = "" }) => {
  const [form] = Form.useForm();
  const {
    prescriptions,
    getPrescriptionsByPatientId,
    onAddPrescription,
    onDeletePrescription,
  } = useContext(PrescriptionContext);
  const { employees, findAllEmployees } = useContext(EmployeeContext);
  const { user } = useContext(AuthContext);
  const { patient } = useContext(PatientContext);
  // const { setPrescriptionId, prescriptionId } = useContext(PrescriptionDetailContext);
  const [activeKey, setActiveKey] = useState(activekey);

  const [items, setItems] = useState(initialItems);
  const newTabIndex = useRef(0);
  const onChangeTab = (newActiveKey) => {
    setActiveKey(newActiveKey);
  };
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const params = useParams();

  const handleChange = (value) => {
    console.log(`Selected: ${value}`);
  };

  const dateFormat = "DD/MM/YYYY";

  const [loading, setLoading] = useState(true);

  // console.log("1. Key ===>", activeKey);

  useEffect(() => {
    setLoading(true);
    setActiveKey("");
    findAllEmployees();
    console.log(employees);
  }, []);

  useEffect(() => {
    setActiveKey("");
    getPrescriptionsByPatientId(params.id).finally(() => {
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    setItems(
      prescriptions.length
        ? prescriptions.map((prescription, i) => {
            const id = prescription.id;
            return {
              label: `${prescription.prescriptionDate}`,
              key: id,
              children: (
                <>
                  <Prescription data={prescription} />
                </>
              ),
            };
          })
        : null
    );
    setActiveKey(prescriptions[0]?.id);
  }, [prescriptions]);

  const addTab = (data) => {
    // setIsOpenAdd(true);
    showFormAddPrescription();
    const newActiveKey = `newTab${newTabIndex.current++}`;
    const newPanes = [...items];
    newPanes.push({
      label: "New Tab",
      children: <Prescription />,
      key: newActiveKey,
    });
    setItems(newPanes);
    setActiveKey(newActiveKey);
    // setPrescriptionId(newActiveKey);
  };

  const removeTab = (targetKey) => {
    let newActiveKey = activeKey;
    let lastIndex = -1;
    items.forEach(async (item, i) => {
      if (item.key === targetKey) {
        console.log(item.key);
        await onDeletePrescription(item.key).then((res) => {
          getPrescriptionsByPatientId(params?.id);
        });
        lastIndex = i - 1;
      }
    });
    const newPanes = items.filter((item) => item.key !== targetKey);
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
    }
    setItems(newPanes);
    setActiveKey(newActiveKey);
    // setPrescriptionId(newActiveKey);
  };

  const confirmDelete = (targetKey) => {
    // console.log(targetKey);
    Modal.confirm({
      title: "Bạn có chắc xóa bệnh nhân này?",
      okText: "Yes",
      onType: "danger",
      onOk: async () => {
        removeTab(targetKey);
      },
    });
  };

  const onEditTab = (targetKey, action) => {
    if (action === "add") {
      addTab();
    } else {
      confirmDelete(targetKey);
      // item.key
    }
  };

  const showFormAddPrescription = () => {
    console.log(employees);
    form.setFieldsValue({
      prescriptionDate: moment(new Date(), dateFormat),
    });
    setIsOpenAdd(true);
    resetEditing();
  };

  const onAddFinish = async (values) => {
    console.log(values);
    const tempValue = { ...values,attendingDoctor: user?.name, patientDto: patient?.id };
    console.log(tempValue);
    await onAddPrescription(tempValue).then((res) => {
      getPrescriptionsByPatientId(params.id);
    });
    setIsOpenAdd(false);
    resetEditing();
  };

  const resetEditing = () => {
    form.setFieldsValue({
      // prescriptionDate: null,
      appointmentDate: null,
      // employeeDto: null,
      note: null,
    });
  };

  const closeFormAdd = () => {
    setIsOpenAdd(false);
    getPrescriptionsByPatientId(params.id);
  };

  return (
    <>
      <Tabs
        type="editable-card"
        onChange={onChangeTab}
        activeKey={activeKey}
        onEdit={onEditTab}
        items={items}
      />

      {/* {activeKey != null ? ( */}
      {!loading && activeKey ? (
        <PrescriptionDetail prescriptionId={activeKey} />
      ) : (
        ""
      )}

      {/* ) : null} */}

      <Modal
        title="Thêm Đơn Thuốc"
        centered
        visible={isOpenAdd}
        footer={null}
        width={700}
        onCancel={closeFormAdd}
        destroyOnClose={true}
      >
        <Form
          {...layout}
          form={form}
          name="formAddPrescription"
          onFinish={onAddFinish}
        >
          <Form.Item
            label="Ngày khám"
            name="prescriptionDate"
            rules={[{ required: true, message: "Chưa nhập ngày khám" }]}
            style={{ marginBottom: "30px" }}
          >
            <DatePicker
              // defaultPickerValue={moment()}
              // value={moment(new Date(), dateFormat)}
              // defaultValue={moment("25/12/2022", dateFormat)}
              format={dateFormat}
              disabled
            />
          </Form.Item>

          <Form.Item
            label="Ngày tái khám"
            name="appointmentDate"
            rules={[{ required: true, message: "Chưa nhập ngày tái khám" }]}
            style={{ marginBottom: "30px" }}
          >
            <DatePicker format={dateFormat} />
          </Form.Item>

          <Form.Item
            label="Bác sĩ phụ trách"
            name="attendingDoctor"
            // name="employeeDto"
            // rules={[{ required: true, message: "Chưa chọn bác sĩ phụ trách" }]}
            style={{ marginBottom: "30px" }}
          >
            {/* <Select
              onChange={handleChange}
              style={{
                width: 200,
              }}
              disabled
            >
              {employees.map((item, index) => (
                <Select.Option value={item?.id} key={item?.id}>
                  {item?.name}
                </Select.Option>
              ))}
            </Select> */}
            {/* <Select
              defaultValue={user?.name}
              onChange={handleChange}
              disabled
            >
            </Select> */}
            <Input
            value={user?.name}
            defaultValue={user?.name}
            disabled
            />
          </Form.Item>

          <Form.Item label="Ghi Chú" name="note">
            <TextArea rows={4} />
          </Form.Item>

          {/* <Form.Item name="patientDto">
            <Input value={patient?.id}/>
          </Form.Item> */}

          <Form.Item wrapperCol={{ offset: 11, span: 20 }}>
            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
