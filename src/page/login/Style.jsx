import styled from "styled-components";
import { Input, Button } from "antd";

export const Wrapper = styled.div`
  text-align: center;
  font-family: "Roboto";
  display: block;
  background: #fff;
  width: 100vw;
  height: 100vh;
  margin: auto;
  background: linear-gradient(199deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
`;

export const Title = styled.div`
  font-size: large;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: bold;
  padding-top: 25vh;
  padding-bottom: 40px;
  color: white;
`;

export const WrapperInput = styled.div`
  margin: auto;
  width: 290px;
`;

export const InputLogin = styled(Input)`
  margin-bottom: 30px;
  border: none;
  border-bottom: 1px solid black;
  height: 31px;
  width: 290px;
  background: transparent;
  :focus {
    border: none;
    border-bottom: 1px solid black;
  }
  .ant-input:hover {
    border: 1px bold black;
  }
`;
export const InputLogin1 = styled(Input.Password)`
  border: none;
  border-bottom: 1px solid black;
  height: 31px;
  width: 290px;
  background: transparent;
  &.ant-input-affix-wrapper > input.ant-input {
    background: transparent;
  }
  :focus {
    border: 1px solid black;
    border-radius: 10px;
  }
`;

export const Submit = styled(Button)`
  margin-top: 30px;
  border-radius: 10px;
  border: 1px solid white;
  background: transparent;
  color: white;
  :hover {
    color: black;
    background-color: white;
    border: white;
  }
  :focus {
    color: black;
    background-color: white;
    border: white;
  }
`;

