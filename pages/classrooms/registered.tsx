import React, { useEffect, useState } from "react";
import { Button, PageHeader, Table } from "antd";
import MainLayout from "../../components/layouts/MainLayout";
import { useSession } from "next-auth/client";
import { ClassStatus, User } from ".prisma/client";
import getRegisteredClass from "../../lib/register/getRegisteredClass";
import Columns from "../../components/column/Columns";
import { cancel } from "../../lib/register/handleRegister";
import { useRouter } from "next/router";

type RegisteredClass = {
  id: number,
  name: string,
  count: number,
  teacherName: string,
  status: ClassStatus,
  capacity: number
}

const Classes: React.FC = () => {
  const [session, loading] = useSession()
  const [studentId, setStudentId] = useState(session ? session.userId : 0)
  const [data, setData] = useState<RegisteredClass[]>([])
  const router = useRouter()
  let list = []
  useEffect(() => {
    if (session) {
      setStudentId(session.userId)
      getRegisteredClass(session.userId).then(res => {
        setData(res)
      })

    }
  }, [session])

  const cancelRegister = (classId:number) =>{
    cancel(studentId, classId)
    router.reload()
}
  if (data.length > 0) {
    list = data.map((x: RegisteredClass) => ({
      ...x,
      action: (<Button type="ghost" onClick={()=> cancelRegister(x.id)} danger>Hủy đăng ký</Button>),
    }))
  }
  function onChange(pagination: any) {
    console.log('params', pagination);
  }

  const column = Columns.columnClasses
  return (
    <MainLayout title="Các lớp đã đăng ký">
      <Table columns={column} dataSource={list} onChange={onChange} rowKey={(record)=> {return record.id.toString()}}/>
    </MainLayout>
  );
};

export default Classes;
