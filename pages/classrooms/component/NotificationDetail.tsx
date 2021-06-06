import { useEffect, useState } from "react"
import { API } from "../../../prisma/type/type"
import { deleteNoti, editNoti, getNotiById } from '../../../lib/notification/notification'
import { formatDate } from "../../../lib/formatDate"
import { Avatar, Button, Col, Form, message, Modal, Popconfirm, Row } from "antd"
import { DeleteOutlined, EditOutlined, NotificationOutlined } from "@ant-design/icons"
import TextArea from "antd/lib/input/TextArea"
import CommentNotiItem from "../../../components/comment/CommentNotiItem"
import { useRouter } from "next/router"

const NotificationDetail: React.FC<{ id: number, isTeacher: boolean }> = ({ id, isTeacher }) => {
    const [noti, setNoti] = useState<API.NotificationItem>()
    const [reload, setReload] = useState<boolean>(false)
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
    const router = useRouter()
    useEffect(() => {
        if (!Number.isNaN(id)) {
            getNotiById(id).then(res => setNoti(res))
        }
    }, [reload])

    const handleUpdate = async (value: any) => {
        if (!Number.isNaN(id) && id !== -1) {
            await editNoti(value, id)
                .then(res => {
                    message.success('Thành công')
                    if (reload) setReload(false)
                    else setReload(true)
                    setIsModalVisible(false)
                }).catch(err => message.error('Thất bại'))
        }
    }

    return (
        <>
            <div className="site-layout-background">
                <Row>
                    <Col span={2}>
                        <Avatar style={{ backgroundColor: 'orange' }} icon={<NotificationOutlined />} />
                    </Col>
                    <Col span={10}>
                        <div style={{ fontSize: '18px' }}>{noti?.content}</div>
                        <small>{noti ? formatDate(new Date(noti.updatedAt)) : null}</small>
                    </Col>
                    {isTeacher ? <Col span={12} style={{ textAlign: 'right', marginRight: '0px' }}>
                        <Button
                            type='primary'
                            shape='round'
                            onClick={() => {
                                setIsModalVisible(true)
                            }}
                            icon={<EditOutlined />} >Sửa</Button>
                        <Popconfirm
                            title="Bạn chắc chắn chứ ?"
                            onConfirm={async () => {
                                if (!Number.isNaN(id) && id !== -1) {
                                    await deleteNoti(id).then(res => {
                                        message.success('Thành công')
                                        router.push(`/teachers/classrooms/${noti?.classId}`)
                                    })
                                }
                            }}
                        >
                            <Button
                                type='primary'
                                shape='round'
                                style={{ marginLeft: '10px' }}
                                icon={<DeleteOutlined />} danger>Xóa</Button></Popconfirm>
                    </Col> : null}
                </Row>
                <Modal
                    footer={null}
                    title='Chỉnh sửa'
                    visible={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                >
                    <Form
                        onFinish={handleUpdate}
                    >
                        <Form.Item
                            initialValue={noti?.content}
                            name='content'>
                            <TextArea rows={3} />
                        </Form.Item>
                        <Form.Item>
                            <Button key='submit' htmlType="submit" type="primary" shape='round'>
                                Đăng
                    </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
            {/* <div className="site-layout-background content"> */}
            <CommentNotiItem
                notiId={id}
            />
            {/* </div> */}
        </>
    )
}

export default NotificationDetail