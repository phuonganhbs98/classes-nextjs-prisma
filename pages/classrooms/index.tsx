import React, { useEffect, useState } from "react";
import { PageHeader, Button, Table } from "antd";
import MainLayout from "../../components/layouts/MainLayout";
import column from '../../components/column/Columns'
import { Class } from "@prisma/client";
import { useSession } from "next-auth/client";
import { getAllClassroom } from "../../lib/classroom/getClassroomInfor";
import { useRouter } from "next/router";
import deleteClass from '../../lib/classroom/deleteClass'
import Link from "next/link";

function onChange(pagination: any) {
  console.log('params', pagination);
}

const columns = column.columnClasses;
type Props={}
const Classes: React.FC<Props> = () => {
  const [session] = useSession()
  const [data, setData] = useState([])
  const [display, setDisplay] = useState({display: 'inline'})
  useEffect(()=> {
    getAllClassroom().then(res => {
      setData(res)
    })
    if(session?.role==='STUDENT') {
      setDisplay({display: 'none'})
    }
    else setDisplay({display: 'inline'})
  },[session])
  
  const router = useRouter()
  let list =[]
  if(session?.role ==='TEACHER'){
    list = data.filter((a:any)=>a.teacherId === session?.userId)
  }else list = data
  let count =0
   list= list.length > 0 ? list.map((a: Class) => ({
    ...a,
    action: [
      (<Button type="link" onClick={() => router.push({
        pathname: `/classrooms/${a.id}`,
      })} >Xem</Button>),
      (<Button style={display} type="primary" onClick={() => deleteClass(a.id)} danger>Xóa</Button>)
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
              style={display}
            >Tạo lớp mới</Button>
          </Link>
        ]}
      ></PageHeader>

      <Table columns={columns} dataSource={list} onChange={onChange} />
    </MainLayout>
  );
};

export default Classes;