import React from "react";
import { PageHeader, Button, Table } from "antd";
import MainLayout from "../../components/layouts/MainLayout";
import column from '../../components/column/Columns'
import { Class, PrismaClient, User } from "@prisma/client";
import { useSession } from "next-auth/client";
import { getAllClassroom } from "../../lib/classroom/getClassroomInfor";
import { useRouter } from "next/router";
import deleteClass from '../../lib/classroom/deleteClass'
import Link from "next/link";

export async function getStaticProps() {
  const {
    data,
    teachers
  } = await getAllClassroom()

  return {
    props: { data, teachers },
  }
}

function onChange(pagination: any) {
  console.log('params', pagination);
}

const columns = column.columnClasses;

function Classes({ data, teachers }) {
  const [session] = useSession()
  const router = useRouter()
  let list = data ? data : null
  let classes = []
  if (session) {
    if (session.role === 'TEACHER' && list.length > 0) {
      list = data.filter((a: Class) => (a.teacherId === session.userId))

    }
    if (list.length > 0) {
      list.forEach((x: Class) => {
        teachers?.forEach((y: User) => {
          if (y.id === x.teacherId) {
            classes = [...classes, { ...x, teacherName: y.name }]
          }
        })
      })
    }
  }
  let count = 0
  list = classes.length > 0 ? classes.map((a: Class) => ({
    ...a,
    action: [
      (<Button type="link" onClick={() => router.push(`/classrooms/${a.id}`)} >Xem</Button>),
      (<Button type="primary" onClick={() => deleteClass(a.id)} danger>Xóa</Button>)
    ],
    key: ++count
  })) : []

  return (
    <MainLayout title="Danh sách lớp học">
      <PageHeader
        title=""
        extra={[
          <Link key="1" href="/classrooms/create">
            <Button
              type="primary"
            >Tạo lớp mới</Button>
          </Link>
        ]}
      ></PageHeader>

      <Table columns={columns} dataSource={list} onChange={onChange} />
    </MainLayout>
  );
};

export default Classes;
