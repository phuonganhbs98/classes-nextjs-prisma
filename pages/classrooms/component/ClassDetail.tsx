import { List, PageHeader, Button, Row, Col, Divider, Tooltip, Alert, Descriptions, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { RegisterStatus } from ".prisma/client";
import { MinusOutlined } from '@ant-design/icons';
import { API } from "../../../prisma/type/type";
import { getClassById } from "../../../lib/classroom/getClassroomInfor";
import checkRegister from "../../../lib/register/checkRegister";
import { formatDate, formatDay, formatTime } from "../../../lib/formatDate";
import { cancel, sendRegister } from "../../../lib/register/handleRegister";
import deleteClass from "../../../lib/classroom/deleteClass";

const ClassDetail: React.FC<{ id: number, isTeacher: boolean }> = ({ id, isTeacher }) => {
    const [role, setRole] = useState<string>()
    const [userId, setUserId] = useState<number>()
    const [data, setData] = useState<API.Classroom>()
    const [schedules, setSchedules] = useState<API.Schedules[]>([])
    const [canEdit, setCanEdit] = useState(false)
    const [register, setRegister] = useState<Boolean>()
    const [registerButton, setRegisterButton] = useState<string>()
    const [showAlert, setShowAlert] = useState<boolean>(false)

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
    }, [])

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
        if (classes.capacity > classes.count) {
            sendRegister(userId, id)
            setRegister(true)
            setRegisterButton('Đã đăng ký')
            setShowAlert(false)
        } else {
            setShowAlert(true)
        }
    }

    const cancelRegister = () => {
        cancel(userId, id)
        setRegister(false)
        setRegisterButton('Đăng ký')
    }

    const closeAlert = () => {
        setShowAlert(false)
    }
    console.log(showAlert)
    let alert = showAlert ?
        <Alert
            message="Lớp đã đầy"
            type="warning"
            onClose={closeAlert}
            showIcon
            closable
        /> : null
    return (
        <div className="site-layout-background">
            <PageHeader
                title=""
                extra={isTeacher ? [
                    <Button key='2' style={editButton} type="ghost">Sửa</Button>,
                    <Button key='3' style={editButton} type="primary" onClick={() => deleteClass(id)} danger>Xóa</Button>,
                    <br />,
                ] : [
                    <Button key='1' disabled={disableButton} type="primary" onClick={() => handleRegister()}>{registerButton}</Button>,
                    (<Tooltip title="Hủy đăng ký">
                        <Button type="primary" size="small" style={{ display: (disableButton) ? 'inline' : 'none' }} shape="circle" icon={<MinusOutlined />} onClick={() => cancelRegister()} danger />
                    </Tooltip>),
                ]}
            ></PageHeader>
            {[alert]}
            <p style={{
                fontSize: '30px',
                fontWeight: 'bolder',
                margin: '0 20px 0 2%',
            }}> {classes?.name} </p>
            <Divider orientation="right" plain={false} style={{ fontSize: '14px' }}>
                <em>Được tạo bởi:
                    <a href={`/users/${classes?.teacherId}`}> {classes?.teacherName}</a></em>
            </Divider>
            <Row align="middle" justify="space-around" style={{
                marginTop: '2em'
            }}>
                <Col key="1" span={6} push={0}>
                    <p><strong>ID: </strong>{classes?.id}</p>
                    <p><strong>Trạng thái: </strong>{classes?.status}</p>
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
        </div>
    )
}

export default ClassDetail;