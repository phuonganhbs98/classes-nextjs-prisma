import { AttendanceStatus } from ".prisma/client"
import { SaveOutlined } from "@ant-design/icons"
import { Avatar, Button, PageHeader, Select } from "antd"
import Table, { ColumnsType } from "antd/lib/table"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import MainLayout from "../../../components/layouts/MainLayout"
import { getAttendanceByClassId, update } from "../../../lib/attendance/attendance"
import { getClassById } from "../../../lib/classroom/getClassroomInfor"
import { formatDate } from "../../../lib/formatDate"
import { API } from "../../../prisma/type/type"

const Attendance: React.FC = () => {
    const [classroom, setClassRoom] = useState<API.Classroom>()
    const [attendances, setAttendances] = useState<API.Attendance[]>([])
    const [total, setTotal] = useState<number>(-1)
    const [reload, setReload] = useState<boolean>(false)
    const router = useRouter()
    const classId = Array.isArray(router.query.classId) ? undefined : parseInt(router.query.classId)
    const date = Array.isArray(router.query.day) ? undefined : router.query.day

    useEffect(() => {
        getClassById(classId)
            .then(res => setClassRoom(res.data))
    }, [])
    useEffect(() => {
        getAttendanceByClassId({ classId: classId, date: date })
            .then(res => {
                let count = 0
                setTotal(res.length)
                setAttendances(res.map((x: API.Attendance) => {
                    return {
                        ...x,
                        no: ++count
                    }
                }))
            })
    }, [reload])

    let array: API.UpdateStatusAttendance[] = []

    attendances.forEach((x: API.Attendance) => {
        array = [
            ...array,
            {
                id: x.id,
                status: 'P'
            }
        ]
    })

    const handleChange = (no: number, status: any) => {

        array[no - 1].status = status
        console.log(array)
    }

    const columns: ColumnsType<API.Attendance> = [
        {
            title: 'STT',
            dataIndex: 'no',
        },
        {
            title: 'Avatar',
            dataIndex: 'avatar',
            render: (text, record) => {
                return (
                    <Avatar src={record.student.image} />
                )
            }
        },
        {
            title: 'Tên học sinh',
            dataIndex: 'studentName',
            render: (text, record) => {
                return (
                    <a onClick={()=> router.push(`/users/${record.studentId}`)}>{record.student.name}</a>
                )
            }
        },
        {
            title: 'Điểm danh',
            dataIndex: 'status',
            align: 'center'
        },
        {
            title: '',
            dataIndex: 'action',
            render: (text, record) => {
                return (
                    <Select
                        defaultValue={record.status}
                        style={{ width: 80 }}
                        key={record.id}
                        onChange={(value) => handleChange(record.no, value)}
                    >
                        <Select.Option key={`${record.id} P`} value="P">P</Select.Option>
                        <Select.Option key={`${record.id} L`} value="L">L</Select.Option>
                        <Select.Option key={`${record.id} UA`} value="UA">UA</Select.Option>
                        <Select.Option key={`${record.id} AA`} value="AA">AA</Select.Option>
                    </Select>
                )
            }
        },
    ]

    function onChange(pagination: any) {
        console.log('params', pagination);
    }

    const handleUpdate = async() => {
        await update(array)
            .then(res => {
                if (reload) setReload(false)
                else setReload(true)
            })
    }

    return (
        <MainLayout title='Điểm danh'>
            <div className="site-layout-background">
                <PageHeader
                    title={<div style={{
                        fontSize: '30px',
                        fontWeight: 'bolder',
                        margin: '0 20px 0 2%',
                        cursor: 'pointer'
                    }}
                    onClick={()=> router.push(`/teachers/classrooms/${classroom?.id}`)}
                    >{classroom?.name} </div>}
                    extra={[
                        <Button key='2' type="primary" shape='round' icon={<SaveOutlined />} onClick={() => handleUpdate()}>Lưu</Button>,
                    ]}
                />
                <div style={{ marginLeft: '5%' }}>Buổi học ngày {typeof date !== 'undefined'?formatDate(new Date(date), false):null}</div>
            </div>
            <div className="site-layout-background content">

                <Table<API.Attendance>
                    columns={columns}
                    dataSource={attendances}
                    onChange={onChange}
                    size="middle"
                    pagination={{
                        total: total,
                        showTotal: total => `Tổng ${total} học sinh`,
                        defaultPageSize: 10,
                        defaultCurrent: 1
                    }}
                    rowKey={(record) => { return record.id.toString() }} />
                <small style={{ color: 'red', fontSize: '13px' }}>*P: Present - Có mặt </small><br />
                <small style={{ color: 'red', fontSize: '13px' }}>*L: Late - Đến muộn </small><br />
                <small style={{ color: 'red', fontSize: '13px' }}>*UA: Unauthorized absences - Nghỉ không phép  </small><br />
                <small style={{ color: 'red', fontSize: '13px' }}>*AA: Authorized absences - Nghỉ có phép </small><br />
            </div>
        </MainLayout>
    )
}

export default Attendance