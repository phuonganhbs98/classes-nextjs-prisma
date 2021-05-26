import React, { useEffect, useState } from "react";
import { Button, PageHeader, Row, Col, Table, Tabs, Popconfirm, Tooltip, Tag } from "antd";
import MainLayout from "../../components/layouts/MainLayout";
import { signOut } from "next-auth/client";
import Avatar from "antd/lib/avatar/avatar";
import { formatDate } from '../../lib/formatDate'
import deleteClass from '../../lib/classroom/deleteClass'
import { useRouter } from "next/router";
import { Role } from ".prisma/client";
import { API } from "../../prisma/type/type";
import { getUserById } from "../../lib/user/user";
import { DeleteOutlined, EditOutlined, EyeOutlined, LogoutOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/lib/table";

export async function getServerSideProps({ params }) {
  let id = parseInt(params.id)
  return {
    props: {
      id
    }
  }
}
function onChange(pagination: any) {
  console.log('params', pagination);
}
const Profile: React.FC<{ id: number }> = (props) => {
  const id = props.id
  const [role, setRole] = useState<Role>()
  const [user, setUser] = useState<API.UserInfor>()
  const [classes, setClasses] = useState<API.AcceptedClass[] | API.Classroom[]>([])
  const [show, setShow] = useState(false)
  const gender = user?.gender === 'FEMALE' ? "Nữ" : user?.gender === 'MALE' ? "Nam" : "Không có thông tin"
  const birthDate = user?.birthDate ? formatDate(new Date(user?.birthDate), true) : "Không có thông tin"
  const phoneNumber = user?.phoneNumber ? user?.phoneNumber : "Không có thông tin"
  const classListTitle = (user?.role === 'STUDENT' ? 'Các lớp đang tham gia' : 'Các lớp đã tạo').toUpperCase()

  const router = useRouter()
  useEffect(() => {
    getUserById(id).then(res => {
      setUser(res)
      setRole(res.role)
      if (res.role === 'STUDENT') {
        setClasses(res.acceptedClasses)
        setShow(false)
      }
      else {
        setClasses(res.createdClasses)
        setShow(true)
      }
    })
  }, [])

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
      key: 'key'
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
    }
  ]
  const editButton = show ? { display: 'inline' } : { display: 'none' }
  let data = []
  if (classes.length > 0) {
    if (role === Role.STUDENT) {
      classes.forEach((x: any) => {
        data = [...data, {
          ...x.classroom,
          teacherName: x.classroom.teacher.name,
          count: x.classroom.students.length,
          action: [
            (<Tooltip title='Xem'>
              <Button key="1" type="link" icon={<EyeOutlined />} onClick={() => router.push(`/students/classrooms/${x.classroom.id}`)} />
            </Tooltip>),]
        }]
      });
    } else {
      classes.forEach((x: any) => {
        data = [...data, {
          ...x,
          teacherName: x.teacher.name,
          count: x.students.length,
          action: [
            (<Tooltip title='Xem'>
              <Button key="1" type="link" icon={<EyeOutlined />} onClick={() => router.push(`/teachers/classrooms/${x.id}`)} /></Tooltip>),
            (<Popconfirm
              title="Bạn chắc chắn chứ ?"
              onConfirm={() => deleteClass(x.id)}
            >
              <Tooltip title='Xóa'><Button key="2" type="link" icon={<DeleteOutlined />} danger /></Tooltip>
            </Popconfirm>)],
        }]
      });
    }

  }
  return (
    <MainLayout title="Thông tin cá nhân">
      <div className="site-layout-background">
        <PageHeader
          title=""
          extra={[
            <Button key='2' type="primary" shape='round' icon={<EditOutlined />} onClick={() => { }}>Sửa</Button>,
            <Popconfirm
              title="Bạn chắc chắn chứ ?"
              onConfirm={() => signOut({ callbackUrl: '/login' })}
            >
              <Button key='3' type="primary" shape='round' icon={<LogoutOutlined />} danger>Đăng xuât</Button>
            </Popconfirm>,
          ]}
        />
        <Row key="r1" align="middle">
          <Col key="1" span={6} push={1}>
            <Avatar
              size={200}
              shape="circle"
              src={user?.image}
              alt="avatar"
            />
          </Col>
          <Col key="2" span={16} push={1}>
            <p style={{
              fontSize: '30px',
              fontWeight: 'bolder'
            }}>{user?.name}</p>
            <Row key="r2">
              <Col key="3" span={12}>
                <strong>Vai trò:</strong> <h1>{user?.role}</h1>
                <strong>Giới tính:</strong> <h1>{gender}</h1>
              </Col>
              <Col key="4" span={12}>
                <strong>Ngày sinh:</strong> <h1>{birthDate}</h1>
                <strong>Ngày tham gia:</strong> <h1>{user?.createdAt ? formatDate(new Date(user?.createdAt)) : null}</h1>
              </Col>
            </Row>
            <Row key="r3">
              <Col key="5" span={12} >
                <strong>Email: </strong> <h1>{user?.email}</h1>
              </Col>
              <Col key="6" span={12}>
                <strong>Số điện thoại: </strong> <h1>{phoneNumber}</h1>
              </Col>
            </Row>
          </Col>

        </Row>
      </div>
      <div className="site-layout-background content">
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab={classListTitle} key="1">
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
              rowKey={(record) => { return record.id?.toString() }} />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Profile;