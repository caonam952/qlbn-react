import {
  Button,
  Table,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  DatePicker,
  Descriptions,
  Space,
} from "antd";
import { useEffect, useState, useRef } from "react";
import React, { useContext } from "react";
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { MedicineContext } from "../../context/medicine.provider";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";

const { Option } = Select;
const { TextArea } = Input;

export const Medicine = () => {
  const [form] = Form.useForm();
  const { medicines, findAll, onDelete, onAddMedicine, onUpdateMedicine } =
    useContext(MedicineContext);
  const navigate = useNavigate();
  const [activeExpRow, setActiveExpRow] = React.useState();
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const dateFormat = "DD/MM/YYYY";
  const [selected, setSelected] = useState("");

  const modifiedData = medicines.map((item) => ({
    ...item,
    key: item.id,
  }));

  useEffect(() => {
    const getUser = JSON.parse(window.sessionStorage.getItem("user"));
    // console.log(getUser);
    if (getUser) {
      if (getUser.roles[0] === "ROLE_MODERATOR") {
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
    // Table.EXPAND_COLUMN,
    {
      title: "Tên thuốc",
      dataIndex: "name",
      key: "name",
      width: 240,
      fixed: "left",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Nhà sản xuất",
      dataIndex: "origin",
      key: "origin",
      width: 180,
    },
    {
      title: "Đơn vị",
      dataIndex: "uni",
      key: "uni",
      width: 80,
      align: "center",
    },
    {
      title: "Số lượng",
      dataIndex: "amount",
      key: "amount",
      width: 87,
      align: "center",
    },
    {
      title: "NSX",
      dataIndex: "importDate",
      key: "importDate",
      width: 120,
    },

    {
      title: "HSD",
      dataIndex: "expDate",
      key: "expDate",
      width: 120,
    },
    {
      title: "Hướng dẫn sử dụng",
      dataIndex: "manual",
      key: "manual",
      width: 300,
    },
    // {
    //   title: "Ghi chú",
    //   dataIndex: "note",
    //   key: "note",
    //   width: 250,
    // },
    {
      title: "Giá bán (VND)",
      dataIndex: "price",
      key: "price",
      width: 150,
      fixed: "right",
    },
    {
      title: "",
      fixed: "right",
      width: 100,
      render: (record) => {
        return (
          <>
            <EditOutlined onClick={() => showFormEditMedicine(record)} />

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

  const showFormAddMedicine = () => {
    form.setFieldsValue();
    setIsOpenAdd(true);
    resetEditing();
  };

  const showFormEditMedicine = (record) => {
    setIsOpenEdit(true);
    form.setFieldsValue({
      id: record.id,
      name: record.name,
      origin: record.origin,
      uni: record.uni,
      amount: record.amount,
      importDate: moment(record.importDate, dateFormat),
      expDate: moment(record.expDate, dateFormat),
      manual: record.manual,
      importPrice: record.importPrice,
      price: record.price,
      note: record.note,
    });
  };

  const onEditFinish = async (record) => {
    await onUpdateMedicine(record).then((res) => {
      findAll();
    });
    setIsOpenEdit(false);
  };

  const onAddFinish = async (values) => {
    await onAddMedicine(values).then((res) => {
      findAll();
    });
    setIsOpenAdd(false);
    resetEditing();
  };

  const confirmDelete = (record) => {
    Modal.confirm({
      title: "Bạn có chắc xóa thuốc này?",
      okText: "Yes",
      onType: "danger",
      onOk: async () => {
        await onDelete(record.id).then((res) => {
          findAll();
        });
      },
    });
  };

  const resetEditing = () => {
    // setIsOpenAdd(false);
    form.setFieldsValue({
      name: null,
      origin: null,
      uni: null,
      amount: null,
      importDate: null,
      expDate: null,
      importPrice: null,
      price: null,
      manual: null,
      note: null,
    });
  };

  return (
    <div className="container-fluid">
      <Button
        type="primary"
        style={{
          marginBottom: 16,
        }}
        onClick={showFormAddMedicine}
      >
        Add
        {/* <Link to="/moderator/medicine/add">Add</Link> */}
      </Button>

      <Table
        name="medicineList"
        columns={columns}
        dataSource={modifiedData}
        scroll={{ x: 1700, y: 500 }}
        rowKey={"id"}
        expandable={{
          expandedRowRender: (record) => (
            <div>
              <h4>Giá nhập</h4>
              <p
                style={{
                  margin: 0,
                  marginBottom: 9,
                }}
              >
                {record.importPrice} VND
              </p>
              <hr width="98%" size="5px" align="center" color="#eeeeee" />
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
        style={{ textAlign: "center" }}
        title={() => <h3>DANH SÁCH THUỐC</h3>}
      ></Table>

      <Modal
        title="Thêm Thông Tin Thuốc"
        centered
        visible={isOpenAdd}
        width={1000}
        footer={null}
        onCancel={() => setIsOpenAdd(false)}
        destroyOnClose={true}
      >
        <Form
          form={form}
          name="formAddMedicine"
          labelCol={{ span: 10 }}
          wrapperCol={{ span: 8 }}
          onFinish={onAddFinish}
        >
          {/* <Link
            to={"/moderator/medicine"}
            style={{ color: "black", fontSize: "20px" }}
          >
            <RollbackOutlined />
          </Link> */}

          <Form.Item
            label="Tên thuốc"
            name="name"
            rules={[{ required: true, message: "Chưa nhập tên thuốc" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Nhà sản xuất"
            name="origin"
            rules={[{ required: true, message: "Chưa nhập nhà sản xuất" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Số lượng" style={{ marginBottom: "2px" }}>
            <Form.Item
              label=""
              name="amount"
              style={{
                display: "inline-block",
                width: "30%",
                marginRight: "27px",
              }}
            >
              <InputNumber min="0" />
            </Form.Item>

            <Form.Item
              label="Đơn vị"
              name="uni"
              // hasFeedback
              // rules={[{ required: true, message: "Vui lòng chọn đơn vị" }]}
              style={{
                display: "inline-block",
                width: "60%",
              }}
            >
              <Select
                placeholder="Đơn vị"
                allowClear
                value={selected}
                onChange={(e) => setSelected(e)}
              >
                <Option value="Hộp">Hộp</Option>
                <Option value="Vỉ">Vỉ</Option>
                <Option value="Tuýp">Tuýp</Option>
                <Option value="Viên">Viên</Option>
                <Option value="Chiếc">Chiếc</Option>
              </Select>
            </Form.Item>
          </Form.Item>

          <Form.Item
            label="Ngày sản xuất"
            name="importDate"
            rules={[{ required: true, message: "Chưa chọn ngày sản xuất" }]}
          >
            <DatePicker format={dateFormat} />
          </Form.Item>

          <Form.Item
            label="Hạn sử dung"
            name="expDate"
            rules={[{ required: true, message: "Chưa chọn hạn sử dụng" }]}
          >
            <DatePicker format={dateFormat} />
          </Form.Item>

          <Form.Item label="Hướng dẫn sử dụng" name="manual">
            <TextArea rows={2} />
          </Form.Item>

          <Form.Item label="Ghi chú" name="note">
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item label="Giá nhập" style={{ marginBottom: "10px" }}>
            <Form.Item
              label=""
              name="importPrice"
              style={{
                display: "inline-block",
                width: "30%",
                marginRight: "50px",
              }}
            >
              <Input placeholder="VND" />
            </Form.Item>

            <Form.Item
              label="Giá bán"
              name="price"
              style={{ display: "inline-block", width: "50%" }}
            >
              <Input placeholder="VND" />
            </Form.Item>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 12, span: 20 }}>
            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Chỉnh Sửa Thông Tin Thuốc"
        centered
        visible={isOpenEdit}
        width={1000}
        footer={null}
        onCancel={() => setIsOpenEdit(false)}
        destroyOnClose={true}
      >
        <Form
          form={form}
          name="formEditMedicine"
          labelCol={{ span: 10 }}
          wrapperCol={{ span: 8 }}
          onFinish={onEditFinish}
        >
          {/* <Link
            to={"/moderator/medicine"}
            style={{ color: "black", fontSize: "20px" }}
          >
            <RollbackOutlined />
          </Link> */}

          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>

          <Form.Item
            label="Tên thuốc"
            name="name"
            rules={[{ required: true, message: "Chưa nhập tên thuốc" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Nhà sản xuất"
            name="origin"
            rules={[{ required: true, message: "Chưa nhập nhà sản xuất" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Số lượng" style={{ marginBottom: "2px" }}>
            <Form.Item
              label=""
              name="amount"
              style={{
                display: "inline-block",
                width: "30%",
                marginRight: "27px",
              }}
            >
              <InputNumber min="0" />
            </Form.Item>

            <Form.Item
              label="Đơn vị"
              name="uni"
              // hasFeedback
              // rules={[{ required: true, message: "Vui lòng chọn đơn vị" }]}
              style={{
                display: "inline-block",
                width: "60%",
              }}
            >
              <Select
                placeholder="Đơn vị"
                allowClear
                value={selected}
                onChange={(e) => setSelected(e)}
              >
                <Option value="Hộp">Hộp</Option>
                <Option value="Vỉ">Vỉ</Option>
                <Option value="Tuýp">Tuýp</Option>
                <Option value="Viên">Viên</Option>
                <Option value="Chiếc">Chiếc</Option>
              </Select>
            </Form.Item>
          </Form.Item>

          <Form.Item
            label="Ngày sản xuất"
            name="importDate"
            rules={[{ required: true, message: "Chưa chọn ngày sản xuất" }]}
          >
            <DatePicker format={dateFormat} />
          </Form.Item>

          <Form.Item
            label="Hạn sử dung"
            name="expDate"
            rules={[{ required: true, message: "Chưa chọn hạn sử dụng" }]}
          >
            <DatePicker format={dateFormat} />
          </Form.Item>

          <Form.Item label="Hướng dẫn sử dụng" name="manual">
            <TextArea rows={2} />
          </Form.Item>

          <Form.Item label="Ghi chú" name="note">
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item label="Giá nhập" style={{ marginBottom: "10px" }}>
            <Form.Item
              label=""
              name="importPrice"
              style={{
                display: "inline-block",
                width: "30%",
                marginRight: "50px",
              }}
            >
              <Input placeholder="VND" />
            </Form.Item>

            <Form.Item
              label="Giá bán"
              name="price"
              style={{ display: "inline-block", width: "50%" }}
            >
              <Input placeholder="VND" />
            </Form.Item>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 12, span: 20 }}>
            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
