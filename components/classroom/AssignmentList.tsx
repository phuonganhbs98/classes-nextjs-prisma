import { Badge, Button, Divider, Table, Tooltip } from "antd";
import { session } from "next-auth/client";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { deleteAssignment, findAll, updateStatus } from "../../lib/assignment/assignment";
import { formatDate } from "../../lib/formatDate";
import { API } from "../../prisma/type/type";
import Columns from "../column/Columns";
import {EyeOutlined, DeleteOutlined, EditOutlined} from '@ant-design/icons'
import Link from "next/link";

type Props = {
    classId: number,
    display: string
}
function onChange(pagination: any) {
    console.log('params', pagination);
}
const AssignmentList: React.FC<Props> = ({ classId, display }) => {
    const [data, setData] = useState<API.AssignmentItem[]>([])
    const [visible, setVisible] = useState<Boolean>(false)
    const [checkReload, setCheckReload] = useState<boolean>(false)
    const router = useRouter()
    let assignments = []
    useEffect(() => {
        findAll({ classId: classId }).then(res => setData(res))
    }, [checkReload, session])

    if (data.length > 0) {
        data.forEach((x: API.AssignmentItem) => {
            updateStatus(x.id)
            let className = x.class?.name
            assignments = [
                ...assignments,
                {
                    ...x,
                    deadlineFormat: formatDate(new Date(x.deadline), true),
                    statusRender: <>{x.status==="ASSIGNED"?<Badge status="success" />:<Badge status="error" />}{x.status}</>,
                    className: <Link href={`/classrooms/${x.classId}`}>{className? className: 'Lớp'}</Link>,
                    action: [
                        <Tooltip overlay='Xem' key={1}><Button key={1} type='link' icon={<EyeOutlined />} onClick={() => router.push(`/assignments/${x.id}`)} ></Button></Tooltip>,
                        <Tooltip overlay='Sửa' key={2}><Button key={2} type='link' icon={<EditOutlined />} onClick={() => handleEdit(x.id)} ></Button></Tooltip>,
                        <Tooltip overlay='Xóa' key={3}><Button key={3} type='link' icon={<DeleteOutlined />} onClick={() => handleDelete(x.id)} danger></Button></Tooltip>
                    ]
                }
            ]
        })
    }

    const handleEdit = (assignmentId: number) =>{
        
    }

    const handleClick = () => {
        if (visible) setVisible(false)
        else setVisible(true)
    }

    const handleDelete = (assignmentId: number) => {
        deleteAssignment(assignmentId)
        if (checkReload) setCheckReload(false)
        else setCheckReload(true)
    }
    const columns = Columns.columnAssignments
    return (
        <div style={{ display: display }}>
            <Divider orientation="left" dashed={true} plain={true} style={{ paddingBottom: '20px' }}>
                <Tooltip title="Xem danh sách bài tập đã giao">
                    <Button style={{ fontSize: '20px', fontWeight: 'bolder' }} type="text" onClick={() => handleClick()}>Danh sách bài tập</Button>
                </Tooltip>
            </Divider>
            <Table
                style={{ display: visible ? 'inline' : 'none' }}
                columns={columns}
                dataSource={assignments}
                onChange={onChange}
                rowKey={(record) => { return record.id.toString() }}
            />
        </div>
    )
}

export default AssignmentList;