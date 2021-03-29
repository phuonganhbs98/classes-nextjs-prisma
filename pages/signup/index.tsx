import React, { useState } from "react"
import { Form, Input, Button, Select, DatePicker, Upload } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import { message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { User } from "@prisma/client";
import { Base64 } from 'js-base64';
import { useRouter } from 'next/router'
import Link from "next/link";
import SignInForm from "../login";

type Props = {}

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () =>
        callback(reader.result)
    );
    reader.readAsDataURL(img);
    console.log(img)

}

const layout = {
    labelCol: { span: 8, offset: 0 },
    wrapperCol: { span: 8 },
};

const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

const normFile = (e: any) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
        return e;
    }
    return e && e.fileList;
};


const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
};

const SignupForm: React.FC<Props> = (props) => {
    const router = useRouter()
    const [form] = Form.useForm()
    const onReset = () => {
        form.resetFields();
    };
    const [loading, setLoading] = useState(false)
    const [url, setUrl] = useState('')
    const [nameFile, setNameFile] = useState('')
    const handleChange = (infor: any) => {
        console.log("Infor: ")
        console.log(infor)
        if (infor.file.status === 'uploading')
            setLoading(true);
        if (infor.file.status === 'done')
            getBase64(infor.file.originFileObj, (imageUrl: any) => {
                setLoading(false)
                setUrl(imageUrl)
                setNameFile(infor.file.name)
            });
    }

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    const onFinish = async (values: User) => {
        console.log('Received values of form: ', JSON.stringify(values));
        let data = {
            ...values,
            birthDateJson: values.birthDate.toJSON(),
            fileName: nameFile
        }
        console.log(data.birthDateJson)
        data.image = url
        delete data.birthDate
        console.log(url)
        // const res = await fetch('http://localhost:3000/api/users', {
        //     body: JSON.stringify(data),
        //     method: 'POST'
        // })

        // console.log("After send request to create a new User, given response is: ")
        router.push('/login')
    };

    return (
        < div style={{
            margin: "0px 5%",
            padding: "80px 2%",
        }}>
            <h2 style={{ textAlign: "center" }}>Đăng ký</h2>
            <Form
                {...layout}
                name="basic"
                layout="horizontal"
                initialValues={{ remember: false }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                onReset={onReset}
                action='http://localhost:3000/login'
            >
                <Form.Item
                    label="Tên đầy đủ"
                    name="name"
                    rules={[{ required: true, message: 'Please input your fullname!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item name="gender" label="Giới tính" rules={[{ required: true, message: "Please fill this field!" }]}>
                    <Select
                        placeholder="Chọn một giới tính phù hợp"
                        allowClear
                    >
                        <Select.Option value="MALE">Nam</Select.Option>
                        <Select.Option value="FEMALE">Nữ</Select.Option>
                        <Select.Option value="OTHER">Khác</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Ngày sinh"
                    name="birthDate"
                >
                    <DatePicker />
                </Form.Item>
                <Form.Item
                    label="Số điện thoại"
                    name="phoneNumber"
                >
                    <Input />
                </Form.Item>

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

                <Form.Item
                    label="Nhập lại mật khẩu"
                    name="confirmPassword"
                    rules={[{ required: true, message: 'Please confirm your password!' }]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item name="role" label="Bạn đăng ký với tư cách là:" rules={[{ required: true, message: "Please fill this field!" }]}>
                    <Select
                        placeholder="Chọn một vai trò"
                        allowClear
                    >
                        <Select.Option value="STUDENT">Học sinh / Sinh viên</Select.Option>
                        <Select.Option value="TEACHER">Giáo viên</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="image"
                    label="Avatar"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                >
                    <Upload
                        name="avatar"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        action=""
                        // beforeUpload={beforeUpload}
                        onChange={handleChange}
                    >
                        {url ? <img src={url} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                    </Upload>
                </Form.Item>

                <Form.Item {...tailLayout}>
                    {/* <Link href='/login' key='1'> */}
                        <Button type="primary" htmlType="submit">
                            Đăng ký
                        </Button>
                    {/* </Link> */}
                    <Button htmlType="button" onClick={onReset}>
                        Reset
                    </Button>
                </Form.Item>

            </Form>
        </div >
    );
}

export default SignupForm;