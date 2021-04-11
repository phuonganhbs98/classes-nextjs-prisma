import MainLayout from "../../components/layouts/MainLayout";
import { List, PageHeader, Button, Row, Col, Divider } from "antd";
import { useSession } from "next-auth/client";
import { formatDate, formatTime, formatDay } from "../../lib/formatDate"
import { getClassById } from '../../lib/classroom/getClassroomInfor'
import deleteClass from '../../lib/classroom/deleteClass'
import React, { useEffect, useState } from "react";
import { Schedule, ClassStatus } from ".prisma/client";

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
    useEffect(() => {
        if (session) {
            setRole(session.role)
            setUserId(session.userId)
            getClassById(id).then(res => {
                setData(res.data)
                setSchedules(res.schedules)
                if (data?.teacherId === userId) setCanEdit(true)
                else setCanEdit(false)
            })
        }
    }, [session])
    const editButton = canEdit ? { display: 'inline' } : { display: 'none' }

    // //can check lai xem sinh vien da dang ky lop chua roi ms disable
    const disableButton = (role === 'STUDENT') || (false) ? false : true

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

    return (
        <MainLayout title="Thông tin lớp học">
            <PageHeader
                title=""
                extra={[
                    <Button key='1' disabled={disableButton} type="primary">Đăng ký</Button>,
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
                    <Divider />
                    <p><strong>Số lượng học viên tối đa: </strong>{data?.capacity}</p>
                    <p><strong>Sĩ số: </strong>{data?.count}</p>
                    <Divider />
                    <p><strong>Ngày bắt đầu: </strong>{data?formatDate(new Date(data.startAt)):null}</p>
                    <p><strong>Ngày kết thúc: </strong>{data?formatDate(new Date(data.endAt)):null}</p>
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