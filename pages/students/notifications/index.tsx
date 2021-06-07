import { EyeOutlined, MessageOutlined, NotificationOutlined } from "@ant-design/icons"
import { Avatar, Button, List, Space, Tooltip } from "antd"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import MainLayout from "../../../components/layouts/MainLayout"
import { formatDate } from "../../../lib/formatDate"
import { getAllNotifications } from "../../../lib/notification/notification"
import { API } from "../../../prisma/type/type"

const NotificationList: React.FC = () => {
    const [notis, setNotis] = useState<API.NotificationItem[]>([])
    const router = useRouter()

    useEffect(() => {
        const studentId = parseInt(localStorage.getItem('userId'))
        getAllNotifications({ studentId })
            .then(res => {
                setNotis(res)
            })
    }, [])

    const IconText = ({ icon, text }) => (
        <Space>
            {React.createElement(icon)}
            {text}
        </Space>
    );

    return (
        <MainLayout title='Tất cả thông báo'>
            <div className="site-layout-background" >
                {notis.length !== 0 ? <List
                    itemLayout="vertical"
                    dataSource={notis}
                    pagination={{
                        pageSize: 3,
                        total: notis.length,
                        showTotal: total => `Tổng ${total} thông báo`,
                    }}
                    renderItem={item => (
                        <List.Item
                            extra={[
                                <Tooltip title='Xem'>
                                    <Button
                                        type='primary'
                                        shape='circle'
                                        onClick={() => {
                                            router.push({
                                                pathname: `/students/classrooms/notifications`,
                                                query: {
                                                    id: item.id
                                                }
                                            }, `/students/classrooms/${item.classId}/notifications/${item.id}`)
                                        }}
                                        icon={<EyeOutlined />} /></Tooltip>,
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
                                description={<>
                                    <small>{item.classroom.name}</small><br/>
                                    <small>{formatDate(new Date(item.updatedAt), true)}</small> - <Tooltip title={`Có ${item.notiComment.length} bình luận`}><span><IconText icon={MessageOutlined} text={item.notiComment.length} key="list-vertical-message" /></span></Tooltip>
                                </>}
                            />
                        </List.Item>
                    )}
                /> : <p>Không có thông báo nào</p>}
            </div>
        </MainLayout>
    )
}

export default NotificationList