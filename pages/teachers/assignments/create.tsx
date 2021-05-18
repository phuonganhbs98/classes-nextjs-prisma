import { Button, DatePicker, Form, Input, InputNumber, message, Select } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { create } from "../../../lib/assignment/assignment";
import { getAllClassroom } from "../../../lib/classroom/getClassroomInfor";
import { formatDate } from "../../../lib/formatDate";
import { API } from "../../../prisma/type/type";

const CreateAssignmentForm: React.FC = () => {
    const router = useRouter()
    const [data, setData] = useState<API.Classroom[]>([])
    const [teacherId, setTeacherId] = useState<number>()
    useEffect(() => {
        const userId = parseInt(localStorage.getItem('userId'))
        setTeacherId(userId)
        getAllClassroom().then(res => {
            setData(res.filter(x => x.teacherId === userId))
        })
    }, [teacherId])
    let classes = []
    if (data.length > 0) {
        data.forEach((x: API.Classroom) => {
            classes = [
                ...classes,
                (<Select.Option value={x.id}>{x.name}</Select.Option>)
            ]
        })
    }

    const layout = {
        labelCol: { span: 8, offset: 0 },
        wrapperCol: { span: 10 },
    };
    const tailLayout = {
        wrapperCol: { offset: 8, span: 8 },
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
        message.error('Tạo thất bại')
    };

    const onFinish = async (values: any) => {
        console.log('Received values of form: ');
        console.log(values)
        let data = {
            ...values,
            teacherId: teacherId
        }
        if (typeof values.title === 'undefined') {
            data.title = 'Bài tập ngày ' + formatDate(new Date(), false)
        }
        await create(data)
            .then(res => {
                message.success('Tạo thành công')
                router.push(`/teachers/assignments`)
            })
    }
    const checkDeadline = (_: any, value: string) => {
        if (new Date(value) > new Date())
            return Promise.resolve()
        else return Promise.reject(new Error('Thời hạn phải lớn hơn ngày hiện tại'))
    }

    return (
        <MainLayout title='Giao bài tập mới'>
            <div className="site-layout-background">
                <Form
                    {...layout}
                    name="basic"
                    layout="horizontal"
                    initialValues={{ remember: false }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    style={{
                        paddingTop: "2%"
                    }}
                >
                    <Form.Item
                        label='Lớp'
                        name='classId'
                        rules={[{ required: true, message: 'Hãy chọn một lớp' }]}
                    >
                        <Select placeholder='Hãy chọn một lớp'>
                            {classes}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Tiêu đề"
                        name="title"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Nội dung đề bài"
                        name="content"
                        rules={[{ required: true, message: 'Xin vui lòng nhập nội dung đề bài !' }]}
                    >
                        <Input.TextArea placeholder='Đề bài / Nội dung câu hỏi' />
                    </Form.Item>
                    <Form.Item
                        label="Đường dẫn bổ sung"
                        name="attachment"
                    >
                        <Input />
                    </Form.Item>
                    {/* <small>Có thể bỏ qua</small> */}
                    <Form.Item
                        label="Thời hạn"
                        name="deadline"
                        rules={[
                            { required: true, message: 'Xin vui lòng nhập thời hạn !' },
                            { validator: checkDeadline }
                        ]}
                    >
                        <DatePicker showTime format='DD-MM-YYYY HH:mm:ss' allowClear={true} />
                    </Form.Item>
                    <Form.Item {...tailLayout} >
                        <Button type="primary" htmlType="submit" style={{ margin: '0 0 30px' }}>
                            Tạo bài tập
                    </Button>
                    </Form.Item>
                </Form>
            </div>
        </MainLayout>
    )
}

export default CreateAssignmentForm;