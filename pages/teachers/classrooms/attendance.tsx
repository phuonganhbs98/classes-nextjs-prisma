import { Avatar, PageHeader } from "antd"
import Table, { ColumnsType } from "antd/lib/table"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import MainLayout from "../../../components/layouts/MainLayout"
import { getAttendanceByClassId } from "../../../lib/attendance/attendance"
import { getClassById } from "../../../lib/classroom/getClassroomInfor"
import { formatDate } from "../../../lib/formatDate"
import { API } from "../../../prisma/type/type"

const Attendance: React.FC = () => {
    const [classroom, setClassRoom] = useState<API.Classroom>()
    const [attendances, setAttendances] = useState<API.Attendance[]>([])
    const [total, setTotal] = useState<number>(-1)
    const router = useRouter()
    const classId = Array.isArray(router.query.classId) ? undefined : parseInt(router.query.classId)
    const date = Array.isArray(router.query.day) ? undefined : router.query.day
    useEffect(() => {
        getClassById(classId)
            .then(res => setClassRoom(res.data))
            console.log('date o attendance.tsx: ' +date)
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
    }, [])

    const columns: ColumnsType<API.Attendance> = [
        {
            title: 'STT',
            dataIndex: 'no',
        },
        {
            title: 'Tên học sinh',
            dataIndex: 'studentName',
            render: (text, record) => {
                return (
                    <div><Avatar src={record.student.image} />{record.student.name}</div>
                )
            }
        },
        {
            title: 'Điểm danh',
            dataIndex: 'action',
            render: (text, record) => {
                return (<div>{record.status}</div>)
            }
        },
    ]

    function onChange(pagination: any) {
        console.log('params', pagination);
      }

    return (
        <MainLayout title='Điểm danh'>
            <div className="site-layout-background">
                <PageHeader
                    title={<div style={{
                        fontSize: '30px',
                        fontWeight: 'bolder',
                        margin: '0 20px 0 2%',
                    }}>Lớp {classroom?.name} </div>}
                    extra={[

                    ]}
                />
                <div style={{ marginLeft: '5%' }}>Buổi học ngày {formatDate(new Date(date), false)}</div>
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
            </div>
        </MainLayout>
    )
}

export default Attendance