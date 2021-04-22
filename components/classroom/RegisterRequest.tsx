import { Button, Divider, Table, Tooltip } from "antd";
import { session } from "next-auth/client";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import getRegisteredStudents from "../../lib/register/getRegisteredStudents";
import { accept } from "../../lib/register/handleRegister";
import Columns from "../column/Columns";
import { DownOutlined, UpOutlined, CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';

type Props = {
    classId: number,
    reload: boolean,
    setReload: any
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
const RegisterRequest: React.FC<Props> = ({ classId, reload, setReload }) => {
    const [data, setData] = useState<ListStudents[]>([])
    // const [reload, setReload] = useState<boolean>(false)
    const router = useRouter()
    let students = []
    useEffect(() => {
        getRegisteredStudents(classId).then((res: ListStudents[]) => {
            setData(res)
        })
    }, [reload])
    if (data.length > 0) {
        data.forEach((x: ListStudents) => {
            students = [
                ...students,
                {
                    ...x.student,
                    action: [
                        <Button
                            key={x.student.id}
                            type="link"
                            onClick={() => router.push({
                                pathname: `/users/${x.student.id}`,
                            })} >Xem</Button>,
                        <Button type="primary" onClick={() => handleAccept(x.student.id)} >Đồng ý</Button>
                    ]
                }
            ]
        })
    }

    const handleAccept = (studentId: number) => {
        accept(studentId, classId)
        if (reload) setReload(false)
        else setReload(true)
    }
    return (
        <Table
            columns={columns}
            dataSource={students}
            onChange={onChange}
            rowKey={(record) => { return record.id.toString() }}
        />
    )
}

export default RegisterRequest;