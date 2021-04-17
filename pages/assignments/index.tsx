import { Badge, Button, Table, Tooltip } from "antd";
import { useSession } from "next-auth/client";
import React, { useEffect, useState } from "react";
import Columns from "../../components/column/Columns";
import MainLayout from "../../components/layouts/MainLayout";
import { deleteAssignment, findAll, updateStatus } from "../../lib/assignment/assignment";
import { API } from "../../prisma/type/type";
import { EyeOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { useRouter } from "next/router";
import { formatDate } from "../../lib/formatDate";
import Link from "next/link";

const Assignments: React.FC = () => {
  const [data, setData] = useState<API.AssignmentItem[]>([])
  const [session] = useSession()
  const router = useRouter()
  const [teacherId, setTeacherId] = useState<number>()
  const [checkReload, setCheckReload] = useState<boolean>(false)
  let assignments = []
  useEffect(() => {
    if (session) {
      setTeacherId(session.userId)
      findAll({ teacherId: session.userId })
        .then(res => setData(res))
        .catch(err => console.error(err))
    }
  }, [checkReload, session])

  if (data.length > 0) {
    data.forEach((x: API.AssignmentItem) => {
      updateStatus(x.id)
      assignments = [
        ...assignments,
        {
          ...x,
          deadlineFormat: formatDate(new Date(x.deadline), true),
          statusRender: <>{x.status==="ASSIGNED"?<Badge status="success" />:<Badge status="error" />}{x.status}</>,
          className: <Link href={`/classrooms/${x.classId}`}>{x.class.name}</Link>,
          action: [
            <Tooltip overlay='Xem'><Button type='link' icon={<EyeOutlined />} onClick={() => router.push(`/assignments/${x.id}`)} ></Button></Tooltip>,
            <Tooltip overlay='Sửa'><Button type='link' icon={<EditOutlined />} onClick={() => handleEdit(x.id)} ></Button></Tooltip>,
            <Tooltip overlay='Xóa'><Button type='link' icon={<DeleteOutlined />} onClick={() => handleDelete(x.id)} danger></Button></Tooltip>
          ]
        }
      ]
    })
  }
  const columns = Columns.columnAssignments
  function onChange(pagination: any) {
    console.log('params', pagination);
  }

  const handleDelete = (assignmentId: number) => {
    deleteAssignment(assignmentId)
    if (checkReload) setCheckReload(false)
    else setCheckReload(true)
  }

  const handleEdit = (assignmentId: number) =>{
        
  }

  return (
    <MainLayout title="Danh sách bài tập">
      <Table
        columns={columns}
        dataSource={assignments}
        onChange={onChange}
        rowKey={(record) => { return record.id.toString() }}
      />
    </MainLayout>
  );
};

export default Assignments;
