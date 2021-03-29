import React, { useState } from "react";
import { Button, PageHeader, Row, Col } from "antd";
import MainLayout from "../../components/layouts/MainLayout";
import { signOut } from "next-auth/client";
import { PrismaClient } from "@prisma/client";
import Avatar from "antd/lib/avatar/avatar";

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

  // console.log(id)
  console.log(result)
  return {
    props: {
      result
    }
  }
}

export default function Profile({ result }) {
  const gender = result.gender === 'FEMALE' ? "Nữ" : result.gender === 'MALE' ? "Nam" : "Không có thông tin"
  const birthDate = result.dateBirth ? new Date(result.dateBirth).toUTCString() : "Không có thông tin"
  const phoneNumber = result.phoneNumber?result.phoneNumber:"Không có thông tin"
  const classListTitle = (result.role==='STUDENT'?'Các lớp đang tham gia': 'Các lớp đã tạo').toUpperCase()
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
      <Row align="middle">
        <Col span={6} push={1}>
          <Avatar
            size={200}
            shape="circle"
            src={result?.image}
            alt="avatar"
          />
        </Col>
        <Col span={16} push={1}>
          <p style={{
            fontSize: '30px',
            fontWeight: 'bolder'
          }}>{result.name}</p>
          <Row>
            <Col span={12}>
              <strong>Vai trò:</strong> <h1>{result.role}</h1>
              <strong>Giới tính:</strong> <h1>{gender}</h1>
            </Col>
            <Col span={12}>
              <strong>Ngày sinh:</strong> <h1>{birthDate}</h1>
              <strong>Ngày tham gia:</strong> <h1>{new Date(result.createdAtJson).toUTCString()}</h1>
            </Col>
          </Row>
          <Row>
            <Col span={12} >
              <strong>Email: </strong> <h1>{result.email}</h1>
            </Col>
            <Col span={12}>
              <strong>Số điện thoại: </strong> <h1>{phoneNumber}</h1>
            </Col>
          </Row>
        </Col>

      </Row>
      <br/>
      <br/>
      <p style={{
            fontSize: '20px',
            fontWeight: 'bolder'
          }}>{classListTitle}</p>

    </MainLayout>
  );
};
