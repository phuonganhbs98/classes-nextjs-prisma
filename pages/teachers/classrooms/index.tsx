import React, { useEffect, useState } from "react";
import { PageHeader, Button, Table, message, Tag } from "antd";
import MainLayout from "../../../components/layouts/MainLayout";
import { getAllClassroom } from "../../../lib/classroom/getClassroomInfor";
import { useRouter } from "next/router";
import deleteClass from '../../../lib/classroom/deleteClass'
import Link from "next/link";
import { API } from "../../../prisma/type/type";

function onChange(pagination: any) {
  console.log('params', pagination);
}
type Props = {}
const Classes: React.FC<Props> = () => {
  const router = useRouter()
  const pathname = router.pathname
  const [data, setData] = useState<API.Classroom[]>([])
  useEffect(() => {
    console.log(localStorage)
    getAllClassroom().then(res => {
      if (res.length > 0) {
        const userId = localStorage.getItem('userId')
        setData(res.filter((x: API.Classroom) => x.teacherId === parseInt(userId)))
      }
    })
  }, [])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'key'
    },
    {
      title: 'Tên lớp',
      dataIndex: 'name',
      key: 'key',
    },
    {
      title: 'Giáo viên',
      dataIndex: 'teacherName',
      key: 'key',
      render: (text, record) =>(
        <div>{record.teacher.name}</div>
      )
    },
    {
      title: 'SL tối đa',
      dataIndex: 'capacity',
      key: 'key'
    },
    {
      title: 'SL hiện tại',
      dataIndex: 'count',
      key: 'count',
      render: (text, record) =>(
        <div>{record.students.length}</div>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (text: string, record: API.Classroom) => (
        new Date() < new Date(record.startAt) ?
          <Tag color="purple">Sắp bắt đầu</Tag> :
          new Date() > new Date(record.endAt) ?
            <Tag color="red">Đã kết thúc</Tag> :
            <Tag color="green">Đang mở</Tag>
      )
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
      key: 'key',
      render: (text, record) =>(
        <>
        <Button key={record.id} 
        type="link" 
        onClick={() => router.push({pathname: `${pathname}/${record.id}`,
      })} >Xem</Button>
      <Button key={`d${record.id}`} type="ghost" onClick={() => deleteClass(record.id)} danger>Xóa</Button>
        </>
      )
    }
  ];

  return (
    <MainLayout title="Danh sách lớp học">
      <div className="site-layout-background">
        <PageHeader
          title=""
          extra={[
            <Link key="1" href="/classrooms/create">
              <Button
                type="primary"
              >Tạo lớp mới</Button>
            </Link>
          ]}
        ></PageHeader>
        <Table columns={columns} dataSource={data} onChange={onChange} rowKey={(record) => { return record.id.toString() }} />
      </div>
    </MainLayout>
  );
};

export default Classes;