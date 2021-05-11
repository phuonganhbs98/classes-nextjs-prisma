import { Button, Table, Tooltip } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { getClassById } from "../../lib/classroom/getClassroomInfor";
import { MinusOutlined } from '@ant-design/icons';
import { cancel } from "../../lib/register/handleRegister";

type Props = {
    classId: number,
    reloadRequest: boolean,
    reload: boolean,
    setReload: any
}
type StudentInfor = {
    id: number,
    name: string,
    email: string,
    phoneNumber: string
}

type Student = {
    student: StudentInfor
}

function onChange(pagination: any) {
    console.log('params', pagination);
}
const StudentList: React.FC<Props> = ({ classId, reloadRequest, reload, setReload }) => {
    const [data, setData] = useState<Student[]>([])
    const router = useRouter()
    let students = []
    useEffect(() => {
        getClassById(classId).then(res => {
            setData(res.data.students)
        })
    }, [reload, reloadRequest])

    if (data.length > 0) {
        data.forEach((x: Student) => {
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
                        <Tooltip title='Xóa khỏi lớp'>
                            <Button
                                type="ghost"
                                shape="circle"
                                size='small'
                                icon={<MinusOutlined />}
                                onClick={() => handleDelete(x.student.id)}
                                danger ></Button>
                        </Tooltip>,
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
<<<<<<< HEAD
            // align: 'center'
=======
            align: 'center'
>>>>>>> d8a7b22745c5ae88d8ec926d48a7f4413adbb58d
        },
        {
            title: 'Hành động',
            dataIndex: 'action',
<<<<<<< HEAD
            // align: 'center'
=======
            align: 'center'
>>>>>>> d8a7b22745c5ae88d8ec926d48a7f4413adbb58d
        }
    ]

    const handleDelete = (studentId: number) => {
        cancel(studentId, classId)
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

export default StudentList;