import { EyeOutlined } from "@ant-design/icons"
import { Button, Divider, Tooltip } from "antd"
import Table, { ColumnsType } from "antd/lib/table"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { calculateAveragePoint, getAnswer } from "../../../../lib/achievement/achievement"
import { findAll } from "../../../../lib/assignment/assignment"
import { API } from "../../../../prisma/type/type"

const AveragePoint: React.FC<{
    classId: number,
    studentId: number
}> = ({ classId, studentId }) => {
    const [total, setTotal] = useState<number>(0)
    const [answers, setAnswers] = useState<API.AnswerItem[]>([])
    const [assignments, setAssignments] = useState<API.AssignmentItem[]>([])
    const router = useRouter()
    useEffect(() => {
        if (studentId !== -1 && !Number.isNaN(studentId)) {
            calculateAveragePoint(classId, studentId)
                .then(res => {
                    setTotal(res.total)
                    setAnswers(res.answerList)
                })
        }
    }, [studentId])

    useEffect(() => {
        findAll({ classId: classId })
        .then(res => setAssignments(res))
    }, [])

    function onChange(pagination: any) {
        console.log('params', pagination);
    }
    const columns: ColumnsType<API.AssignmentItem> = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: 'Bài tập',
            dataIndex: 'title',
            render: (text, record) => {
                return (
                    <a onClick={() => router.push(`/students/assignments/${record.id}`)}>{record.title}</a>
                )
            }
        },
        {
            title: 'Điểm',
            dataIndex: 'score',
            align: 'center',
            render: (text, record) => {
                return (
                    <div>{getAnswer(answers, record.id).length>0?
                        getAnswer(answers, record.id)[0].score: null} / 10</div>
                )
            }
        },
        {
            title: '',
            dataIndex: 'action',
            render: (text, record) => {
                return (
                    <Tooltip title='Xem bài làm'><Button key={record.id}
                        type="link"
                        icon={<EyeOutlined />}
                        onClick={() => router.push({
                            pathname: `/students/assignments/${record.id}`,
                        })} /></Tooltip>
                )
            }
        },

    ]
    return (
        <>
            <Table
                columns={columns}
                dataSource={assignments}
                onChange={onChange}
                size="middle"
                pagination={{
                    total: answers.length,
                    showTotal: total => `Tổng ${total} bài tập`,
                    defaultPageSize: 10,
                    defaultCurrent: 1
                }}
                rowKey={(record) => { return record.id.toString() }} />
            <Divider />
            <div style={{ textAlign: 'right', fontWeight: 'bolder' }}>
                <p>Điểm trung bình</p>
                <p style={{ color: 'red', fontSize: '16px' }}>{total/(assignments.length)}</p>
            </div>
        </>
    )
}

export default AveragePoint