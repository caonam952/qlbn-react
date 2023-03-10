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
    // Table.EXPAND_COLUMN,
    {
      title: "T??n thu???c",
      dataIndex: "name",
      key: "name",
      width: 240,
      fixed: "left",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Nh?? s???n xu???t",
      dataIndex: "origin",
      key: "origin",
      width: 180,
    },
    {
      title: "????n v???",
      dataIndex: "uni",
      key: "uni",
      width: 80,
      align: "center",
    },
    {
      title: "S??? l?????ng",
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
      title: "H?????ng d???n s??? d???ng",
      dataIndex: "manual",
      key: "manual",
      width: 300,
    },
    // {
    //   title: "Ghi ch??",
    //   dataIndex: "note",
    //   key: "note",
    //   width: 250,
    // },
    {
      title: "Gi?? b??n (VND)",
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
      title: "B???n c?? ch???c x??a thu???c n??y?",
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
              <h4>Gi?? nh???p</h4>
              <p
                style={{
                  margin: 0,
                  marginBottom: 9,
                }}
              >
                {record.importPrice} VND
              </p>
              <hr width="98%" size="5px" align="center" color="#eeeeee" />
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
        style={{ textAlign: "center" }}
        title={() => <h3>DANH S??CH THU???C</h3>}
      ></Table>

      <Modal
        title="Th??m Th??ng Tin Thu???c"
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
            label="T??n thu???c"
            name="name"
            rules={[{ required: true, message: "Ch??a nh???p t??n thu???c" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Nh?? s???n xu???t"
            name="origin"
            rules={[{ required: true, message: "Ch??a nh???p nh?? s???n xu???t" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="S??? l?????ng" style={{ marginBottom: "2px" }}>
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
              label="????n v???"
              name="uni"
              // hasFeedback
              // rules={[{ required: true, message: "Vui l??ng ch???n ????n v???" }]}
              style={{
                display: "inline-block",
                width: "60%",
              }}
            >
              <Select
                placeholder="????n v???"
                allowClear
                value={selected}
                onChange={(e) => setSelected(e)}
              >
                <Option value="H???p">H???p</Option>
                <Option value="V???">V???</Option>
                <Option value="Tu??p">Tu??p</Option>
                <Option value="Vi??n">Vi??n</Option>
                <Option value="Chi???c">Chi???c</Option>
              </Select>
            </Form.Item>
          </Form.Item>

          <Form.Item
            label="Ng??y s???n xu???t"
            name="importDate"
            rules={[{ required: true, message: "Ch??a ch???n ng??y s???n xu???t" }]}
          >
            <DatePicker format={dateFormat} />
          </Form.Item>

          <Form.Item
            label="H???n s??? dung"
            name="expDate"
            rules={[{ required: true, message: "Ch??a ch???n h???n s??? d???ng" }]}
          >
            <DatePicker format={dateFormat} />
          </Form.Item>

          <Form.Item label="H?????ng d???n s??? d???ng" name="manual">
            <TextArea rows={2} />
          </Form.Item>

          <Form.Item label="Ghi ch??" name="note">
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item label="Gi?? nh???p" style={{ marginBottom: "10px" }}>
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
              label="Gi?? b??n"
              name="price"
              style={{ display: "inline-block", width: "50%" }}
            >
              <Input placeholder="VND" />
            </Form.Item>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 12, span: 20 }}>
            <Button type="primary" htmlType="submit">
              L??u
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Ch???nh S???a Th??ng Tin Thu???c"
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
            label="T??n thu???c"
            name="name"
            rules={[{ required: true, message: "Ch??a nh???p t??n thu???c" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Nh?? s???n xu???t"
            name="origin"
            rules={[{ required: true, message: "Ch??a nh???p nh?? s???n xu???t" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="S??? l?????ng" style={{ marginBottom: "2px" }}>
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
              label="????n v???"
              name="uni"
              // hasFeedback
              // rules={[{ required: true, message: "Vui l??ng ch???n ????n v???" }]}
              style={{
                display: "inline-block",
                width: "60%",
              }}
            >
              <Select
                placeholder="????n v???"
                allowClear
                value={selected}
                onChange={(e) => setSelected(e)}
              >
                <Option value="H???p">H???p</Option>
                <Option value="V???">V???</Option>
                <Option value="Tu??p">Tu??p</Option>
                <Option value="Vi??n">Vi??n</Option>
                <Option value="Chi???c">Chi???c</Option>
              </Select>
            </Form.Item>
          </Form.Item>

          <Form.Item
            label="Ng??y s???n xu???t"
            name="importDate"
            rules={[{ required: true, message: "Ch??a ch???n ng??y s???n xu???t" }]}
          >
            <DatePicker format={dateFormat} />
          </Form.Item>

          <Form.Item
            label="H???n s??? dung"
            name="expDate"
            rules={[{ required: true, message: "Ch??a ch???n h???n s??? d???ng" }]}
          >
            <DatePicker format={dateFormat} />
          </Form.Item>

          <Form.Item label="H?????ng d???n s??? d???ng" name="manual">
            <TextArea rows={2} />
          </Form.Item>

          <Form.Item label="Ghi ch??" name="note">
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item label="Gi?? nh???p" style={{ marginBottom: "10px" }}>
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
              label="Gi?? b??n"
              name="price"
              style={{ display: "inline-block", width: "50%" }}
            >
              <Input placeholder="VND" />
            </Form.Item>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 12, span: 20 }}>
            <Button type="primary" htmlType="submit">
              L??u
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
