import React, { useContext, useEffect, useState, useRef } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Radio,
  Space,
  DatePicker,
  Spin,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  FileSearchOutlined,
  SearchOutlined 
} from "@ant-design/icons";
// import Highlighter from 'react-highlight-words';
import { PatientContext } from "../../context/patient.provider";
import { useNavigate } from "react-router-dom";
import { RecordContext } from "../../context/record.provider";
// import moment from "moment";
const moment = require("moment");
// import {
//   FormWithConstraints,
//   FieldFeedbacks,
//   Async,
//   FieldFeedback,
// } from "react-form-with-constraints";

const { TextArea } = Input;

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

export const Patient = () => {
  const navigate = useNavigate();
  const {
    patients,
    findAllPatients,
    onDeletePatient,
    onAddPatient,
    onUpdatePatient,
  } = useContext(PatientContext);
  const { record, getRecordByPatientId, onAddRecord } =
    useContext(RecordContext);
  const [activeExpRow, setActiveExpRow] = React.useState();

  const [form] = Form.useForm();
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const dateFormat = "DD/MM/YYYY";
  const [spin, setSpin] = useState(false);

  const modifiedData = patients.map((item) => ({
    ...item,
    key: item.id,
  }));

  useEffect(() => {
    const getUser = JSON.parse(window.sessionStorage.getItem("user"));
    // console.log(getUser);
    if (getUser) {
      if (getUser.roles[0] === "ROLE_MODERATOR") {
        findAllPatients();
        return;
      }
    }
    navigate("/not-found");
  }, []);

  useEffect(() => {
    findAllPatients();
  }, []);

  const [searchText, setSearchText] = useState("");
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            X??a
          </Button>

          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 95,
            }}
          >
            T??m ki???m
          </Button>
        </Space>
      </div>
    ),

    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),

    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  const columns = [
    Table.EXPAND_COLUMN,
    {
      title: "T??n b???nh nh??n",
      dataIndex: "name",
      key: "name",
      width: 250,
      ...getColumnSearchProps('name'),
    },

    {
      title: "Ng??y sinh",
      dataIndex: "birth",
      key: "birth",
      width: 150,
    },
    {
      title: "Gi???i t??nh",
      dataIndex: "sex",
      key: "sex",
      width: 100,
      align: "center",
    },
    {
      title: "?????a ch???",
      dataIndex: "address",
      key: "address",
      width: 290,
    },
    {
      title: "??i???n tho???i",
      dataIndex: "phone",
      key: "phone",
      width: 150,
      ...getColumnSearchProps('phone'),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 250,
    },
    // {
    //   title: "Ghi ch??",
    //   dataIndex: "note",
    //   key: "note",
    // },
    {
      title: "",
      fixed: "right",
      width: 100,
      render: (item) => {
        return (
          <>
            <FileSearchOutlined
              onClick={() => {
                setSpin(true);
                getRecordByPatientId(item.id)
                  .then((res) => {
                    console.log(res);
                    if (res.data?.id === null) {
                      onAddRecord({
                        medicalHistory: "",
                        productInUse: "",
                        diagnose: "",
                        result: "",
                        regimen: "",
                        preImage: "",
                        afterImage: "",
                        patientDto: { id: item.id },
                      }).then((resAdd) => {
                        console.log(resAdd);
                      });
                    } else {
                      navigate(`/record/patientId=${item?.id}`);
                      // console.log(item);
                    }
                  })
                  .catch((err) => {
                    onAddRecord({
                      medicalHistory: "",
                      productInUse: "",
                      diagnose: "",
                      result: "",
                      regimen: "",
                      preImage: "",
                      afterImage: "",
                      patientDto: { id: item.id },
                    })
                      .then((resAdd) => {
                        navigate(`/record/patientId=${item?.id}`);
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  })
                  .finally(() => {
                    setSpin(false);
                  });
              }}
              style={{ color: "blue" }}
            />

            <EditOutlined
              onClick={() => showFormEditPatient(item)}
              style={{ color: "black", marginLeft: 12 }}
            />

            <DeleteOutlined
              onClick={() => {
                confirmDelete(item);
              }}
              style={{ color: "red", marginLeft: 12 }}
            />
          </>
        );
      },
    },
  ];

  const showFormAddPatient = () => {
    form.setFieldsValue();
    setIsOpenAdd(true);
    resetEditing();
  };

  const onAddFinish = async (values) => {
    await onAddPatient(values).then((res) => {
      findAllPatients();
    });
    setIsOpenAdd(false);
    resetEditing();
  };

  const showFormEditPatient = (record) => {
    // console.log(record, moment(record.birth, "DD/MM/YYYY").format(dateFormat));
    setIsOpenEdit(true);
    form.setFieldsValue({
      id: record.id,
      name: record.name,
      birth: moment(record.birth, dateFormat),
      sex: record.sex,
      address: record.address,
      phone: record.phone,
      email: record.email,
      note: record.note,
    });
  };

  const onEditFinish = async (record) => {
    console.log(record);
    await onUpdatePatient(record).then((res) => {
      findAllPatients();
    });
    setIsOpenEdit(false);
  };

  const confirmDelete = (record) => {
    console.log(record);
    Modal.confirm({
      title: "B???n c?? ch???c x??a b???nh nh??n n??y?",
      okText: "Yes",
      onType: "danger",
      onOk: async () => {
        await onDeletePatient(record.id).then((res) => {
          findAllPatients();
        });
      },
    });
  };

  const resetEditing = () => {
    // setIsOpenAdd(false);
    form.setFieldsValue({
      name: null,
      birth: null,
      sex: null,
      address: null,
      phone: null,
      email: null,
      note: null,
    });
  };

  return (
    <Spin spinning={spin}>
      <div className="container-fluid">
        <Button
          type="primary"
          style={{
            marginBottom: 16,
          }}
          onClick={showFormAddPatient}
        >
          Add
        </Button>
        <Table
          name="patientList"
          columns={columns}
          dataSource={modifiedData}
          rowKey={"id"}
          scroll={{ x: 800, y: 500 }}
          expandable={{
            expandedRowRender: (record) => (
              <div>
                <h4>Ghi ch??</h4>
                <p
                  style={{
                    margin: 0,
                    marginBottom: 9,
                  }}
                >
                  {record.note}
                </p>
              </div>
            ),
            rowExpandable: (record) => true,
            expandedRowKeys: activeExpRow,
            onExpand: (expanded, record) => {
              const keys = [];
              if (expanded) {
                keys.push(record.id);
              }
              console.log(keys);
              setActiveExpRow(keys);
            },
          }}
          //   bordered
          style={{ textAlign: "center"}}
          title={() => <h3>DANH S??CH B???NH NH??N</h3>}
        ></Table>

        <Modal
          title="Th??m Th??ng Tin B???nh Nh??n"
          centered
          visible={isOpenAdd}
          footer={null}
          width={700}
          onCancel={() => setIsOpenAdd(false)}
          destroyOnClose={true}
        >
          <Form
            form={form}
            name="formAddPatient"
            onFinish={onAddFinish}
            {...layout}
            // destroyOnClose={true}
          >
            <Form.Item
              label="T??n B???nh Nh??n"
              name="name"
              rules={[{ required: true, message: "Ch??a nh???p t??n b???nh nh??n" }]}
              style={{ marginBottom: "30px" }}
            >
              <Input />
            </Form.Item>

            <Form.Item label="Ng??y Sinh" style={{ marginBottom: "10px" }}>
              <Form.Item
                // label=""
                name="birth"
                rules={[{ required: true, message: "Ch??a nh???p ng??y sinh" }]}
                style={{ display: "inline-block", width: "40%" }}
              >
                <DatePicker format={dateFormat} />
              </Form.Item>

              <Form.Item
                label="Gi???i T??nh"
                name="sex"
                rules={[{ required: true, message: "Ch??a ch???n gi???i t??nh" }]}
                style={{ display: "inline-block", width: "50%" }}
              >
                <Radio.Group>
                  <Radio value="Nam"> Nam </Radio>
                  <Radio value="N???"> N??? </Radio>
                </Radio.Group>
              </Form.Item>
            </Form.Item>

            <Form.Item
              label="?????a Ch???"
              name="address"
              rules={[{ required: true, message: "Ch??a nh???p ?????a ch???" }]}
              style={{ marginBottom: "30px" }}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="S??? ??i???n Tho???i"
              name="phone"
              rules={[
                { required: true, message: "Ch??a nh???p s??? ??i???n tho???i" },
                {
                  pattern: "^0\\d{9}$",
                  message: "S??? ??i???n tho???i kh??ng h???p l???",
                },
              ]}
              style={{ marginBottom: "30px" }}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  type: "email",
                  message: "Nh???p ????ng ??inh d???ng Email",
                },
              ]}
              style={{ marginBottom: "30px" }}
            >
              <Input />
            </Form.Item>

            <Form.Item label="Ghi Ch??" name="note">
              <TextArea rows={4} />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 11, span: 20 }}>
              <Button type="primary" htmlType="submit">
                L??u
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="Ch???nh S???a Th??ng Tin B???nh Nh??n"
          centered
          visible={isOpenEdit}
          footer={null}
          width={700}
          onCancel={() => setIsOpenEdit(false)}
          destroyOnClose={true}
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
            <Form.Item
              label="T??n B???nh Nh??n"
              name="name"
              rules={[{ required: true, message: "Ch??a nh???p t??n b???nh nh??n" }]}
              style={{ marginBottom: "30px" }}
            >
              <Input />
            </Form.Item>

            <Form.Item label="Ng??y Sinh" style={{ marginBottom: "10px" }}>
              <Form.Item
                // label=""
                name="birth"
                rules={[{ required: true, message: "Ch??a nh???p ng??y sinh" }]}
                style={{ display: "inline-block", width: "40%" }}
              >
                <DatePicker format={dateFormat} />
              </Form.Item>

              <Form.Item
                label="Gi???i T??nh"
                name="sex"
                rules={[{ required: true, message: "Ch??a ch???n gi???i t??nh" }]}
                style={{ display: "inline-block", width: "50%" }}
              >
                <Radio.Group>
                  <Radio value="Nam"> Nam </Radio>
                  <Radio value="N???"> N??? </Radio>
                </Radio.Group>
              </Form.Item>
            </Form.Item>

            <Form.Item
              label="?????a Ch???"
              name="address"
              rules={[{ required: true, message: "Ch??a nh???p ?????a ch???" }]}
              style={{ marginBottom: "30px" }}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="S??? ??i???n Tho???i"
              name="phone"
              rules={[
                { required: true, message: "Ch??a nh???p s??? ??i???n tho???i" },
                {
                  pattern: "^0\\d{9}$",
                  message: "S??? ??i???n tho???i kh??ng h???p l???",
                },
              ]}
              style={{ marginBottom: "30px" }}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  type: "email",
                  message: "Nh???p ????ng ??inh d???ng Email",
                },
              ]}
              style={{ marginBottom: "30px" }}
            >
              <Input />
            </Form.Item>

            <Form.Item label="Ghi Ch??" name="note">
              <TextArea rows={4} />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 11, span: 20 }}>
              <Button type="primary" htmlType="submit">
                L??u
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Spin>
  );
};
