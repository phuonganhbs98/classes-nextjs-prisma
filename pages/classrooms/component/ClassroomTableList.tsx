import React, { useEffect, useState } from "react";
import { Button, Col, Form, Input, message, PageHeader, Popconfirm, Row, Table, Tag, Tooltip } from "antd";
import { getAllClassroom } from "../../../lib/classroom/getClassroomInfor";
import { useRouter } from "next/router";
import deleteClass from '../../../lib/classroom/deleteClass'
import { API } from "../../../prisma/type/type";
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons'
import Link from "next/link";
import { ColumnsType } from "antd/lib/table";
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'

function onChange(pagination: any) {
  console.log('params', pagination);
}
type Props = {
  isTeacher: boolean
}
type Search = {
  name?: string,
  teacherName?: string
}
const ClassroomTableList: React.FC<Props> = ({ isTeacher }) => {
  const router = useRouter()
  const pathname = router.pathname
  const [data, setData] = useState<API.Classroom[]>([])
  const [total, setTotal] = useState<number>(-1)
  const [searchData, setSearchData] = useState<Search>()
  const [reload, setReload] = useState<boolean>(false)
  useEffect(() => {
    getAllClassroom(searchData).then(res => {
      if (isTeacher) {
        const userId = localStorage.getItem('userId')
        const classes = res.filter((x: API.Classroom) => x.teacherId === parseInt(userId))
        setData(classes)
        setTotal(classes.length)
      } else {
        setData(res)
        setTotal(res.length)
      }
    })
  }, [searchData, reload])

  const columns: ColumnsType<API.Classroom> = [
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
      render: (text, record) => (
        <Link href={`/users/${record.teacherId}`}>{record.teacher.name}</Link>
      )
    },
    {
      title: 'SL tối đa',
      dataIndex: 'capacity',
      key: 'key',
      align: 'center',
    },
    {
      title: 'SL hiện tại',
      dataIndex: 'count',
      key: 'count',
      align: 'center',
      render: (text, record) => (
        <div>{record.students.length}</div>
      )
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
      key: 'key',
      align: 'center',
      render: (text, record) => (
        <>
          <Tooltip title='Xem'><Button key={record.id}
            type="link"
            icon={<EyeOutlined />}
            onClick={() => router.push({
              pathname: `${pathname}/${record.id}`,
            })} /></Tooltip>
          {isTeacher ?
            <Popconfirm
              title="Bạn chắc chắn chứ ?"
              onConfirm={async () => {
                deleteClass(record.id)
                .then(res =>{
                  message.success('Xóa thành công')
                  if(reload) setReload(false)
                  else setReload(true)
                })
                .catch(err =>{
                  message.error('Xóa thất bại')
                })
                
              }}
            >
              <Tooltip title='Xóa'><Button
                key={`d${record.id}`}
                type="link"
                icon={<DeleteOutlined />}
                danger
              /></Tooltip>
            </Popconfirm> : ''
          }
        </>
      )
    }
  ];

  const onSearch = (value: Search) => {
    setSearchData(value)
  }

  return (
    <>
      <div className="site-layout-background">
        <Form
          className="ant-advanced-search-form"
          layout='inline'
          labelCol={{ offset: 3, pull: 1, span: 8 }}
          onFinish={onSearch}
          style={{ marginLeft: '150px' }}
        >
          <Form.Item
            label='Tên lớp'
            name='name'
          >
            <Input placeholder="Nhập tên lớp" allowClear />
          </Form.Item>
          <Form.Item
            name='teacherName'
            label='Tên giáo viên'
          >
            <Input placeholder="Nhập tên giáo viên" allowClear />
          </Form.Item>
          <Form.Item wrapperCol={{ span: 8, push: 10 }} style={{ marginLeft: '100px' }}>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SearchOutlined />}
              shape='round' >
              Tìm kiếm
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="site-layout-background" style={{ marginTop: '20px' }}>
        <PageHeader
          title={''
          }
          extra={[
            isTeacher ? 
              <Button
                type="primary"
                shape='round'
                icon={<PlusOutlined />}
                onClick={()=> router.push('/classrooms/create')}
              >Tạo lớp mới</Button>
             : ''
          ]}
        ></PageHeader>
        <Table<API.Classroom>
          columns={columns}
          dataSource={data}
          onChange={onChange}
          size="middle"
          pagination={{
            total: total,
            showTotal: total => `Tổng ${total} lớp`,
            defaultPageSize: 10,
            defaultCurrent: 1
          }}
          rowKey={(record) => { return record.id.toString() }} />
      </div>
    </>
  );
};

export default ClassroomTableList;