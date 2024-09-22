"use client";
// import { useState } from "react";
import Link from "next/link";
// import type { FormProps } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Typography, Form, Input, message } from "antd";
const { Title } = Typography;

interface props {
  title: string;
  footer: string;
  href: string;
}

interface values {
  username: string;
  password: string;
}

function AuthForm({ title, footer, href }: props) {
  const footerSplit = footer.split("|");

  const onFinish = (values: values) => {
    message.error("Aya beneran istriku");
    message.success("Aya istrikuuu");
    console.log(values);
    alert(`username: ${values.username}\npassword: ${values.password}`);
  };
  return (
    <>
      <Title className="text-center" level={3}>
        Halaman {title} Aplikasi Penjualan Waserda
      </Title>
      {/*<Alert
        message="Error"
        description="username atau password anda salah"
        type="error"
        showIcon
        closable
      />*/}
      <Form onFinish={(values: values) => onFinish(values)} layout="vertical">
        <Form.Item
          name="username"
          label="Username"
          rules={[
            { required: true, message: "tolong ketik username anda!" },
            { whitespace: true, message: "username tidak boleh kosong!" },
            {
              min: 5,
              message: "username setidaknya harus memiliki 5 karakter",
            },
          ]}
          hasFeedback
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="Masukan username anda"
            maxLength={30}
          />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: "tolong ketik password anda!" },
            { whitespace: true, message: "tassword tidak boleh kosong!" },
            {
              min: 8,
              message: "password setidaknya harus memiliki 8 karakter",
            },
          ]}
          hasFeedback
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Masukan password anda"
            maxLength={30}
          />
        </Form.Item>
        {/* Conditional rendering */}
        {href === "/login" ? (
          <Form.Item
            name="confirmPassword"
            label="Konfirmasi password"
            dependencies={["password"]}
            rules={[
              {
                required: true,
                message: "tolong ketik kembali password anda!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    "password tidak sama! harap perika kembali",
                  );
                },
              }),
            ]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Ketik kembali password anda"
              maxLength={30}
              id="validating"
            />
          </Form.Item>
        ) : null}
        <Form.Item className="text-center mt-5">
          <Button block type="primary" size="large" htmlType="submit">
            {title}
          </Button>
        </Form.Item>
      </Form>
      <p>{footerSplit[0]}</p>
      <Link className="text-blue-500" href={href}>
        {footerSplit[1]}
      </Link>
    </>
  );
}

export default AuthForm;
