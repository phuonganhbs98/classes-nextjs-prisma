import { Badge, Button, DatePicker, Descriptions, Form, Input, Table, Tabs, Tag, Tooltip } from "antd"
import { useSession } from "next-auth/client"
import { useEffect, useState } from "react"
import MainLayout from "../../components/layouts/MainLayout"
import { deleteAssignment, getAssignmentById, update, updateStatus } from "../../lib/assignment/assignment"
import { formatDate } from "../../lib/formatDate"
import { API } from "../../prisma/type/type"
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import { useRouter } from "next/router"
import { getAllAnswer } from "../../lib/answer/answer"
import { Role } from ".prisma/client"
import AnswerForm from "../../components/answer/AnswerForm"
import { checkStudentSubmit } from '../../lib/answer/answer'
import ShowAnswer from "../../components/answer/ShowAnswer"
import Link from "next/link"
import Modal from "antd/lib/modal/Modal"
import moment from "moment"

// export async function getServerSideProps({ params }) {
//     let id = parseInt(params.id)
//     return {
//         props: {
//             id
//         }
//     }
// }
const AssignmentDetail: React.FC = (props) => {
    const [session] = useSession()
    const router = useRouter()
    const id = parseInt(router.query.id)
    const [role, setRole] = useState<Role>()
    const [userId, setUserId] = useState<number>()
    const [visible, setVisible] = useState<boolean>(false)
    const [data, setData] = useState<API.AssignmentItem>()
    const [answers, setAnswers] = useState<API.AnswerItem[]>([])
    const [deadline, setDeadline] = useState<Date>()
    const [checkSubmitAssign, setCheckSubmitAssign] = useState<boolean>(false)
    const [answerOfStu, setAnswerOfStu] = useState<API.AnswerItem>()
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
    const [reload, setReload] = useState<boolean>(false)
    const [reloadAnswer, setReloadAnswer] = useState<boolean>(false)

    useEffect(() => {
        if (session) {
            setRole(session.role)
            setUserId(session.userId)
        }
        console.log('test id')
        console.log(Number.isNaN(id))
        if (!Number.isNaN(id)) {
            updateStatus(id)
            getAssignmentById(id)
                .then(res => {
                    setData(res)
                    if (session) {
                        if (session.userId === res.teacherId) {
                            setVisible(true)
                        } else setVisible(false)
                    }
                    setDeadline(res.deadline)
                })
                .catch(err => console.error(err))

            getAllAnswer(id)
                .then(res => setAnswers(res))
                .catch(err => console.error(err))
        }

    }, [session,id, reload])


    useEffect(() => {
        if (role === 'STUDENT') {
            checkStudentSubmit(userId, id).then(res => {
                if (typeof res.id === 'undefined') setCheckSubmitAssign(false)
                else {
                    setAnswerOfStu(res)
                    setCheckSubmitAssign(true)
                }
            })
        }
    }, [checkSubmitAssign, userId, reloadAnswer])

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

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: 'Sinh viên',
            dataIndex: 'studentName',
            render: (text, record) => (
                <Link href={`/users/${record.studentId}`}>{record.student?.name}</Link>
            )
        },
        {
            title: 'Câu trả lời',
            dataIndex: 'content',
            render: (text, record) => (
                <Tooltip title={text}>
                    <span
                        style={{
                            whiteSpace: 'nowrap',
                            width: '200px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}
                    >{text}</span>
                </Tooltip>
            )
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (text, record) => (
                <>{record.status === 'LATE' ? (<Tag color="red">Nộp muộn</Tag>) : (<Tag color="green">{record.status}</Tag>)}</>
            )
        },
        {
            title: 'Điểm',
            dataIndex: 'score',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (text, record) => (
                (<Tooltip overlay='Xem'><Button type='link' icon={<EyeOutlined />} onClick={() => router.push(`/answers/${record.id}`)} ></Button></Tooltip>)
            )
        }
    ]

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
        if(!Number.isNaN(id)){
            update(id, values)
            if(reload) setReload(false)
            else setReload(true)
        }
        setIsModalVisible(false)
        // router.push('/assignments')
    }

    return (
        <MainLayout title={data?.title}>
            <div className="site-layout-background" >
                <Descriptions title={[<div style={{ fontSize: '18px' }}><em>{data?.content}</em></div>]}
                    column={2}
                    extra={[
                        visible ? <Tooltip overlay='Sửa'><Button type='ghost' icon={<EditOutlined />} onClick={() => handleEdit()} ></Button></Tooltip> : '',
                        visible ? <Tooltip overlay='Xóa'><Button type='ghost' icon={<DeleteOutlined />} onClick={() => handleDelete()} danger></Button></Tooltip> : ''
                    ]}
                >
                    <Descriptions.Item label={<strong>Đường dẫn bổ sung</strong>}>
                        <a href={data ? data.attachment : ''} target='_blank'>{data?.attachment}</a>
                    </Descriptions.Item>
                    <Descriptions.Item label={<strong>Trạng thái</strong>}>{data ? data.status === 'EXPIRED' ? (<Badge status="error" text={data.status} />) : (<Badge status="success" text={data.status} />) : ''}</Descriptions.Item>
                    <Descriptions.Item label={<strong>Thời hạn</strong>}>{deadline ? formatDate(new Date(deadline), true) : null}</Descriptions.Item>
                    <Descriptions.Item label={<strong>Lớp</strong>}>{data?.class?.name}</Descriptions.Item>
                </Descriptions>
            </div>
            <div className="site-layout-background content">
                {visible ? (
                    <Tabs defaultActiveKey="1" style={{ display: visible ? 'inline' : 'none' }}>
                        <Tabs.TabPane tab="Danh sách nộp bài" key="1">
                            <Table columns={columns} dataSource={answers} onChange={onChange} rowKey={(record) => { return record.id?.toString() }} />
                        </Tabs.TabPane>
                    </Tabs>
                ) : checkSubmitAssign ? (
                    <ShowAnswer data={answerOfStu} reloadAnswer={reloadAnswer} setReloadAnswer={setReloadAnswer} deadline={deadline}/>
                ) : (
                    <AnswerForm
                        data={answerOfStu}
                        id={id}
                        studentId={userId}
                        setCheckSubmit={setCheckSubmitAssign}
                        setAnswer={setAnswerOfStu}
                        deadline={deadline}
                    />
                )}

            </div>
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
                        // hasFeedback
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

export default AssignmentDetail;