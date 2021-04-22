import React, { useEffect, useState } from "react";
import { Button, Table } from "antd";
import MainLayout from "../../components/layouts/MainLayout";
import { useSession } from "next-auth/client";
import { getUserById } from "../../lib/user/getUser";
// import Columns from "../../components/column/Columns";
import { useRouter } from "next/router";
import { API } from "../../prisma/type/type";

const Classes: React.FC = () => {
  const [session] = useSession()
  const router = useRouter()
  const [classes, setClasses] = useState<API.AcceptedClass[]>([])
  useEffect(() => {
    if (session) {
      getUserById(session.userId).then(res => {
        setClasses(res.acceptedClasses)
      })
    }
  }, [])
  let data = []
  if (classes.length > 0) {
    classes.forEach(x => {
      data = [...data, {
        ...x.classroom,
        action: [
          (<Button key="1" type="link" onClick={() => router.push(`/classrooms/${x.classroom.id}`)} >Xem</Button>),
        ],
      }]
    });
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
  ]
  function onChange(pagination: any) {
    console.log('params', pagination);
  }

  return (
    <MainLayout title="Các lớp đang tham gia">
      <div className="site-layout-background">
        <Table columns={columns} dataSource={data} onChange={onChange} rowKey={(record) => { return record.id.toString() }} />
      </div>
    </MainLayout>
  );
};

export default Classes;
