import {
    Form,
    Input,
    Select,
    DatePicker,
    Button,
    InputNumber,
    TimePicker,
    Space
} from "antd";
import { useRouter } from "next/router";
import MainLayout from "../../components/layouts/MainLayout";
import { useSession } from "next-auth/client";
import { useState } from "react";
import { Moment } from "moment";
import {formatDate} from "../../lib/formatDate"

import {
    MinusCircleOutlined,
    PlusOutlined
} from '@ant-design/icons';

const CreateClassroomForm: React.FC = () => {
    const router = useRouter()
    const [session] = useSession()
    const layout = {
        labelCol: { span: 8, offset: 0 },
        wrapperCol: { span: 8 },
    };

    const tailLayout = {
        wrapperCol: { offset: 8, span: 16 },
    };
    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const onFinish = async (values: any) => {
        console.log('Received values of form: ');
        // process data
        const data = {
            ...values,
            teacherId: session ? session.userId : null,
        }
        console.log(values)
        const res = await fetch('http://localhost:3000/api/classrooms', {
            body: JSON.stringify(data),
            method: 'POST'
        })
        if (res.ok)
            router.push('/classrooms')
    }

    let [startDate, setStartDate] = useState(null);
    const onChangeDate = (e: Moment) => {
        setStartDate(e)
        console.log(e.toString())
        console.log(formatDate(e.toDate()))
    }
    const checkEndDate = (_: any, value: Moment) => {
        if (value > startDate) {
            return Promise.resolve()
        }
        return Promise.reject(new Error('Ngày kết thúc phải lớn hơn ngày bắt đầu'))
    }

    return (
        < MainLayout title="Tạo lớp mới">

            <Form
                {...layout}
                name="basic"
                layout="horizontal"
                initialValues={{ remember: false }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                style={{
                    paddingTop: "10%"
                }}
            >
                <Form.Item
                    label="Tên lớp"
                    name="name"
                    rules={[{ required: true, message: 'Xin vui lòng điền tên lớp học!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Số lượng học sinh / sinh viên"
                    name="capacity"
                    rules={[{ required: true, message: 'Xin vui lòng điền số lượng học sinh / sinh viên!' }]}
                >
                    <InputNumber />
                </Form.Item>
                <Form.Item
                    label="Ngày lớp học bắt đầu"
                    name="startAt"
                >
                    <DatePicker onChange={onChangeDate} allowClear={true} />
                </Form.Item>
                <Form.Item
                    label="Ngày lớp học kết thúc"
                    name="endAt"
                    rules={[{ validator: checkEndDate }]}
                >
                    <DatePicker />
                </Form.Item>
                <Form.List name="schedules">
                    {(fields, { add, remove }) => {
                        return (
                            <>
                                {
                                    fields.map(({ key, name, fieldKey, ...restField }) => {
                                        let startTime = null
                                        const onChangeTime = (e: Moment) => {
                                            startTime = e;
                                        }
                                        const checkEndTime = (_: any, value: Moment) => {
                                            if (value > startTime) {
                                                return Promise.resolve()
                                            }
                                            return Promise.reject(new Error('Thời gian kết thúc phải lớn hơn thời gian bắt đầu'))
                                        }
                                        return (
                                            <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">

                                                <Form.Item label="Thời khóa biểu">
                                                    <Input.Group compact>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, 'day']}
                                                            fieldKey={[fieldKey, 'day']}
                                                            noStyle
                                                            rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
                                                        >
                                                            <Select placeholder="Chọn ngày">
                                                                <Select.Option value="1">Thứ 2</Select.Option>
                                                                <Select.Option value="2">Thứ 3</Select.Option>
                                                                <Select.Option value="3">Thứ 4</Select.Option>
                                                                <Select.Option value="4">Thứ 5</Select.Option>
                                                                <Select.Option value="5">Thứ 6</Select.Option>
                                                                <Select.Option value="6">Thứ 7</Select.Option>
                                                                <Select.Option value="0">Chủ nhật</Select.Option>
                                                            </Select>
                                                        </Form.Item>
                                                        <Form.Item
                                                            {...restField}
                                                            fieldKey={[fieldKey, 'startAt']}
                                                            name={[name, 'startAt']}
                                                            noStyle
                                                            rules={[{ required: true, message: 'Vui lòng nhập vào giờ bắt đầu' }]}
                                                        >
                                                            <TimePicker
                                                                placeholder="Chọn giờ bắt đầu"
                                                                onChange={onChangeTime}
                                                            />
                                                        </Form.Item>
                                                        <Form.Item
                                                            {...restField}
                                                            fieldKey={[fieldKey, 'endAt']}
                                                            name={[name, 'endAt']}
                                                            noStyle
                                                            rules={[
                                                                { required: true, message: 'Vui lòng nhập vào giờ kết thúc' },
                                                                { validator: checkEndTime }
                                                            ]}
                                                        >
                                                            {/* <Input style={{ width: '50%' }} placeholder="Input street" /> */}
                                                            <TimePicker placeholder="Chọn giờ kết thúc" />
                                                        </Form.Item>
                                                    </Input.Group>
                                                </Form.Item>
                                            </Space>
                                        )
                                    })
                                }
                                < Form.Item >
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                        Thêm lịch
                                </Button>
                                </Form.Item>
                            </>
                        )
                    }}






                </Form.List>
                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        Tạo lớp
                        </Button>
                </Form.Item>
            </Form>
        </MainLayout >
    )
}

export default CreateClassroomForm;