import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import React, { useContext, useEffect } from "react";
import { AuthContext } from "../../context/auth.provider";
import {
  Wrapper,
  InputLogin1,
  Title,
  InputLogin,
  WrapperInput,
  Submit,
} from "./Style";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const { user, setUser, token, login, formdata, setFormdata } =
    useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (token != null) navigate("/");
  }, [token]);

  useEffect(() => {
    formdata.username = "";
    formdata.password = "";
  },[user]);

  const handleChange = (e) => {
    e.preventDefault();
    const name = e.target.name;
    const value = e.target.value;
    setFormdata((values) => ({ ...values, [name]: value }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // console.log(formdata);
    login();
  };

  return (
    <Wrapper>
      <Title>ĐĂNG NHẬP</Title>

      <WrapperInput>
        <InputLogin
          type="text"
          placeholder="Username"
          name="username"
          value={formdata.username}
          onChange={handleChange}
        />

        <InputLogin1
          type="password"
          placeholder="Password"
          autoComplete="on"
          name="password"
          value={formdata.password}
          onChange={handleChange}
          iconRender={(visible) =>
            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
          }
        />
      </WrapperInput>
      <Submit type="primary" htmlType="submit" onClick={handleLogin}>
        Đăng nhập
      </Submit>
    </Wrapper>
  );
};
