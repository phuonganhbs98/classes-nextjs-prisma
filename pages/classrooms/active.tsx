import React, { useEffect, useState } from "react";
import { Button, PageHeader, Table } from "antd";
import MainLayout from "../../components/layouts/MainLayout";
import { useSession } from "next-auth/client";
import { Class } from ".prisma/client";
import { getUserById } from "../../lib/user/getUser";
import Columns from "../../components/column/Columns";
import { useRouter } from "next/router";

const Classes: React.FC = () => {
  const [session] = useSession()
  const router = useRouter()
  const [classes, setClasses] = useState<Class[]>([])
  useEffect(()=>{
    if(session){
      getUserById(session.userId).then(res => {
        setClasses(res.acceptedClasses)
    })
    }
  },[])
  let data=[]
  if (classes.length > 0) {
    classes.forEach(x => {
      data = [...data, {
        ...x,
        action: [
          (<Button key="1" type="link" onClick={() => router.push(`/classrooms/${x.id}`)} >Xem</Button>),
          ],
      }]
    });
  }
  const columns= Columns.columnClasses
  function onChange(pagination: any) {
    console.log('params', pagination);
  }
  return (
    <MainLayout title="Các lớp đang tham gia">
      <Table columns={columns} dataSource={data} onChange={onChange} rowKey={(record)=> {return record.id.toString()}}/>
    </MainLayout>
  );
};

export default Classes;
