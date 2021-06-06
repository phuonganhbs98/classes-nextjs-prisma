import { DeleteOutlined, DownOutlined, EditOutlined, EyeOutlined, MessageOutlined, NotificationOutlined, UpOutlined } from "@ant-design/icons"
import { Avatar, Button, Form, List, message, Modal, Popconfirm, Space, Tooltip } from "antd"
import TextArea from "antd/lib/input/TextArea"
import { id } from "date-fns/locale"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { formatDate } from "../../../lib/formatDate"
import { createNoti, deleteNoti, editNoti, getAllNotifications } from "../../../lib/notification/notification"
import { API } from "../../../prisma/type/type"

const NotificationTab: React.FC<{
    classId: number,
    isTeacher: boolean
}> = ({ classId, isTeacher }) => {
    const [reload, setReload] = useState<boolean>(false)
    const [visible, setVisible] = useState<boolean>(false)
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
    const [notifications, setNotifications] = useState<API.NotificationItem[]>([])
    const [notiId, setNotiId] = useState<number>(-1)
    const [notiContent, setNotiContent] = useState<string>('')
    const router = useRouter()
    const pathname= isTeacher?'/teachers':'/students'

    useEffect(() => {
        if (!Number.isNaN(classId)) {
            getAllNotifications(classId)
                .then(res => {
                    console.log(res)
                    setNotifications(res)
                })
        }
    }, [classId, reload])

    const handleSubmit = async (value: any) => {
        if (!Number.isNaN(classId)) {
            const data: API.NotificationItem = {
                ...value,
                classId: classId,
            }
            await createNoti(data)
                .then(res => {
                    message.success('Đăng thông báo thành công')
                    if (reload) setReload(false)
                    else setReload(true)
                }).catch(err => message.error('Thất bại'))
        }
    }

    const handleUpdate = async (value: any) => {
        if (!Number.isNaN(notiId) && notiId !== -1) {
            await editNoti(value, notiId)
                .then(res => {
                    message.success('Thành công')
                    if (reload) setReload(false)
                    else setReload(true)
                    setIsModalVisible(false)
                }).catch(err => message.error('Thất bại'))
        }
    }

    const IconText = ({ icon, text }) => (
        <Space>
            {React.createElement(icon)}
            {text}
        </Space>
    );

    console.log(`${pathname}/classrooms/notifications`)

    return (
        <>
            {isTeacher ? (
                <>
                    <Button
                        type='link'
                        onClick={() => {
                            if (visible) setVisible(false)
                            else setVisible(true)
                        }}
                        icon={visible ? <UpOutlined /> : <DownOutlined />}>
                        Đăng thông báo mới
                </Button>
                    <Form
                        onFinish={handleSubmit}
                        style={{ display: visible ? 'block' : 'none', margin: '0 5%' }}
                    >
                        <Form.Item name='content'>
                            <TextArea rows={3} />
                        </Form.Item>
                        <Form.Item>
                            <Button key='submit' htmlType="submit" type="primary" shape='round'>
                                Đăng
                    </Button>
                        </Form.Item>
                    </Form>
                </>
            ) : null}
            <List
                itemLayout="vertical"
                dataSource={notifications}
                pagination={{
                    pageSize: 3
                }}
                renderItem={item => (
                    <List.Item
                        actions={[

                        ]}
                        extra={[
                            <Tooltip title='Xem'>
                                <Button 
                                type='link' 
                                shape='circle'
                                onClick={()=>{
                                    router.push({
                                        pathname: `${pathname}/classrooms/notifications`,
                                        query: {
                                          id: item.id
                                        }
                                      }, `${pathname}/classrooms/${item.classId}/notifications/${item.id}`)
                                }} 
                                icon={<EyeOutlined />} /></Tooltip>,
                            <Tooltip title='Sửa'><Button
                                type='link'
                                shape='circle'
                                onClick={() => {
                                    setNotiId(item.id)
                                    setNotiContent(item.content)
                                    setIsModalVisible(true)
                                }}
                                icon={<EditOutlined />} /></Tooltip>,
                            <Popconfirm
                                title="Bạn chắc chắn chứ ?"
                                onConfirm={async () => {
                                    await deleteNoti(item.id).then(res => {
                                        message.success('Thành công')
                                        if (reload) setReload(false)
                                        else setReload(true)
                                    })
                                }}
                            >
                                <Button key='3' type="link" shape='circle' icon={<DeleteOutlined />} danger />
                            </Popconfirm>,
                        ]}
                    >
                        <List.Item.Meta
                            avatar={<Avatar style={{ backgroundColor: 'orange' }} icon={<NotificationOutlined />} />}
                            title={<div style={{
                                whiteSpace: 'nowrap',
                                width: '900px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}>{item.content}</div>}
                            description={<><small>{formatDate(new Date(item.updatedAt), true)}</small> - <IconText icon={MessageOutlined} text={item.notiComment.length} key="list-vertical-message" /></>}
                        />
                    </List.Item>
                )}
            />
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
                        initialValue={notiContent}
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
        </>
    )
}

export default NotificationTab