import { List, PageHeader, Button, Row, Col, Divider, Tooltip, Alert, Descriptions, Tabs, Tag, message, Popconfirm } from "antd";
import React, { useEffect, useState } from "react";
import { RegisterStatus } from ".prisma/client";
import { MinusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { API } from "../../../prisma/type/type";
import { getClassById } from "../../../lib/classroom/getClassroomInfor";
import checkRegister from "../../../lib/register/checkRegister";
import { formatDate, formatDay, formatTime } from "../../../lib/formatDate";
import { cancel, sendRegister } from "../../../lib/register/handleRegister";
import deleteClass from "../../../lib/classroom/deleteClass";
import EditClassForm from "./EditClassForm";

const ClassDetail: React.FC<{ id: number, isTeacher: boolean }> = ({ id, isTeacher }) => {
    const [role, setRole] = useState<string>()
    const [userId, setUserId] = useState<number>()
    const [data, setData] = useState<API.Classroom>()
    const [schedules, setSchedules] = useState<API.Schedules[]>([])
    const [canEdit, setCanEdit] = useState(false)
    const [register, setRegister] = useState<Boolean>()
    const [registerButton, setRegisterButton] = useState<string>()
    const [reload, setReload] = useState<boolean>(false)
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)

    useEffect(() => {
        const role = localStorage.getItem('role')
        const userId = parseInt(localStorage.getItem('userId'))
        setRole(role)
        setUserId(userId)
        getClassById(id).then(res => {
            setData(res.data)
            setSchedules(res.schedules)
            if (isTeacher) setCanEdit(true)
            else setCanEdit(false)
        })
    }, [reload])

    useEffect(() => {
        if (userId) {
            checkRegister(userId, id).then(res => {
                if (res === null) {
                    setRegister(false)
                    setRegisterButton('Đăng ký')
                }
                else {
                    setRegister(true)
                    if (res === RegisterStatus.REGISTERED)
                        setRegisterButton('Đã đăng ký')
                    else setRegisterButton('Đang tham gia')
                }
            })
        }
    }, [userId, register])

    const editButton = canEdit ? { display: 'inline' } : { display: 'none' }
    const disableButton = ((role === 'STUDENT') && !register) ? false : true
    let schedule = []
    if (schedules.length > 0) {
        schedules.forEach((x: API.Schedules) => {
            schedule = [
                ...schedule,
                [
                    <><p>{formatDay(x.dayInWeek)}</p><p>{formatTime(new Date(x.startAt))}</p>~<p> {formatTime(new Date(x.endAt))}</p></>
                ],
            ]
        })
    } else {
        schedule = [(<p>Chưa cập nhật</p>)]
    }

    let classes = null
    if (data) {
        classes = {
            ...data,
            teacherName: data.teacher.name,
            count: data.students.length
        }
    }

    const handleRegister = () => {
        if (classes.capacity <= classes.count){
            message.error('Lớp đã đầy')
        }else if(classes.status==='FINISHED'){
            message.error('Lớp học đã kết thúc. Không thể đăng ký')
        }else{
            sendRegister(userId, id)
            setRegister(true)
            setRegisterButton('Đã đăng ký')
            message.success('Đăng ký thành công')
        }
    }

    const cancelRegister = () => {
        cancel(userId, id)
        setRegister(false)
        setRegisterButton('Đăng ký')
    }

    return (
        <div className="site-layout-background">
            <PageHeader
                title={<div style={{
                    fontSize: '30px',
                    fontWeight: 'bolder',
                    margin: '0 20px 0 2%',
                }}> {classes?.name} </div>}
                extra={isTeacher ? [
                    <Button key='2' type="primary" shape='round' icon={<EditOutlined />} onClick={() => setIsModalVisible(true)}>Sửa</Button>,
                    <Popconfirm
                        title="Bạn chắc chắn chứ ?"
                        onConfirm={() => deleteClass(id)}
                    >
                        <Button key='3' type="primary" shape='round' icon={<DeleteOutlined />} danger>Xóa</Button>
                    </Popconfirm>,
                    <br />,
                ] : [
                    <Button key='1' disabled={disableButton} type="primary" onClick={() => handleRegister()}>{registerButton}</Button>,
                    (<Tooltip title="Hủy đăng ký">
                        <Button type="primary" size="small" style={{ display: (disableButton) ? 'inline' : 'none' }} shape="circle" icon={<MinusOutlined />} onClick={() => cancelRegister()} danger />
                    </Tooltip>),
                ]}
            ></PageHeader>
            <Divider orientation="left" plain={false} style={{ fontSize: '14px' }}>
                <em>Được tạo bởi:
                    <a href={`/users/${classes?.teacherId}`}> {classes?.teacherName}</a></em>
            </Divider>
            <Row align="middle" justify="space-around" style={{
                marginTop: '2em'
            }}>
                <Col key="1" span={6} push={0}>
                    <p><strong>ID: </strong>{classes?.id}</p>
                    <p><strong>Trạng thái: </strong>{
                        new Date() < new Date(classes?.startAt) ?
                            <Tag color="orange">Sắp bắt đầu</Tag> :
                            new Date() > new Date(classes?.endAt) ?
                                <Tag color="red">Đã kết thúc</Tag> :
                                <Tag color="green"> Đang mở</Tag>}</p>
                    <p><strong>Số lượng học viên tối đa: </strong>{classes?.capacity}</p>
                </Col>
                <Col key="3" span={6} push={0}>
                    <p><strong>Sĩ số: </strong>{classes?.count}</p>
                    <p><strong>Ngày bắt đầu: </strong>{classes ? formatDate(new Date(classes.startAt), false) : null}</p>
                    <p><strong>Ngày kết thúc: </strong>{classes ? formatDate(new Date(classes.endAt), false) : null}</p>
                </Col>
                <Col key="2" span={8} push={0}>
                    <List
                        size="small"
                        header={<strong>Thời khóa biểu</strong>}
                        bordered={false}
                        dataSource={schedule}
                        renderItem={(item, index) => <List.Item key={item}>{item}</List.Item>}
                    />
                </Col>
            </Row>
            <EditClassForm
                classroom={data}
                reload={reload}
                setReload={setReload}
                isModalVisible={isModalVisible}
                setIsModalVisible={setIsModalVisible}
            />
        </div>
    )
}

export default ClassDetail;