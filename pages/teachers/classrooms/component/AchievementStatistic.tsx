import { Avatar, Divider, Table } from "antd"
import { ColumnsType } from "antd/lib/table"
import { Router, useRouter } from "next/router"
import { useEffect, useState } from "react"
import { getAnswer, getAveragePoint } from "../../../../lib/achievement/achievement"
import getAttendanceDetail from "../../../../lib/attendance/getAttendanceDetail"
import { getClassById } from "../../../../lib/classroom/getClassroomInfor"
import { API } from "../../../../prisma/type/type"

const AchievementStatistic: React.FC<{
    students: API.UserInfor[],
    classId: number
}> = ({ students, classId }) => {
    const router = useRouter()
    const [totalAssignment, setTotalAssignment] = useState<number>(0)
    const [assignments, setAssignments] = useState<API.AssignmentItem[]>([])

    useEffect(() => {
        getClassById(classId)
            .then(res => {
                setTotalAssignment(res.data.assignments.length)
                setAssignments(res.data.assignments)
            })
    }, [])

    let studentList: API.AchievementOfStudent[] = []
    if (totalAssignment > 0) {
        students.forEach((x: API.UserInfor) => {
            studentList = [
                ...studentList,
                {
                    id: x.id,
                    student: x,
                    averagePoint: getAveragePoint(x.answers, totalAssignment, classId)
                }
            ]
        })
    }

    const columns: ColumnsType<API.AchievementOfStudent> = [
        {
            title: 'Avatar',
            dataIndex: 'avatar',
            align: 'center',
            render: (text, record) => {
                return (
                    <Avatar src={record.student.image} />
                )
            }
        },
        {
            title: 'Tên học sinh',
            dataIndex: 'name',
            render: (text, record) => {
                return (
                    <div>{record.student.name}</div>
                )
            }
        },
        {
            title: 'Điểm trung bình',
            dataIndex: 'averagePoint',
            align: 'center',
            render: (text, record) => {
                return (<div style={{ color: 'red' }}>{text}/10</div>)
            }
        },
    ]
    return (
        <Table<API.AchievementOfStudent>
            columns={columns}
            dataSource={studentList}
            size="middle"
            expandable={{
                expandedRowRender: (record) => {
                    let show: any[] = []
                    assignments.forEach((x: API.AssignmentItem) => {
                        let answer = getAnswer(record.student.answers, x.id)
                        let score = answer.length > 0 ? answer[0].score : null
                        show = [
                            ...show,
                            <div
                                key={`achievement detail ${x.id}`}
                                style={{ marginLeft: '8%' }}
                            >
                                <a onClick={() => router.push(`/teachers/assignments/${x.id}`)}>{x.title}</a>
                                : &nbsp;&nbsp;&nbsp;&nbsp;{score} / 10<Divider /></div>
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

export default AchievementStatistic