import React from "react"
import { Form, Input, Button } from "antd";
import { signIn } from "next-auth/client";
import alert from "../../lib/alert";

type Props = {}

const layout = {
    labelCol: { span: 8, offset: 0 },
    wrapperCol: { span: 8 },
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

export default function SignInForm() {
    const onFinish = (values: any) => {
        alert('Đăng nhập thành công', 'success')
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div style={{
            padding: "120px 2%",
            backgroundImage: 'url(./image/home_bg.png)',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            minHeight: '650px'

        }}>
            <h2 style={{ textAlign: "center" }}>Đăng nhập</h2>
            <Form
                {...layout}
                name="basic"
                layout="horizontal"
                initialValues={{ remember: false }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Please input your email!' },
                    { type: 'email' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Mật khẩu"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        Đăng nhập
                    </Button>
                </Form.Item>
                <Button type="link"
                    htmlType="button"
                    style={{ marginLeft: '30%' }}
                    onClick={() => signIn('google', { callbackUrl: '/' })}>Đăng nhập bằng tài khoản google</Button>
            </Form>

        </div >
    );
}
