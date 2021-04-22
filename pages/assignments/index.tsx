import { Badge, Button, Table, Tooltip } from "antd";
import { useSession } from "next-auth/client";
import React, { useEffect, useState } from "react";
// import Columns from "../../components/column/Columns";
import MainLayout from "../../components/layouts/MainLayout";
import { deleteAssignment, findAll, updateStatus } from "../../lib/assignment/assignment";
import { API } from "../../prisma/type/type";
import { EyeOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { useRouter } from "next/router";
import { formatDate } from "../../lib/formatDate";
import Link from "next/link";
import { Role } from ".prisma/client";
import { getUserById } from "../../lib/user/getUser";

const Assignments: React.FC = () => {
  let [data, setData] = useState<API.AssignmentItem[]>([])
  const [session] = useSession()
  const router = useRouter()
  const [role, setRole] = useState<Role>()
  // const [teacherId, setTeacherId] = useState<number>()
  // const [acceptedClasses, setAcceptedClasses] = useState<API.AcceptedClass[]>([])
  const [checkReload, setCheckReload] = useState<boolean>(false)
  let assignments = []
  let acceptedClasses = []
  useEffect(() => {
    if (session) {
      setRole(session.role)
      data = []
      if (session.role === 'TEACHER') {
        findAll({ teacherId: session.userId })
          .then(res => setData(res))
          .catch(err => console.error(err))
      } else {
        getUserById(session.userId).then(res => {
          if (res.acceptedClasses.length > 0) {
            res.acceptedClasses.forEach((x: API.AcceptedClass) => {
              findAll({ classId: x.classroom.id })
                .then((res: API.AssignmentItem[]) => {
                  setData([...data, ...res])
                })
            })
          }
        })
      }
    }
  }, [checkReload, session])

  console.log(data)
  if (data.length > 0) {
    data.forEach((x: API.AssignmentItem) => {
      updateStatus(x.id)
      // assignments = [
      //   ...assignments,
      //   {
      //     ...x,
      //     // deadlineFormat: formatDate(new Date(x.deadline), true),
      //     // statusRender: <>{x.status === "ASSIGNED" ? <Badge status="success" /> : <Badge status="error" />}{x.status}</>,
      //     // action: [
      //     //   <Tooltip overlay='Xem'><Button type='link' icon={<EyeOutlined />} onClick={() => router.push(`/assignments/${x.id}`)} ></Button></Tooltip>,
      //     //   <Tooltip overlay='Sửa'><Button type='link' icon={<EditOutlined />} onClick={() => handleEdit(x.id)} ></Button></Tooltip>,
      //     //   <Tooltip overlay='Xóa'><Button type='link' icon={<DeleteOutlined />} onClick={() => handleDelete(x.id)} danger></Button></Tooltip>
      //     // ]
      //   }
      // ]
    })
  }
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
    },
    {
      title: 'Lớp',
      dataIndex: 'className',
      render: (text, record) => (
        // <p>aaa {record.class?.name}</p>
        <Link href={`/classrooms/${record?.classId}`}>{record.class?.name}</Link>
      )
    },
    {
      title: 'Thời hạn',
      dataIndex: 'deadlineFormat',
      render: (text, record) => (
        <>
          {formatDate(new Date(record.deadline), true)}
        </>
      )
    },
    {
      title: 'Status',
      dataIndex: 'statusRender',
      render: (text, record) => (
        <>{record.status === "ASSIGNED" ? <Badge status="success" /> : <Badge status="error" />}{record.status}</>
      )
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
      render: (text, record) => (
          <>
            <Tooltip overlay='Xem'><Button type='link' icon={<EyeOutlined />} onClick={() => router.push(`/assignments/${record.id}`)} ></Button></Tooltip>
            <Tooltip overlay='Sửa'><Button type='link' icon={<EditOutlined />} onClick={() => handleEdit(record.id)} ></Button></Tooltip>
            <Tooltip overlay='Xóa'><Button type='link' icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} danger></Button></Tooltip>
          </>
      )
    }
  ]

  function onChange(pagination: any) {
    console.log('params', pagination);
  }

  const handleDelete = (assignmentId: number) => {
    deleteAssignment(assignmentId)
    if (checkReload) setCheckReload(false)
    else setCheckReload(true)
  }

  const handleEdit = (assignmentId: number) => {

  }

  return (
    <MainLayout title="Danh sách bài tập">
      <div className="site-layout-background">
        <Table
          columns={columns}
          dataSource={data}
          onChange={onChange}
          rowKey={(record) => { return record.id.toString() }}
        />
      </div>
    </MainLayout>
  );
};

export default Assignments;
