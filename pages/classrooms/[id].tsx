import MainLayout from "../../components/layouts/MainLayout";
import { List, PageHeader, Button, Row, Col, Divider, Tooltip } from "antd";
import { useSession } from "next-auth/client";
import { formatDate, formatTime, formatDay } from "../../lib/formatDate"
import { getClassById } from '../../lib/classroom/getClassroomInfor'
import deleteClass from '../../lib/classroom/deleteClass'
import React, { useEffect, useState } from "react";
import { Schedule, ClassStatus, RegisterStatus } from ".prisma/client";
import checkRegister from "../../lib/register/checkRegister";
import {sendRegister, cancel} from "../../lib/register/handleRegister";
import { useRouter } from "next/router";
import { MinusOutlined } from '@ant-design/icons';

type ClassroomInfor = {
    id: number;
    name: string;
    teacherId: number;
    teacher: {
        name: string;
    };
    teacherName: string;
    status: ClassStatus;
    capacity: number;
    students: {
        id: number;
    }[];
    startAt: Date;
    endAt: Date;
    schedules: Schedule[];
    count: number
}

type Schedules = {
    dayInWeek: number,
    startAt: Date,
    endAt: Date
}

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
    const [data, setData] = useState<ClassroomInfor>()
    const [schedules, setSchedules] = useState<Schedules[]>([])
    const [canEdit, setCanEdit] = useState(false)
    const [register, setRegister] = useState<Boolean>()
    const [registerButton, setRegisterButton] = useState<string>()

    useEffect(() => {
        if (session) {
            setRole(session.role)
            setUserId(session.userId)
            getClassById(id).then(res => {
                setData(res.data)
                setSchedules(res.schedules)
                if (data?.teacherId === session.userId) setCanEdit(true)
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
    let schedule = []
    if (schedules.length > 0) {
        schedules.forEach((x: Schedules) => {
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

    const handleRegister = () => {
        sendRegister(userId, id)
        setRegister(true)
        setRegisterButton('Đã đăng ký')
    }

    const cancelRegister = () =>{
        cancel(userId, id)
        setRegister(false)
        setRegisterButton('Đăng ký')
    }
    return (
        <MainLayout title="Thông tin lớp học">
            <PageHeader
                title=""
                extra={[
                    <Button key='1' disabled={disableButton} type="primary" onClick={() => handleRegister()}>{registerButton}</Button>,
                    (<Tooltip title="Hủy đăng ký">
                        <Button type="primary" size="small" style={{display: disableButton?'inline':'none'}} shape="circle" icon={<MinusOutlined />} onClick={() => cancelRegister()} danger/>
                    </Tooltip>),
                    <Button key='2' style={editButton} type="ghost">Sửa</Button>,
                    <Button key='3' style={editButton} type="primary" onClick={() => deleteClass(id)} danger>Xóa</Button>
                ]}
            ></PageHeader>
            <p style={{
                fontSize: '30px',
                fontWeight: 'bolder',
                margin: '0 20px 0 2%',
            }}> {data?.name} </p>
            <Divider orientation="right" plain={false} style={{ fontSize: '14px' }}>
                <em>Được tạo bởi:
                    <a href={`/users/${data?.teacherId}`}> {data?.teacherName}</a></em>
            </Divider>
            <Row align="top" justify="space-around" style={{
                marginTop: '2em'
            }}>
                <Col key="1" span={10} push={1}>
                    <p><strong>ID: </strong>{data?.id}</p>
                    <p><strong>Trạng thái: </strong>{data?.status}</p>
                    <Divider key={1} />
                    <p><strong>Số lượng học viên tối đa: </strong>{data?.capacity}</p>
                    <p><strong>Sĩ số: </strong>{data?.count}</p>
                    <Divider key={2} />
                    <p><strong>Ngày bắt đầu: </strong>{data ? formatDate(new Date(data.startAt)) : null}</p>
                    <p><strong>Ngày kết thúc: </strong>{data ? formatDate(new Date(data.endAt)) : null}</p>
                </Col>
                <Col key="2" span={10} push={1}>
                    <List
                        size="small"
                        header={<strong>Thời khóa biểu</strong>}
                        bordered={false}
                        dataSource={schedule}
                        renderItem={(item, index) => <List.Item key={index}>{item}</List.Item>}
                        style={{
                            margin: '0px 5% 20px'
                        }}
                    />
                </Col>
            </Row>
        </MainLayout>
    )
}

export default ClassroomInfor;