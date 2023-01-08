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
            Xóa
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
            Tìm kiếm
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
      title: "Tên bệnh nhân",
      dataIndex: "name",
      key: "name",
      width: 250,
      ...getColumnSearchProps('name'),
    },

    {
      title: "Ngày sinh",
      dataIndex: "birth",
      key: "birth",
      width: 150,
    },
    {
      title: "Giới tính",
      dataIndex: "sex",
      key: "sex",
      width: 100,
      align: "center",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      width: 290,
    },
    {
      title: "Điện thoại",
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
    //   title: "Ghi chú",
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
      title: "Bạn có chắc xóa bệnh nhân này?",
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
                <h4>Ghi chú</h4>
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
          title={() => <h3>DANH SÁCH BỆNH NHÂN</h3>}
        ></Table>

        <Modal
          title="Thêm Thông Tin Bệnh Nhân"
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
              label="Tên Bệnh Nhân"
              name="name"
              rules={[{ required: true, message: "Chưa nhập tên bệnh nhân" }]}
              style={{ marginBottom: "30px" }}
            >
              <Input />
            </Form.Item>

            <Form.Item label="Ngày Sinh" style={{ marginBottom: "10px" }}>
              <Form.Item
                // label=""
                name="birth"
                rules={[{ required: true, message: "Chưa nhập ngày sinh" }]}
                style={{ display: "inline-block", width: "40%" }}
              >
                <DatePicker format={dateFormat} />
              </Form.Item>

              <Form.Item
                label="Giới Tính"
                name="sex"
                rules={[{ required: true, message: "Chưa chọn giới tính" }]}
                style={{ display: "inline-block", width: "50%" }}
              >
                <Radio.Group>
                  <Radio value="Nam"> Nam </Radio>
                  <Radio value="Nữ"> Nữ </Radio>
                </Radio.Group>
              </Form.Item>
            </Form.Item>

            <Form.Item
              label="Địa Chỉ"
              name="address"
              rules={[{ required: true, message: "Chưa nhập địa chỉ" }]}
              style={{ marginBottom: "30px" }}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Số Điện Thoại"
              name="phone"
              rules={[
                { required: true, message: "Chưa nhập số điện thoại" },
                {
                  pattern: "^0\\d{9}$",
                  message: "Số điện thoại không hợp lệ",
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
                  message: "Nhập đúng đinh dạng Email",
                },
              ]}
              style={{ marginBottom: "30px" }}
            >
              <Input />
            </Form.Item>

            <Form.Item label="Ghi Chú" name="note">
              <TextArea rows={4} />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 11, span: 20 }}>
              <Button type="primary" htmlType="submit">
                Lưu
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="Chỉnh Sửa Thông Tin Bệnh Nhân"
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
              label="Tên Bệnh Nhân"
              name="name"
              rules={[{ required: true, message: "Chưa nhập tên bệnh nhân" }]}
              style={{ marginBottom: "30px" }}
            >
              <Input />
            </Form.Item>

            <Form.Item label="Ngày Sinh" style={{ marginBottom: "10px" }}>
              <Form.Item
                // label=""
                name="birth"
                rules={[{ required: true, message: "Chưa nhập ngày sinh" }]}
                style={{ display: "inline-block", width: "40%" }}
              >
                <DatePicker format={dateFormat} />
              </Form.Item>

              <Form.Item
                label="Giới Tính"
                name="sex"
                rules={[{ required: true, message: "Chưa chọn giới tính" }]}
                style={{ display: "inline-block", width: "50%" }}
              >
                <Radio.Group>
                  <Radio value="Nam"> Nam </Radio>
                  <Radio value="Nữ"> Nữ </Radio>
                </Radio.Group>
              </Form.Item>
            </Form.Item>

            <Form.Item
              label="Địa Chỉ"
              name="address"
              rules={[{ required: true, message: "Chưa nhập địa chỉ" }]}
              style={{ marginBottom: "30px" }}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Số Điện Thoại"
              name="phone"
              rules={[
                { required: true, message: "Chưa nhập số điện thoại" },
                {
                  pattern: "^0\\d{9}$",
                  message: "Số điện thoại không hợp lệ",
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
                  message: "Nhập đúng đinh dạng Email",
                },
              ]}
              style={{ marginBottom: "30px" }}
            >
              <Input />
            </Form.Item>

            <Form.Item label="Ghi Chú" name="note">
              <TextArea rows={4} />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 11, span: 20 }}>
              <Button type="primary" htmlType="submit">
                Lưu
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Spin>
  );
};
