import MainLayout from "../../components/layouts/MainLayout";
import { List, PageHeader, Button, Row, Col, Divider, Tooltip, Alert, Descriptions } from "antd";
import { useSession } from "next-auth/client";
import { formatDate, formatTime, formatDay } from "../../lib/formatDate"
import { getClassById } from '../../lib/classroom/getClassroomInfor'
import deleteClass from '../../lib/classroom/deleteClass'
import React, { useEffect, useState } from "react";
import { Schedule, ClassStatus, RegisterStatus } from ".prisma/client";
import checkRegister from "../../lib/register/checkRegister";
import { sendRegister, cancel } from "../../lib/register/handleRegister";
import { MinusOutlined } from '@ant-design/icons';
import RegisterRequest from "../../components/classroom/RegisterRequest";
import StudentList from "../../components/classroom/StudentList";
import AssignmentList from "../../components/classroom/AssignmentList";
import { API } from "../../prisma/type/type";

export async function getServerSideProps({ params }) {
    let id = parseInt(params.id)
    return {
        props: {
            id
        }
    }
}

const ClassroomInfor: React.FC<{ id: number }> = (props) => {
    const [session] = useSession()
    const id = props.id
    const [role, setRole] = useState()
    const [userId, setUserId] = useState()
    const [data, setData] = useState<API.Classroom>()
    const [schedules, setSchedules] = useState<API.Schedules[]>([])
    const [canEdit, setCanEdit] = useState(false)
    const [register, setRegister] = useState<Boolean>()
    const [registerButton, setRegisterButton] = useState<string>()
    const [showAlert, setShowAlert] = useState(false)

    useEffect(() => {
        if (session) {
            setRole(session.role)
            setUserId(session.userId)
            getClassById(id).then(res => {
                setData(res.data)
                setSchedules(res.schedules)
                if (res.data.teacherId === session.userId) setCanEdit(true)
                else setCanEdit(false)
            })
            checkRegister(session.userId, id).then(res => {
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
    }, [session])

    const editButton = canEdit ? { display: 'inline' } : { display: 'none' }
    const disableButton = ((role === 'STUDENT') && !register) ? false : true
    const showRequest = (role === 'TEACHER') ? 'inline' : 'none'
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

    let classes=null
    if(data){
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
        <MainLayout title="Thông tin lớp học">
            <PageHeader
                title=""
                extra={[
                    <Button key='1' disabled={disableButton} type="primary" onClick={() => handleRegister()}>{registerButton}</Button>,
                    (<Tooltip title="Hủy đăng ký">
                        <Button type="primary" size="small" style={{ display: ((role === 'STUDENT') && disableButton) ? 'inline' : 'none' }} shape="circle" icon={<MinusOutlined />} onClick={() => cancelRegister()} danger />
                    </Tooltip>),
                    <Button key='2' style={editButton} type="ghost">Sửa</Button>,
                    <Button key='3' style={editButton} type="primary" onClick={() => deleteClass(id)} danger>Xóa</Button>,
                    <br />,
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
            <RegisterRequest
                display={showRequest}
                classId={id}
            />
            <StudentList
                display={showRequest}
                classId={id}
            />
            <AssignmentList
                display={showRequest}
                classId={id}
            />
        </MainLayout>
    )
}

export default ClassroomInfor;