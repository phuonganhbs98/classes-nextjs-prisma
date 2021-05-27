import { Avatar, Divider, Table } from "antd"
import { ColumnsType } from "antd/lib/table"
import getAttendanceDetail from "../../../../lib/attendance/getAttendanceDetail"
import { API } from "../../../../prisma/type/type"

const AttendanceStatistic: React.FC<{
    students: API.UserInfor[],
    classId: number
}> = ({students, classId}) => {

    let studentList: API.UserInfor[] = []
    students.forEach((x: API.UserInfor) => {
        let attendance = getAttendanceDetail(classId, x.attendance)
        studentList = [
            ...studentList,
            {
                ...x,
                presents: attendance.presents,
                absences: attendance.absences,
                total: attendance.total
            }
        ]
    })
    const attendanceColumns: ColumnsType<API.UserInfor> = [
        {
            title: 'Avatar',
            dataIndex: 'avatar',
            align: 'center',
            render: (text, record) => {
                return (
                    <Avatar src={record.image} />
                )
            }
        },
        {
            title: 'Tên học sinh',
            dataIndex: 'name',
            key: 'key',
        },
        {
            title: 'Đi học',
            dataIndex: 'presents',
            align: 'center',
            render: (text, record) => {
                return (
                    <div>{record.presents.length}/{record.total}</div>
                )
            }
        },
        {
            title: 'Nghỉ',
            dataIndex: 'absences',
            align: 'center',
            render: (text, record) => {
                return (
                    <div>{record.absences.length}/{record.total}</div>
                )
            }
        },
    ]
    return (
        <Table<API.UserInfor>
            columns={attendanceColumns}
            dataSource={studentList}
            size="middle"
            expandable={{
                expandedRowRender: (record) => {
                    let show: any[] = []
                    const attendances = [...record.presents, ...record.absences]
                    attendances.forEach((x: API.Attendance) => {
                        show = [
                            ...show,
                            <div
                                key={`attendance detail ${record.id}`}
                                style={{ marginLeft: '8%' }}
                            >Ngày {x.time}: &nbsp;&nbsp;&nbsp;&nbsp;{x.status}<Divider /></div>
                        ]
                    })
                    return (
                        <p>{show}</p>
                    )
                }
            }}
            pagination={{
                total: students.length,
                showTotal: total => `Tổng ${total} học sinh`,
                defaultPageSize: 10,
                defaultCurrent: 1
            }}
            rowKey={(record) => { return record.id.toString() }} />
    )
}

export default AttendanceStatistic