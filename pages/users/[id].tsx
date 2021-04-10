import React, { useEffect, useState } from "react";
import { Button, PageHeader, Row, Col, Table, Divider } from "antd";
import MainLayout from "../../components/layouts/MainLayout";
import { signOut } from "next-auth/client";
import Avatar from "antd/lib/avatar/avatar";
import { formatDate } from '../../lib/formatDate'
import column from '../../components/column/Columns'
import deleteClass from '../../lib/classroom/deleteClass'
import { useRouter } from "next/router";
import { Class, Gender, Role } from ".prisma/client";
import { getUserById } from "../../lib/user/getUser";

type UserInfor = {
  id: number,
  role: Role,
  gender: Gender,
  birthDate: Date,
  phoneNumber: string,
  acceptedClasses: Class,
  createdClasses: Class,
  createdAt: Date,
  email: string,
  image: string,
  name: string
}
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
  const [user, setUser] = useState<UserInfor>()
  const [classes, setClasses] = useState<Class[]>([])
  const [show, setShow] = useState(false)
  const gender = user?.gender === 'FEMALE' ? "Nữ" : user?.gender === 'MALE' ? "Nam" : "Không có thông tin"
  const birthDate = user?.birthDate ? formatDate(new Date(user?.birthDate)) : "Không có thông tin"
  const phoneNumber = user?.phoneNumber ? user?.phoneNumber : "Không có thông tin"
  const classListTitle = (user?.role === 'STUDENT' ? 'Các lớp đang tham gia' : 'Các lớp đã tạo').toUpperCase()
  const columns = column.columnClasses
  const router = useRouter()
  useEffect(()=>{
    getUserById(id).then(res => {
      setUser(res)
      if(res.role === 'STUDENT') {
        setClasses(res.acceptedClasses)
        setShow(false)
      }
      else {
        setClasses(res.createdClasses)
        setShow(true)
      }
    })
  },[])
  const editButton = show?{display: 'inline'}:{display: 'none'}
  let data = []
  if (classes.length > 0) {
    classes.forEach(x => {
      data = [...data, {
        ...x,
        action: [
          (<Button key="1" type="link" onClick={() => router.push(`/classrooms/${x.id}`)} >Xem</Button>),
          (<Button key="2" type="ghost" style={editButton} onClick={() => deleteClass(x.id)} danger>Xóa</Button>)],
      }]
    });
  }
  return (
    <MainLayout title="Thông tin cá nhân">
      <PageHeader
        title=""
        extra={[
          <Button key="3">Sửa</Button>,
          <Button key="1" type="primary" danger onClick={() => signOut()}>
            Đăng xuât
          </Button>,
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
              <strong>Ngày tham gia:</strong> <h1>{formatDate(new Date(user?.createdAt))}</h1>
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
      <br />
      <br />
      <Divider orientation="left" dashed={true} style={{ fontSize: '20px', fontWeight: 'bolder' }}>{classListTitle}</Divider>
      <Table columns={columns} dataSource={data} onChange={onChange} />
    </MainLayout>
  );
};

export default Profile;