import { Button, Divider, Table, Tooltip } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import getRegisteredStudents from "../../lib/register/getRegisteredStudents";
import { accept } from "../../lib/register/handleRegister";

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

const RegisterRequest: React.FC<Props> = ({ classId, reload, setReload }) => {
    const [data, setData] = useState<ListStudents[]>([])
    const [total, setTotal] = useState<number>(0)
    const router = useRouter()
    let students = []
    useEffect(() => {
        getRegisteredStudents(classId).then((res: ListStudents[]) => {
            setTotal(res.length)
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

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: 'Tên sinh viên',
            dataIndex: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phoneNumber',
        },
        {
            title: 'Hành động',
            dataIndex: 'action',
            //   align: 'center'
        }
    ]

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
            pagination={{
                total: total,
                showTotal: total => `Tổng ${total} học sinh`,
                defaultPageSize: 10,
                defaultCurrent: 1
            }}
            rowKey={(record) => { return record.id.toString() }}
        />
    )
}

export default RegisterRequest;