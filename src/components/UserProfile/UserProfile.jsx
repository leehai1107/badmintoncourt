import { Button, Form, Input, notification } from "antd";
import React, { useEffect, useState } from "react";
import FormInput from "../FormInput/FormInput";
import { getUser, updateUser } from "../../services/userAPI";
import dayjs from "dayjs";

export default function UserProfile() {
  const [form] = Form.useForm();
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    gender: "",
    dob: "",
  });
  const userId = JSON.parse(
    atob(localStorage.getItem("token").split(".")[1])
  ).id;

  const fetchUser = async () => {
    try {
      const data = await getUser(userId);
      setUser({
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        email: data.email || "",
        gender: data.gender != null ? data.gender : "",
        dob: data.dob ? dayjs(data.dob).format("YYYY-MM-DD") : "",
      });
      form.setFieldsValue({
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        email: data.email || "",
        gender: data.gender != null ? data.gender : "",
        dob: data.dob ? dayjs(data.dob).format("YYYY-MM-DD") : "",
      });
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleSave = async (values) => {
    const data = {
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      gender: values.gender,
      dob: dayjs(values.dob).format("YYYY-MM-DD"),
    };
    await updateUser(data, userId);
    notification.success({
      message: "Cập nhật thành công",
      description: "Thông tin người dùng đã được cập nhật.",
    });
    fetchUser();
  };

  return (
    <>
      <div className="container mx-auto p-12 h-2/4 w-2/4">
        <Form form={form} onFinish={handleSave}>
          <FormInput label={"Họ:"} name={"first_name"}>
            <Input type="text" placeholder="Enter first name" />
          </FormInput>
          <FormInput label={"Tên:"} name={"last_name"}>
            <Input type="text" placeholder="Enter last name" />
          </FormInput>
          <FormInput label={"Email:"} name={"email"}>
            <Input
              className="w-full h-9 border-2 rounded-lg"
              type="email"
              placeholder="Enter email"
            />
          </FormInput>
          <FormInput label={"Giới tính:"} name={"gender"}>
            <select className="w-full h-9 border-2 rounded-lg">
              <option value="true">Nam</option>
              <option value="false">Nữ</option>
              <option value="">Khác</option>
            </select>
          </FormInput>
          <FormInput label={"Ngày tháng năm sinh:"} name={"dob"}>
            <Input type="date" placeholder="Enter day of birth" />
          </FormInput>
          <FormInput>
            <Button type="primary" htmlType="submit">
              Lưu thay đổi
            </Button>
          </FormInput>
        </Form>
      </div>
    </>
  );
}
