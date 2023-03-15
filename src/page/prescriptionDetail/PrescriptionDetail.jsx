import { useContext, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  InputNumber,
  Input,
  Select,
  Spin,
  PageHeader,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { PrescriptionDetailContext } from "../../context/prescriptionDetail.provider";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 10,
  },
};

export const PrescriptionDetail = ({ prescriptionId }) => {
  const {
    prescriptionDetails,
    setPrescriptionDetails,
    onDelete,
    onAddPrescriptionDetail,
    findAllByPrescriptionId,
    onUpdatePrescriptionDetail,
  } = useContext(PrescriptionDetailContext);
  const navigate = useNavigate();

  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [form] = Form.useForm();

  const [spin, setSpin] = useState(false);
  // console.log("2. =>>>>", prescriptionId);
  // console.log("3. ===p", prescriptionDetails);

  useEffect(() => {
    setSpin(true);
    findAllByPrescriptionId(prescriptionId)
      .then((res) => {})
      .catch((err) => {})
      .finally(() => setSpin(false));
    // console.log(prescriptionId);
  }, [prescriptionId]);

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
    {
      title: "",
      fixed: "right",
      width: 100,
      render: (record) => {
        return (
          <>
            <EditOutlined
              onClick={() => showFormEditPrescriptionDetail(record)}
            />

            <DeleteOutlined
              style={{ color: "red", marginLeft: 12 }}
              onClick={() => {
                confirmDelete(record);
              }}
            />
          </>
        );
      },
    },
  ];

  const showFormAddPrescriptionDetail = () => {
    form.setFieldsValue();
    setIsOpenAdd(true);
    resetEditing();
  };

  const onAddFinish = async (values) => {
    const tempValue = { ...values, prescriptionId };
    console.log(tempValue);
    await onAddPrescriptionDetail(tempValue).then((res) => {
      findAllByPrescriptionId(prescriptionId);
    });
    setIsOpenAdd(false);
    resetEditing();
  };

  const onEditFinish = async (record) => {
    await onUpdatePrescriptionDetail(record).then((res) => {
      findAllByPrescriptionId(prescriptionId);
    });
    setIsOpenEdit(false);
  };

  const showFormEditPrescriptionDetail = (record) => {
    setIsOpenEdit(true);
    form.setFieldsValue({
      id: record.id,
      medicine: record.medicine,
      amount: record.amount,
      dosage: record.dosage,
    });
  };

  const confirmDelete = (record) => {
    Modal.confirm({
      title: "Bạn có chắc muốn xóa ?",
      okText: "Yes",
      onType: "danger",
      onOk: async () => {
        await onDelete(record.id).then((res) => {
          findAllByPrescriptionId(prescriptionId);
        });
      },
    });
  };

  const resetEditing = () => {
    form.setFieldsValue({
      medicine: null,
      amount: null,
      dosage: null,
    });
  };

  return (
    <>
      <PageHeader
        ghost={false}
        // title={null}
        extra={[
          <Button type="primary" onClick={showFormAddPrescriptionDetail}>
            Thêm
          </Button>,
          <Button
            type="primary"
            onClick={() => {
              window.open("/record/print_prescription/prescriptionId=" + prescriptionId, "_blank");
            }}
          >
            In đơn thuốc
          </Button>,
        ]}
      ></PageHeader>

      <Spin spinning={spin}>
        <Table
          name="employeeList"
          columns={columns}
          dataSource={prescriptionDetails}
          scroll={{ x: 800, y: 400 }}
          style={{ textAlign: "center" }}
          title={null}
          rowKey={"id"}
        ></Table>
      </Spin>

      <Modal
        title="Thêm Thuốc"
        centered
        visible={isOpenAdd}
        footer={null}
        width={700}
        onCancel={() => setIsOpenAdd(false)}
        destroyOnClose={true}
      >
        <Form
          name="formAddPrescription"
          form={form}
          onFinish={onAddFinish}
          {...layout}
        >
          <Form.Item
            label="Tên thuốc"
            name="medicine"
            rules={[{ required: true, message: "Chưa nhập tên thuốc" }]}
            style={{ marginBottom: "30px" }}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Số lượng"
            name="amount"
            rules={[{ required: true, message: "Chưa nhập số lượng" }]}
            style={{ marginBottom: "30px" }}
          >
            <InputNumber min="0" />
          </Form.Item>

          <Form.Item
            label="Liều dùng"
            name="dosage"
            style={{ marginBottom: "30px" }}
          >
            <Input />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 11, span: 20 }}>
            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Chỉnh Sửa Đơn Thuốc"
        centered
        visible={isOpenEdit}
        footer={null}
        width={700}
        onCancel={() => setIsOpenEdit(false)}
        // destroyOnClose={true}
      >
        <Form
          name="formEditPrescription"
          form={form}
          onFinish={onEditFinish}
          {...layout}
        >
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>

          <Form.Item
            label="Tên thuốc"
            name="medicine"
            rules={[{ required: true, message: "Chưa nhập tên thuốc" }]}
            style={{ marginBottom: "30px" }}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Số lượng"
            name="amount"
            rules={[{ required: true, message: "Chưa nhập số lượng" }]}
            style={{ marginBottom: "30px" }}
          >
            <InputNumber min="0" />
          </Form.Item>

          <Form.Item
            label="Liều dùng"
            name="dosage"
            style={{ marginBottom: "30px" }}
          >
            <Input />
          </Form.Item>

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
