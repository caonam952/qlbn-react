import { useContext, useEffect, useState, useRef } from "react";
import {
  Table,
  Tag,
  Button,
  Form,
  Modal,
  Input,
  Select,
  Checkbox,
  Col,
  Row,
  Space
} from "antd";
import { useNavigate } from "react-router-dom";
import { EditOutlined, DeleteOutlined,SearchOutlined } from "@ant-design/icons";
import { UserContext } from "../../context/user.provider";

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const { Option } = Select;

export const User = () => {
  const navigate = useNavigate();
  const { users, findAll, onDelete, onAddUser } = useContext(UserContext);

  const [form] = Form.useForm();
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    const getUser = JSON.parse(window.sessionStorage.getItem("user"));
    // console.log(getUser);
    if (getUser) {
      if (getUser.roles[0] === "ROLE_ADMIN") {
        findAll();
        return;
      }
    }
    navigate("/not-found");
  }, []);

  useEffect(() => {
    findAll();
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
      title: "Username",
      dataIndex: "username",
      key: "username",
      ...getColumnSearchProps('username')
    },
    {
      title: "Tên người dùng",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps('name')
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    // {
    //   title: "Password",
    //   dataIndex: "password",
    //   key: "password",
    // },
    {
      title: "Vai trò",
      dataIndex: "roles",
      key: "roles",
      render: (record) => (
        <>
          {record.map((item) => {
            let color;
            if (item.name === "ROLE_ADMIN") {
              color = "volcano";
            }
            if (item.name === "ROLE_MODERATOR") {
              color = "green";
            }
            if (item.name === "ROLE_USER") {
              color = "geekblue";
            }
            return (
              <Tag color={color} key={item.id}>
                {item?.name}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "",
      fixed: "right",
      width: 100,
      render: (record) => {
        return (
          <>
            {/* <EditOutlined /> */}

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

  const showFormAddUser = () => {
    form.setFieldsValue();
    setIsOpenAdd(true);
    resetEditing();
  };

  const onAddFinish = async (values) => {
    await onAddUser(values).then((res) => {
      findAll();
    });
    setIsOpenAdd(false);
    resetEditing();
  };

  const resetEditing = () => {
    form.setFieldsValue({
      username: null,
      email: null,
      password: null,
      roles: null,
    });
  };

  const confirmDelete = (record) => {
    Modal.confirm({
      title: "Bạn có chắc xóa người dùng này?",
      okText: "Yes",
      onType: "danger",
      onOk: async () => {
        await onDelete(record.id).then((res) => {
          findAll();
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
        onClick={showFormAddUser}
      >
        Add
      </Button>

      <Table
        name="userList"
        columns={columns}
        dataSource={users}
        scroll={{ x: 800, y: 400 }}
        style={{ textAlign: "center" }}
        title={() => <h3>DANH SÁCH NGƯỜI DÙNG</h3>}
        rowKey={"id"}
      ></Table>

      <Modal
        title="Thêm Thông Tin Người Dùng"
        centered
        visible={isOpenAdd}
        footer={null}
        width={700}
        onCancel={() => setIsOpenAdd(false)}
        destroyOnClose={true}
      >
        <Form
          form={form}
          name="formAddUser"
          onFinish={onAddFinish}
          {...layout}
          // destroyOnClose={true}
        >
          <Form.Item
            label="Tên đăng nhập"
            name="username"
            rules={[{ required: true, message: "Chưa nhập tên đăng nhập" }]}
            // style={{ marginBottom: "30px" }}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Tên Người dùng"
            name="name"
            rules={[{ required: true, message: "Chưa nhập tên người dùng" }]}
            // style={{ marginBottom: "30px" }}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Chưa nhập email" },
              {
                type: "email",
                message: "Nhập đúng đinh dạng Email",
              },
            ]}
            // style={{ marginBottom: "30px" }}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Chưa nhập mật khẩu" },
              { min: 8, message: "Mật khẩu ít nhất 8 kí tự" },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Vai Trò"
            name="role"
            // hasFeedback
            rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}
          >
            <Select
              placeholder="Vai trò"
              allowClear
              value={selected}
              onChange={(e) => setSelected(e)}
            >
              <Option value="admin">ROLE_ADMIN</Option>
              <Option value="mod">ROLE_MODERATOR</Option>
              <Option value="user">ROLE_USER</Option>
            </Select>
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
