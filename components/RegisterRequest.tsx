import { Register, User } from ".prisma/client";
import { Button, Divider, Table } from "antd";
import { session } from "next-auth/client";
import { Router, useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import getRegisteredStudents from "../lib/register/getRegisteredStudents";
import { accept } from "../lib/register/handleRegister";
import Columns from "./column/Columns";

type Props = {
    classId: number,
    display: string
}
type StudentInfor = {
    id: number,
    name: string,
    email: string,
    phoneNumber: string
}
type ListStudents = {
    student: StudentInfor
}
function onChange(pagination: any) {
    console.log('params', pagination);
}
const columns = Columns.columnStudents
const RegisterRequest: React.FC<Props> = ({ classId, display }) => {
    const [data, setData] = useState<ListStudents[]>([])
    const router = useRouter()
    let students = []
    useEffect(() => {
        getRegisteredStudents(classId).then((res: ListStudents[]) => {
            setData(res)
        })
    }, [session])
    if (data.length > 0) {
        data.forEach((x: ListStudents) => {
            students = [
                ...students,
                {
                    ...x.student,
                    action: <Button type="primary" onClick={()=> handleAccept(x.student.id)} >Đồng ý</Button>
                }
            ]
        })
    }

    const handleAccept=(studentId: number)=>{
        accept(studentId, classId)
        router.reload()
    }
    return (
        <div style={{ display: display }}>
            <Divider orientation="left" dashed={true} style={{ fontSize: '20px', fontWeight: 'bolder' }}>Yêu cầu vào lớp</Divider>
            <Table columns={columns} dataSource={students} onChange={onChange} rowKey={(record) => { return record.id.toString() }} />
        </div>
    )
}

export default RegisterRequest;