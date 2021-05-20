import { Button, Descriptions, Table, Tabs, Tag, Tooltip } from "antd"
import { useEffect, useState } from "react"
import { EyeOutlined, ReloadOutlined } from '@ant-design/icons'
import { useRouter } from "next/router"
import Link from "next/link"
import { API } from "../../../prisma/type/type"
import { getAllAnswer } from "../../../lib/answer/answer"
import AssignmentDetailLayout from "../../assignments/component/AssignmentDetailLayout"
import { ColumnsType } from "antd/lib/table"
import { formatDate } from "../../../lib/formatDate"

const AssignmentDetail: React.FC = (props) => {
    const router = useRouter()
    let id = -1
    if (!Array.isArray(router.query?.id)) {
        id = parseInt(router.query.id)
    }
    const [answers, setAnswers] = useState<API.AnswerItem[]>([])
    const [reload, setReload] = useState<boolean>(false)

    useEffect(() => {
        if (!Number.isNaN(id)) {
            getAllAnswer(id)
                .then(answers => {
                    setAnswers(answers)
                })
                .catch(err => console.error(err))
        }
    }, [id, reload])

    function onChange(pagination: any) {
        console.log('params', pagination);
    }

    const columns: ColumnsType<API.AnswerItem> = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: 'Sinh viên',
            dataIndex: 'studentName',
            render: (text, record) => (
                <Link href={`/users/${record.studentId}`}>{record.student?.name}</Link>
            )
        },
        {
            title: 'Câu trả lời',
            dataIndex: 'content',
            render: (text, record) => (
                <Tooltip title={text}>
                    <div
                        style={{
                            whiteSpace: 'nowrap',
                            width: '200px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}
                    >{text}</div>
                </Tooltip>
            )
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            filters: [
                {
                    text: 'Nộp muộn',
                    value: 'LATE'
                },
                {
                    text: 'Đã nộp',
                    value: 'SUBMITTED'
                },
            ],
            onFilter: (value, record)=> record.status===value,
            render: (text, record) => (
                <>{record.status === 'LATE' ? (<Tag color="red">Nộp muộn</Tag>) : (<Tag color="green">Đã nộp</Tag>)}</>
            )
        },
        {
            title: 'Chỉnh sửa gần nhất',
            dataIndex: 'updatedAt',
            render: (text, record) => (
                <div>{formatDate(new Date(record.updatedAt))}</div>
            )
        },
        {
            title: 'Điểm',
            dataIndex: 'score',
            align: 'center',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            align: 'center',
            render: (text, record) => (
                (<Tooltip overlay='Xem'><Button type='link' icon={<EyeOutlined />} onClick={() => router.push(`/answers/${record.id}`)} ></Button></Tooltip>)
            )
        }
    ]

    return (
        <AssignmentDetailLayout
            id={id}
            isTeacher={true}
        >
            <div className="site-layout-background content">
                <Tabs defaultActiveKey="1" >
                    <Tabs.TabPane tab="Danh sách nộp bài" key="1">
                        <Descriptions
                            key='answers'
                            extra={[
                                <Button
                                    type='default'
                                    shape='round'
                                    onClick={() => {
                                        if (reload) setReload(false)
                                        else setReload(true)
                                    }}
                                    icon={<ReloadOutlined />} >
                                    Tải lại bảng
                                </Button>
                            ]}
                        />
                        <Table columns={columns} dataSource={answers} onChange={onChange} rowKey={(record) => { return record.id?.toString() }} />
                    </Tabs.TabPane>
                </Tabs>
            </div>
        </AssignmentDetailLayout>
    )
}

export default AssignmentDetail;