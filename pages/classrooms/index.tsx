import React, { useEffect, useState } from "react";
import { PageHeader, Button, Table } from "antd";
import MainLayout from "../../components/layouts/MainLayout";
// import column from '../../components/column/Columns'
import { useSession } from "next-auth/client";
import { getAllClassroom } from "../../lib/classroom/getClassroomInfor";
import { useRouter } from "next/router";
import deleteClass from '../../lib/classroom/deleteClass'
import Link from "next/link";
import { API } from "../../prisma/type/type";

function onChange(pagination: any) {
  console.log('params', pagination);
}

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'key'
  },
  {
    title: 'Tên lớp',
    dataIndex: 'name',
    key: 'key'
  },
  {
    title: 'Giáo viên',
    dataIndex: 'teacherName',
    key: 'key'
  },
  {
    title: 'SL tối đa',
    dataIndex: 'capacity',
    key: 'key'
  },
  {
    title: 'SL hiện tại',
    dataIndex: 'count',
    key: 'count'
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    key: 'key'
  },
  {
    title: 'Hành động',
    dataIndex: 'action',
    key: 'key'
  }
];
type Props = {}
const Classes: React.FC<Props> = () => {
  const [session] = useSession()
  const [data, setData] = useState<API.Classroom[]>([])
  const [editDisplay, setEditDisplay] = useState({ display: 'inline' })
  useEffect(() => {
    getAllClassroom().then(res => {
      setData(res)
    })
    if (session?.role === 'STUDENT') {
      setEditDisplay({ display: 'none' })
    }
    else {
      setEditDisplay({ display: 'inline' })
    }
  }, [session])
  let list = []
  if (session?.role === 'TEACHER') {
    list = data.filter((a: any) => a.teacherId === session?.userId)
  } else {
    list = data
  }
  list = list.length > 0 ? list.map((a: API.Classroom) => ({
    ...a,
    teacherName: a.teacher.name,
    count: a.students.length,
    action: [
      (<Button key={a.id} type="link" onClick={() => router.push({
        pathname: `/classrooms/${a.id}`,
      })} >Xem</Button>),
      (<Button style={editDisplay} key={`d${a.id}`} type="ghost" onClick={() => deleteClass(a.id)} danger>Xóa</Button>),
    ],
  })) : []

  const router = useRouter()
  return (
    <MainLayout title="Danh sách lớp học">
      <div className="site-layout-background">
        <PageHeader
          title=""
          extra={[
            <Link key="1" href="/classrooms/create">
              <Button
                type="primary"
                style={editDisplay}
              >Tạo lớp mới</Button>
            </Link>
          ]}
        ></PageHeader>
        <Table columns={columns} dataSource={list} onChange={onChange} rowKey={(record) => { return record.id.toString() }} />
      </div>
    </MainLayout>
  );
};

export default Classes;