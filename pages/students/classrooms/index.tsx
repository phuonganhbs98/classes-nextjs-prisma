import React, { useEffect, useState } from "react";
import { PageHeader, Button, Table, message, Tag } from "antd";
import MainLayout from "../../../components/layouts/MainLayout";
import { getAllClassroom } from "../../../lib/classroom/getClassroomInfor";
import { useRouter } from "next/router";
import { API } from "../../../prisma/type/type";



type Props = {}
const Classes: React.FC<Props> = () => {
  const [data, setData] = useState<API.Classroom[]>([])
  const [searchStatus, setSearchStatus] = useState<string>('all')
  const router = useRouter()
  const pathname = router.pathname
  useEffect(() => {
    console.log('router')
    console.log(router)
    getAllClassroom().then(res => {
      setData(res)
    })
  }, [])

  function onChange(pagination: any, filters) {
    console.log('params', pagination);
    console.log('filters', filters);
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
      render: (text, record) => (
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
      render: (text, record) => (
        <div>{record.students.length}</div>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      filters: [
        { text: 'Sắp bắt đầu', value: 'PREPARE' },
        { text: 'Đã kết thúc', value: 'FINISHED' },
        { text: 'Đang mở', value: 'STUDYING' }
      ],
      onFilter: (value, record)=>record.status === value,
      render: (text: string, record: API.Classroom) => {
        return(
        new Date() < new Date(record.startAt) ?
          <Tag color="purple">Sắp bắt đầu</Tag> :
          new Date() > new Date(record.endAt) ?
            <Tag color="red">Đã kết thúc</Tag> :
            <Tag color="green"> Đang mở</Tag>
      )}
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
      render: (text: string, record: API.Classroom) => (
        <Button key={record.id} type="link" onClick={() => router.push({
          pathname: `${pathname}/${record.id}`,
        })} >Xem</Button>
      )
    }
  ];
  return (
    <MainLayout title="Danh sách lớp học">
      <div className="site-layout-background">
        <PageHeader
          title=""
          extra={[
          ]}
        ></PageHeader>
        <Table columns={columns} dataSource={data} onChange={onChange} rowKey={(record) => { return record.id.toString() }} />
      </div>
    </MainLayout>
  );
};

export default Classes;