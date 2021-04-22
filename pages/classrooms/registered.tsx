import React, { useEffect, useState } from "react";
import { Button, PageHeader, Table } from "antd";
import MainLayout from "../../components/layouts/MainLayout";
import { useSession } from "next-auth/client";
import { ClassStatus, User } from ".prisma/client";
import getRegisteredClass from "../../lib/register/getRegisteredClass";
import Columns from "../../components/column/Columns";
import { cancel } from "../../lib/register/handleRegister";
import { useRouter } from "next/router";
import { API } from "../../prisma/type/type";

const Classes: React.FC = () => {
  const [session, loading] = useSession()
  const [studentId, setStudentId] = useState(session ? session.userId : 0)
  const [data, setData] = useState<API.RegisteredClass[]>([])
  const router = useRouter()
  let list = []
  useEffect(() => {
    if (session) {
      setStudentId(session.userId)
      getRegisteredClass(session.userId).then(res => {
        setData(res)
      })

    }
  }, [session])

  const cancelRegister = (classId: number) => {
    cancel(studentId, classId)
    router.reload()
  }
  if (data.length > 0) {
    list = data.map((x: API.RegisteredClass) => ({
      ...x,
      action: (<Button type="ghost" onClick={() => cancelRegister(x.id)} danger>Hủy đăng ký</Button>),
    }))
  }
  function onChange(pagination: any) {
    console.log('params', pagination);
  }

  const column = [
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
  ]
  return (
    <MainLayout title="Các lớp đã đăng ký">
      <div className="site-layout-background">
        <Table columns={column} dataSource={list} onChange={onChange} rowKey={(record) => { return record.id.toString() }} />
      </div>
    </MainLayout>
  );
};

export default Classes;
