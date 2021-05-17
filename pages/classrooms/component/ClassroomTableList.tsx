import React, { useEffect, useState } from "react";
import { Button, Col, Input, PageHeader, Popconfirm, Row, Table, Tag, Tooltip } from "antd";
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
const ClassroomTableList: React.FC<Props> = ({ isTeacher }) => {
  const router = useRouter()
  const pathname = router.pathname
  const [data, setData] = useState<API.Classroom[]>([])
  const [total, setTotal] = useState<number>(-1)
  const [searchClass, setSearchClass] = useState<string>()
  const [searchByTeacherName, setSearchByTeacherName] = useState<string>()
  const [search, setSearch] = useState<boolean>(false)
  useEffect(() => {
    getAllClassroom({ name: searchClass, teacherName: searchByTeacherName }).then(res => {
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
  }, [search])

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
              onConfirm={() => deleteClass(record.id)}
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

  return (
    <>
      <div className="site-layout-background">
        <Row align='middle'>
          <Col key='searchByTeacherName' span={8} push={1}>
            <div>Tên lớp: </div>
            <Input
              placeholder="Nhập tên lớp"
              onChange={value => {
                setSearchClass(value.nativeEvent.data)
              }}
              style={{ width: 300 }}
              allowClear
            />
          </Col>
          <Col key='searchByName' span={8} push={1}>
            <div>Tên giáo viên: </div>
            <Input
              placeholder="Nhập tên giáo viên"
              onChange={value => setSearchByTeacherName(value.nativeEvent.data)}
              style={{ width: 300 }}
              allowClear
            />
          </Col>
          <Col push={5}>
            <Button
              icon={<SearchOutlined />}
              type='primary'
              onClick={() => {
                if (search) setSearch(false)
                else setSearch(true)
              }}
            >Tìm kiếm</Button>
          </Col>
        </Row>

      </div>
      <div className="site-layout-background" style={{ marginTop: '20px' }}>
        <PageHeader
          title={''
          }
          extra={[
            isTeacher ? <Link key="1" href="/classrooms/create">
              <Button
                type="primary"
                icon={<PlusOutlined />}
              >Tạo lớp mới</Button>
            </Link> : ''
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