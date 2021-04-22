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
    visible: string
}
function onChange(pagination: any) {
    console.log('params', pagination);
}
const AssignmentList: React.FC<Props> = ({ classId, visible }) => {
    const [data, setData] = useState<API.AssignmentItem[]>([])
    const [checkReload, setCheckReload] = useState<boolean>(false)
    const router = useRouter()
    let assignments = []
    useEffect(() => {
        findAll({ classId: classId }).then(res => setData(res))
    }, [checkReload])

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
                    action: [
                        <Tooltip overlay='Xem' key={1}><Button key={1} type='link' icon={<EyeOutlined />} onClick={() => router.push(`/assignments/${x.id}`)} ></Button></Tooltip>,
                        <Tooltip overlay='Sửa' key={2}><Button key={2} style={{display: visible}} type='link' icon={<EditOutlined />} onClick={() => handleEdit(x.id)} ></Button></Tooltip>,
                        <Tooltip overlay='Xóa' key={3}><Button key={3} style={{display: visible}} type='link' icon={<DeleteOutlined />} onClick={() => handleDelete(x.id)} danger></Button></Tooltip>
                    ]
                }
            ]
        })
    }

    const handleEdit = (assignmentId: number) =>{
        
    }

    const handleDelete = (assignmentId: number) => {
        deleteAssignment(assignmentId)
        if (checkReload) setCheckReload(false)
        else setCheckReload(true)
    }
    const columns = [
        {
          title:'ID',
          dataIndex: 'id',
        },
        {
          title:'Tiêu đề',
          dataIndex: 'title',
        },
        {
          title:'Thời hạn',
          dataIndex: 'deadlineFormat',
        },
        {
          title:'Status',
          dataIndex: 'statusRender',
        },
        {
          title:'Hành động',
          dataIndex: 'action',
        }
      ]
    return (
            <Table
                columns={columns}
                dataSource={assignments}
                onChange={onChange}
                rowKey={(record) => { return record.id.toString() }}
            />
    )
}

export default AssignmentList;