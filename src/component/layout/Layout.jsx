import {
  TeamOutlined,
  UserOutlined,
  LogoutOutlined,
  FolderOpenOutlined,
  SnippetsOutlined,
  MedicineBoxOutlined,
  BookOutlined,
} from "@ant-design/icons";
import { Col, Layout, Menu, Button, Row } from "antd";
import { useContext, useEffect, useState } from "react";
import "./Style.css";
import { Link, Outlet } from "react-router-dom";
import { AuthContext } from "../../context/auth.provider";
import { useNavigate } from "react-router-dom";

const { Header, Content, Sider, Footer } = Layout;

const MyLayout = () => {
  const { token, user, logout } = useContext(AuthContext);
  const [collapsed, setCollapsed] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (token === null) navigate("/dang-nhap");
  }, [token]);

  return (
    <Layout>
      <Header
        className="header"
        style={{ position: "sticky", top: 0, zIndex: 10, height:"60px"}}
      >
        <Row>
          <Col
            span={8}
            offset={8}
            className="logo"
            // style={{ background: "#001529", color: "#FFFFFF"}}
          >
            <Link to="/">
              <h1 style={{ color: "white" }}>VH CLINIC</h1>
              {/* <img src="../../asset/icon/patient.png"/> */}
            </Link>
          </Col>
          <Col span={8} style={{ textAlign: "end", paddingRight: "10px" }}>
            <h7 className="name-account">Xin chào, {user?.name}</h7>
            <Button
              className="button-logout"
              onClick={logout}
              shape="circle"
              icon={<LogoutOutlined />}
            ></Button>
          </Col>
        </Row>
      </Header>

      <Layout>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          theme="dark"
        >
          <Menu theme="dark" mode="inline">
            {user?.roles?.includes("ROLE_MODERATOR") ? (
              <Menu.Item key="nav1" icon={<TeamOutlined />}>
                <Link to="/moderator/patient">Bệnh Nhân</Link>
              </Menu.Item>
            ) : null}

            {user?.roles?.includes("ROLE_MODERATOR") ? (
              <Menu.Item key="nav5" icon={<MedicineBoxOutlined />}>
                <Link to="/moderator/medicine">Thuốc</Link>
              </Menu.Item>
            ) : null}

            {user?.roles?.includes("ROLE_ADMIN") ? (
              <Menu.Item key="nav2" icon={<UserOutlined />}>
                <Link to="/admin/employee">Nhân Viên</Link>
              </Menu.Item>
            ) : null}

            {user?.roles?.includes("ROLE_ADMIN") ? (
              <Menu.Item key="nav6" icon={<BookOutlined />}>
                <Link to="/admin/user">Quản lý người dùng</Link>
              </Menu.Item>
            ) : null}
          </Menu>
        </Sider>

        <Layout>
          <Content
            style={{
              margin: "14px 16px 0",
              minHeight: "84vh",
              overflow: "initial",
            }}
          >
            <Outlet />
          </Content>
          <Footer style={{ textAlign: "center" }}>
            VH CLINIC ©2022 Created by Cao Nam
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default MyLayout;
