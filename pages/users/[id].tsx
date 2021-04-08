import React from "react";
import { Button, PageHeader, Row, Col, Table, Divider } from "antd";
import MainLayout from "../../components/layouts/MainLayout";
import { signOut } from "next-auth/client";
import { PrismaClient } from "@prisma/client";
import Avatar from "antd/lib/avatar/avatar";
import { formatDate } from '../../lib/formatDate'
import { getAllClassroom } from '../../lib/classroom/getClassroomInfor'
import column from '../../components/column/Columns'
import deleteClass from '../../lib/classroom/deleteClass'
import { useRouter } from "next/router";

export async function getServerSideProps({ params }) {
  let id = parseInt(params.id)
  const prisma = new PrismaClient()
  const user = await prisma.user.findUnique({
    where: {
      id: id
    }
  })
  const result = {
    ...user,
    createdAtJson: user.createdAt.toJSON()
  }
  delete result.createdAt
  delete result.updatedAt

  let classes = []

  // lay danh sach lop da tao
  if (user.role === 'TEACHER') {
    const { data } = await getAllClassroom()
    let count = 0
    data.forEach(x => {
      if (x.teacherId === id) {
        classes = [...classes, {
          ...x,
          teacherName: user.name,
          key: ++count
        }]
      }
    });
  } else {
// neu la sv/hs thi phai hien thi cac lop da dang ky
  }

  return {
    props: {
      result,
      classes
    }
  }
}

function onChange(pagination: any) {
  console.log('params', pagination);
}

export default function Profile({ result, classes }) {
  const gender = result.gender === 'FEMALE' ? "Nữ" : result.gender === 'MALE' ? "Nam" : "Không có thông tin"
  const birthDate = result.dateBirth ? new Date(result.dateBirth).toDateString() : "Không có thông tin"
  const phoneNumber = result.phoneNumber ? result.phoneNumber : "Không có thông tin"
  const classListTitle = (result.role === 'STUDENT' ? 'Các lớp đang tham gia' : 'Các lớp đã tạo').toUpperCase()
  const columns = column.columnClasses
  const router = useRouter()
  let data = []
  if (classes.length > 0) {
    classes.forEach(x => {
      data = [...data, {
        ...x,
        action: [
          (<Button key="1" type="link" onClick={() => router.push(`/classrooms/${x.id}`)} >Xem</Button>),
          (<Button key ="2" type="primary" onClick={() => deleteClass(x.id)} danger>Xóa</Button>)],
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
            src={result?.image}
            alt="avatar"
          />
        </Col>
        <Col key="2" span={16} push={1}>
          <p style={{
            fontSize: '30px',
            fontWeight: 'bolder'
          }}>{result.name}</p>
          <Row key="r2">
            <Col key="3" span={12}>
              <strong>Vai trò:</strong> <h1>{result.role}</h1>
              <strong>Giới tính:</strong> <h1>{gender}</h1>
            </Col>
            <Col key="4" span={12}>
              <strong>Ngày sinh:</strong> <h1>{birthDate}</h1>
              <strong>Ngày tham gia:</strong> <h1>{formatDate(new Date(result.createdAtJson))}</h1>
            </Col>
          </Row>
          <Row key="r3">
            <Col key="5" span={12} >
              <strong>Email: </strong> <h1>{result.email}</h1>
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
