import React, { useEffect, useState } from "react";
import { Button, PageHeader, Popconfirm, Table, Tag, Tooltip } from "antd";
import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { API } from "../../../prisma/type/type";
import getRegisteredClass from "../../../lib/register/getRegisteredClass";
import { cancel } from "../../../lib/register/handleRegister";
import MainLayout from "../../../components/layouts/MainLayout";
import { ColumnsType } from "antd/lib/table";
import { MinusOutlined } from "@ant-design/icons";

const Classes: React.FC = () => {
  const [studentId, setStudentId] = useState<number>()
  const [data, setData] = useState<API.Classroom[]>([])
  const router = useRouter()
  let list = []
  useEffect(() => {
    const userId = parseInt(localStorage.getItem('userId'))
    setStudentId(userId)
    getRegisteredClass(userId).then(res => {
      setData(res)
    })
  }, [])

  const cancelRegister = async (classId: number) => {
    if (typeof studentId !== 'undefined') {
      await cancel(studentId, classId).then(res => {
        router.reload()
      })
    }
  }
  if (data.length > 0) {
    list = data.map((x: API.Classroom) => ({
      ...x,
      action: (<Popconfirm
        title="Bạn chắc chắn chứ ?"
        onConfirm={() => cancelRegister(x.id)}
      >
        <Tooltip title='Hủy đăng ký'><Button type="primary" size="small" shape="circle" icon={<MinusOutlined />} danger /></Tooltip>
      </Popconfirm>),
    }))
  }
  function onChange(pagination: any) {
    console.log('params', pagination);
  }

  const column: ColumnsType<API.Classroom> = [
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
      render: (text, record) => {
        return (
          <a onClick={() => router.push(`/users/${record.teacherId}`)}>{text}</a>
        )
      }
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
      align: 'center',
      filters: [
        {
          text: 'Sắp bắt đầu',
          value: 'PREPARE'
        },
        {
          text: 'Đang mở',
          value: 'STUDYING'
        },
        {
          text: 'Đã kết thúc',
          value: 'FINISHED'
        },
      ],
      onFilter: (value, record) => record.status === value,
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
