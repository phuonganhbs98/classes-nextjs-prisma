import { Button, DatePicker, Form, Input, message, Modal, Select } from "antd"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { create } from "../../../lib/assignment/assignment"
import { getAllClassroom } from "../../../lib/classroom/getClassroomInfor"
import { formatDate } from "../../../lib/formatDate"
import { API } from "../../../prisma/type/type"

const CreateModalForm: React.FC<{
    isModalVisible: boolean,
    setIsModalVisible: any,
    currentTabKey: number
}> = ({ isModalVisible, setIsModalVisible, currentTabKey }) => {
    const [userId, setUserId] = useState<number>(-1)
    const [data, setData] = useState<API.Classroom[]>([])
    const router = useRouter()
    useEffect(() => {
        console.log(currentTabKey)
        setUserId(parseInt(localStorage.getItem('userId')))
        const userId = parseInt(localStorage.getItem('userId'))
        getAllClassroom().then(res => {
            setData(res.filter(x => x.teacherId === userId))
        })
    }, [])

    let classes = []
    if (data.length > 0) {
        data.forEach((x: API.Classroom) => {
            classes = [
                ...classes,
                (<Select.Option value={x.id}>{x.name}</Select.Option>)
            ]
        })
    }
    const checkDeadline = (_: any, value: string) => {
        if (new Date(value) > new Date())
            return Promise.resolve()
        else return Promise.reject(new Error('Thời hạn phải lớn hơn ngày hiện tại'))
    }
    return (
        <Modal
            title="Chỉnh sửa thông tin lớp"
            visible={isModalVisible}
            footer={null}
            onCancel={() => setIsModalVisible(false)}>
            <Form<API.AssignmentItem>
                name="basic"
                layout="vertical"
                initialValues={{ remember: false }}
                onFinish={async (values: API.AssignmentItem) => {
                    values.teacherId = userId
                    if (typeof values.title === 'undefined') {
                        values.title = 'Bài tập ngày ' + formatDate(new Date(), false)
                    }
                    await create(values)
                        .then((res: API.AssignmentItem) => {
                            message.success('Tạo thành công')
                            router.push(`/teachers/assignments/${res.id}`)
                        })
                }}
            >
                <Form.Item
                    label='Lớp'
                    name='classId'
                    initialValue={currentTabKey}
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
                <Form.Item >
                    <Button type="primary" htmlType="submit" style={{ margin: '0 0 30px' }}>
                        Tạo bài tập
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default CreateModalForm