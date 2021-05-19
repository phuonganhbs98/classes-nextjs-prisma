import { Button, DatePicker, Descriptions, Form, Input, message, Popconfirm, Tag } from "antd"
import { ReactNode, useEffect, useState } from "react"
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useRouter } from "next/router"
import Modal from "antd/lib/modal/Modal"
import moment from "moment"
import { API } from "../../../prisma/type/type"
import { deleteAssignment, getAssignmentById, update, updateStatus } from "../../../lib/assignment/assignment"
import { formatDate } from "../../../lib/formatDate"
import MainLayout from "../../../components/layouts/MainLayout"
import { getAllAnswer, updateStatusAnswer } from "../../../lib/answer/answer"

const AssignmentDetailLayout: React.FC<{
    id: number,
    isTeacher: boolean,
    children: ReactNode
}> = ({ id, isTeacher, children }) => {
    const router = useRouter()
    const pathname = isTeacher ? '/teachers/classrooms' : '/students/classrooms'
    const [data, setData] = useState<API.AssignmentItem>()
    const [deadline, setDeadline] = useState<Date>()
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
    const [reload, setReload] = useState<boolean>(false)
    const [answers, setAnswers] = useState<API.AnswerItem[]>([])

    useEffect(() => {
        if (!Number.isNaN(id)) {
            getAssignmentById(id)
                .then(res => {
                    setDeadline(res.deadline)
                    setAnswers(res.answers)
                    updateStatus(res)
                        .then(status => res.status = status)
                    setData(res)
                })
                .catch(err => console.error(err))
        }
    }, [id, reload])

    useEffect(() => {
        if (deadline) {
            if (answers.length > 0) {
                answers.forEach(async (x: API.AnswerItem) => {
                    updateStatusAnswer(x, deadline)
                })
            }
        }
    }, [deadline])

    const handleEdit = () => {
        setIsModalVisible(true)
    }

    const handleDelete = () => {
        deleteAssignment(id)
            .then(res => router.push('/assignments'))
            .catch(err => console.error(err))
    }

    function onChange(pagination: any) {
        console.log('params', pagination);
    }

    const handleOk = () => {
        setIsModalVisible(false)
    }

    const handleCancel = () => {
        setIsModalVisible(false)
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
    };

    const onFinish = async (values: any) => {
        await update(id, values)
            .then(res => {
                message.success('Thành công')
                if (reload) setReload(false)
                else setReload(true)
            }).catch(err => {
                console.error(err)
                message.error('Thất bại')
            })
        setIsModalVisible(false)
    }

    return (
        <MainLayout title={data?.title}>
            <div className="site-layout-background" >
                <Descriptions title={[<div style={{ fontSize: '18px' }}><em>{data?.content}</em></div>]}
                    column={2}
                    extra={[
                        isTeacher ? <Button type='primary' shape='round' icon={<EditOutlined />} onClick={() => handleEdit()} >Sửa</Button> : null,
                        isTeacher ?
                            <Popconfirm
                                title="Bạn chắc chắn chứ ?"
                                onConfirm={() => handleDelete()}
                            ><Button type='primary' shape='round' icon={<DeleteOutlined />} style={{ marginLeft: '10px' }} danger>Xóa</Button>
                            </Popconfirm> : null
                    ]}
                >
                    <Descriptions.Item label={<strong>Đường dẫn bổ sung</strong>}>
                        <a href={data ? data.attachment : ''} target='_blank'>{data?.attachment}</a>
                    </Descriptions.Item>
                    <Descriptions.Item label={<strong>Trạng thái</strong>}>
                        {data ? data.status === 'ASSIGNED' ?
                            <Tag color="success">Còn thời gian</Tag> :
                            <Tag color="error">Quá hạn</Tag> : null}
                    </Descriptions.Item>
                    <Descriptions.Item label={<strong>Thời hạn</strong>}>{deadline ? formatDate(new Date(deadline), true) : null}</Descriptions.Item>
                    <Descriptions.Item label={<strong>Lớp</strong>}><a onClick={() => router.push(`${pathname}/${data?.classId}`)}>{data?.class?.name}</a></Descriptions.Item>
                </Descriptions>
            </div>
            {children}
            <Modal title='Chỉnh sửa bài tập' visible={isModalVisible} footer={null} onCancel={handleCancel}>
                <Form
                    {...layout}
                    name="basic"
                    layout="horizontal"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <Form.Item
                        label='Lớp'
                        name='classId'
                        initialValue={data?.class.name}
                        rules={[{ required: true, message: 'Hãy chọn một lớp' }]}
                    >
                        <Input disabled />
                    </Form.Item>
                    <Form.Item
                        label="Tiêu đề"
                        name="title"
                        initialValue={data?.title}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Nội dung đề bài"
                        name="content"
                        rules={[{ required: true, message: 'Xin vui lòng nhập nội dung đề bài !' }]}
                        initialValue={data?.content}
                    >
                        <Input.TextArea placeholder='Đề bài / Nội dung câu hỏi' />
                    </Form.Item>
                    <Form.Item
                        label="Đường dẫn bổ sung"
                        name="attachment"
                        initialValue={data?.attachment}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Thời hạn"
                        name="deadline"
                        rules={[
                            { required: true, message: 'Xin vui lòng nhập thời hạn !' },
                        ]}
                        initialValue={moment(data?.deadline)}
                    >
                        <DatePicker showTime format='DD-MM-YYYY HH:mm:ss' />
                    </Form.Item>
                    <Form.Item  {...tailLayout}>
                        <Button type="primary" htmlType="submit" style={{ margin: '0 0 30px' }}>
                            Submit
                    </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </MainLayout>
    )
}

export default AssignmentDetailLayout;