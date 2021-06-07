import React, { useEffect, useState } from "react";
import { Button, PageHeader, Row, Col, Table, Tabs, Popconfirm, Tooltip, Tag, Modal, Form, Input, DatePicker, Select, message } from "antd";
import MainLayout from "../../components/layouts/MainLayout";
import { signOut } from "next-auth/client";
import Avatar from "antd/lib/avatar/avatar";
import { formatDate } from '../../lib/formatDate'
import deleteClass from '../../lib/classroom/deleteClass'
import { useRouter } from "next/router";
import { Gender, Role } from ".prisma/client";
import { API } from "../../prisma/type/type";
import { getUserById, updateUser } from "../../lib/user/user";
import { DeleteOutlined, EditOutlined, EyeOutlined, LogoutOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/lib/table";
import moment from "moment";
import { Option } from "antd/lib/mentions";
import Text from "antd/lib/typography/Text";

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
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  const [reload, setReload] = useState<boolean>(false)
  const [pathname, setPathname] = useState<string>()

  const gender = user?.gender === 'FEMALE' ? "Nữ" : user?.gender === 'MALE' ? "Nam" : "Không có thông tin"
  const birthDate = user?.birthDate ? formatDate(new Date(user?.birthDate), false) : "Không có thông tin"
  const phoneNumber = user?.phoneNumber ? user?.phoneNumber : "Không có thông tin"
  const classListTitle = (user?.role === 'STUDENT' ? 'Các lớp đang tham gia' : 'Các lớp đã tạo').toUpperCase()

  const router = useRouter()
  useEffect(() => {
    const userId = parseInt(localStorage.getItem('userId'))
    const role = localStorage.getItem('role')
    if (role === 'STUDENT') setPathname('/students/classrooms')
    else setPathname('/teachers/classrooms')
    if (id === userId) setShow(true)
    else setShow(false)
    getUserById(id).then(res => {
      setUser(res)
      setRole(res.role)
    })
  }, [reload])

  useEffect(() => {
    if (typeof role !== 'undefined' && typeof user !== 'undefined') {
      if (role === 'STUDENT') {
        setClasses(user.acceptedClasses)
      }
      else {
        setClasses(user.createdClasses)
      }
    }
  }, [role])
  // let pathname = role==='STUDENT'?'/students/classrooms':'/teachers/classrooms'

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
              <Button key="1" type="link" icon={<EyeOutlined />} onClick={() => router.push(`${pathname}/${x.classroom.id}`)} />
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
              <Button key="1" type="link" icon={<EyeOutlined />} onClick={() => router.push(`${pathname}/${x.id}`)} /></Tooltip>),
            // (<Popconfirm
            //   title="Bạn chắc chắn chứ ?"
            //   onConfirm={() => deleteClass(x.id)}
            // >
            //   <Tooltip title='Xóa'><Button key="2" type="link" icon={<DeleteOutlined />} danger /></Tooltip>
            // </Popconfirm>)
            ],
        }]
      });
    }
  }

  const handleUpdate = async (value: API.UserInfor) => {
    await updateUser(id, value)
      .then(res => {
        if (reload) setReload(false)
        else setReload(true)
        setIsModalVisible(false)
      })
  }
  return (
    <MainLayout title="Thông tin cá nhân">
      <div className="site-layout-background">
        <PageHeader
          title=""
          extra={show ? [
            <Button key='2' type="primary" shape='round' icon={<EditOutlined />} onClick={() => { setIsModalVisible(true) }}>Sửa</Button>,
            <Popconfirm
              title="Bạn chắc chắn chứ ?"
              onConfirm={() => signOut({ callbackUrl: '/login' })}
            >
              <Button key='3' type="primary" shape='round' icon={<LogoutOutlined />} danger>Đăng xuât</Button>
            </Popconfirm>,
          ] : null}
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
                <strong>Vai trò:</strong> <p>{user?.role === 'STUDENT' ?
                  <Tag color="geekblue">Học sinh / Sinh viên</Tag> :
                  <Tag color="cyan">Giáo viên</Tag>
                }</p>
                <strong>Giới tính:</strong> <p>{gender}</p>
              </Col>
              <Col key="4" span={12}>
                <strong>Ngày sinh:</strong> <p>{birthDate}</p>
                <strong>Ngày tham gia:</strong> <p>{user?.createdAt ? formatDate(new Date(user?.createdAt)) : null}</p>
              </Col>
            </Row>
            <Row key="r3">
              <Col key="5" span={12} >
                <strong>Email: </strong> <br /><Text copyable>{user?.email}</Text>
              </Col>
              <Col key="6" span={12}>
                <strong>Số điện thoại: </strong> <p>{phoneNumber}</p>
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
      <Modal
        title="Chỉnh sửa thông tin cá nhân"
        visible={isModalVisible}
        footer={null}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form<API.UserInfor>
          name="basic"
          layout="vertical"
          initialValues={{ remember: false }}
          onFinish={(value: API.UserInfor) => handleUpdate(value)}
        >
          <Form.Item
            label="Họ tên"
            name="name"
            key="name"
            initialValue={user?.name}
            rules={[{ required: true, message: 'Xin vui lòng điền họ tên!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Giới tính"
            name="gender"
            key="gender"
            initialValue={user?.gender ? user?.gender : null}
          >
            <Select
              placeholder='Chọn giới tính'
              allowClear
            >
              <Option key={Gender.FEMALE} value={Gender.FEMALE} >Nữ</Option>
              <Option key={Gender.MALE} value={Gender.MALE} >Nam</Option>
              <Option key={Gender.OTHER} value={Gender.OTHER} >Khác</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Ngày sinh"
            name="birthDate"
            key="birthDate"
            initialValue={user?.birthDate ? moment(user?.birthDate) : null}
          >
            <DatePicker allowClear={true} />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="phoneNumber"
            key="phoneNumber"
            initialValue={user?.phoneNumber}
          >
            <Input />
          </Form.Item>
          <Form.Item >
            <Button type="primary" htmlType="submit" style={{ margin: '0 0 30px' }}>
              OK
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </MainLayout>
  );
};

export default Profile;