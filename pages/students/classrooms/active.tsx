import React, { useEffect, useState } from "react";
import { Button, Table, Tag, Tooltip } from "antd";
import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { API } from "../../../prisma/type/type";
import { getUserById } from "../../../lib/user/user";
import MainLayout from "../../../components/layouts/MainLayout";
import { ColumnsType } from "antd/lib/table";
import { EyeOutlined } from "@ant-design/icons";

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
        teacherName: x.classroom.teacher.name,
      }]
    });
  }
  const columns: ColumnsType<API.Classroom> = [
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
      render: (text, record) => {
        return (
          <div>{record.students.length}</div>
        )
      }
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
      render: (text, record) => {
        return (
          <Tooltip title='Xem'><Button key={record.id}
            type="link"
            icon={<EyeOutlined />}
            onClick={() => router.push({
              pathname: `/students/classrooms/${record.id}`,
            })} /></Tooltip>
        )
      }
    }
  ]
  function onChange(pagination: any) {
    console.log('params', pagination);
  }

  return (
    <MainLayout title="Các lớp đang tham gia">
      <div className="site-layout-background">
        <Table
          columns={columns}
          dataSource={data}
          onChange={onChange}
          size="middle"
          pagination={{
            total: data.length,
            showTotal: total => `Tổng ${total} lớp`,
            defaultPageSize: 10,
            defaultCurrent: 1
          }}
          rowKey={(record) => { return record.id.toString() }} />
      </div>
    </MainLayout>
  );
};

export default Classes;
