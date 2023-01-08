import { Table, Button, Modal, Form, Input, Select, Space } from "antd";
import { useEffect, useRef } from "react";
import { useContext } from "react";
import { EmployeeContext } from "../../context/employee.provider";
import { useNavigate } from "react-router-dom";
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useState } from "react";

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const { Option } = Select;

export const Employee = () => {
  const [form] = Form.useForm();
  const {
    employees,
    findAllEmployees,
    onDelete,
    onAddEmployee,
    onUpdateEmployee,
    detailEmployee,
  } = useContext(EmployeeContext);
  const navigate = useNavigate();
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    const getUser = JSON.parse(window.sessionStorage.getItem("user"));
    if (getUser) {
      if (getUser.roles[0] === "ROLE_ADMIN") {
        findAllEmployees();
        return;
      }
    }
    navigate("/not-found");
  }, []);

  useEffect(() => {
    findAllEmployees();
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
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
    },

    {
      title: "Chức Vụ",
      dataIndex: "position",
      key: "position",
    },
    {
      title: "Số Điện Thoại",
      dataIndex: "phone",
      key: "phone",
      ...getColumnSearchProps("phone"),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Trạng thái",
      dataIndex: "conditionStatus",
      key: "conditionStatus",
    },
    {
      title: "",
      fixed: "right",
      width: 100,
      render: (record) => {
        return (
          <>
            <EditOutlined onClick={() => showFormEditEmployee(record)} />

            <DeleteOutlined
              onClick={() => {
                confirmDelete(record);
              }}
              style={{ color: "red", marginLeft: 12 }}
            />
          </>
        );
      },
    },
  ];

  const showFormAddEmployee = () => {
    form.setFieldsValue();
    setIsOpenAdd(true);
    resetEditing();
  };

  const onAddFinish = async (values) => {
    await onAddEmployee(values).then((res) => {
      findAllEmployees();
    });
    setIsOpenAdd(false);
    resetEditing();
  };

  const resetEditing = () => {
    // setIsOpenAdd(false);
    form.setFieldsValue({
      name: null,
      position: null,
      phone: null,
      email: null,
      conditionStatus: null,
    });
  };

  const showFormEditEmployee = (record) => {
    // console.log(record);
    // detailEmployee(record.id).then((data) => {
    //   console.log(data);
    console.log(record);
    setIsOpenEdit(true);
    form.setFieldsValue({
      id: record.id,
      name: record.name,
      position: record.position,
      phone: record.phone,
      email: record.email,
      conditionStatus: record.conditionStatus,
    });
    // })
  };

  const onEditFinish = async (record) => {
    console.log(record);
    await onUpdateEmployee(record).then((res) => {
      findAllEmployees();
    });
    setIsOpenEdit(false);
  };

  const confirmDelete = (record) => {
    Modal.confirm({
      title: "Bạn có chắc xóa nhân viên này?",
      okText: "Yes",
      onType: "danger",
      onOk: async () => {
        await onDelete(record.id).then((res) => {
          findAllEmployees();
        });
      },
    });
  };

  return (
    <div className="container-fluid">
      <Button
        type="primary"
        style={{
          marginBottom: 16,
        }}
        onClick={showFormAddEmployee}
      >
        Add
      </Button>

      <Table
        name="employeeList"
        columns={columns}
        dataSource={employees}
        scroll={{ x: 800, y: 400 }}
        style={{ textAlign: "center" }}
        title={() => <h3>DANH SÁCH NHÂN VIÊN</h3>}
        rowKey={"id"}
      ></Table>

      <Modal
        title="Thêm Nhân Viên"
        centered
        visible={isOpenAdd}
        footer={null}
        onCancel={() => setIsOpenAdd(false)}
        destroyOnClose={true}
      >
        <Form
          form={form}
          name="formAddEmployee"
          onFinish={onAddFinish}
          {...layout}
        >
          <Form.Item
            label="Tên Nhân Viên"
            name="name"
            rules={[{ required: true, message: "Chưa nhập tên nhân viên" }]}
            style={{ marginBottom: "30px" }}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Chức Vụ"
            name="position"
            // hasFeedback
            rules={[{ required: true, message: "Vui lòng chọn chức vụ" }]}
          >
            <Select
              placeholder="Chức Vụ"
              allowClear
              value={selected}
              onChange={(e) => setSelected(e)}
            >
              <Option value="Giám Đốc">Giám Đốc</Option>
              <Option value="Bác Sĩ">Bác Sĩ</Option>
              <Option value="Dev">Dev</Option>
              <Option value="Cộng Tác Viên">Cộng Tác Viên</Option>
            </Select>
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

          <Form.Item
            label="Trạng thái"
            name="conditionStatus"
            // hasFeedback
            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
          >
            <Select
              placeholder="Trạng thái"
              allowClear
              value={selected}
              onChange={(e) => setSelected(e)}
            >
              <Option value="Đang làm">Đang làm</Option>
              <Option value="Đã nghỉ">Đã nghỉ</Option>
            </Select>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 11, span: 20 }}>
            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Chỉnh Sửa Thông Tin Nhân Viên"
        centered
        visible={isOpenEdit}
        footer={null}
        onCancel={() => setIsOpenEdit(false)}
        destroyOnClose={true}
      >
        <Form
          form={form}
          name="formEditEmployee"
          onFinish={onEditFinish}
          {...layout}
        >
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            label="Tên Nhân Viên"
            name="name"
            rules={[{ required: true, message: "Chưa nhập tên nhân viên" }]}
            style={{ marginBottom: "30px" }}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Chức Vụ"
            name="position"
            // hasFeedback
            rules={[{ required: true, message: "Vui lòng chọn chức vụ" }]}
          >
            <Select
              placeholder="Chức Vụ"
              allowClear
              value={selected}
              onChange={(e) => setSelected(e)}
            >
              <Option value="Giám Đốc">Giám Đốc</Option>
              <Option value="Bác Sĩ">Bác Sĩ</Option>
              <Option value="Dev">Dev</Option>
              <Option value="Cộng Tác Viên">Cộng Tác Viên</Option>
            </Select>
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

          <Form.Item wrapperCol={{ offset: 11, span: 20 }}>
            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
