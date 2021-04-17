import { Button, Divider, Table, Tooltip } from "antd";
import { session } from "next-auth/client";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { getClassById } from "../../lib/classroom/getClassroomInfor";
import Columns from "../column/Columns";
import { MinusOutlined } from '@ant-design/icons';
import { cancel } from "../../lib/register/handleRegister";

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

type Student = {
    student: StudentInfor
}

function onChange(pagination: any) {
    console.log('params', pagination);
}
const columns = Columns.columnStudents
const StudentList: React.FC<Props> = ({ classId, display }) => {
    const [data, setData] = useState<Student[]>([])
    const [visible, setVisible] = useState<Boolean>(false)
    const [click, setClick] = useState<Boolean>(false)
    const router = useRouter()
    let students = []
    useEffect(() => {
        console.log('qqqqq')
        getClassById(classId).then(res => {
            setData(res.data.students)
        })
    }, [display, click])

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
                        <Button
                            type="ghost"
                            shape="circle"
                            size='small'
                            icon={<MinusOutlined />}
                            onClick={() => handleDelete(x.student.id)}
                            danger ></Button>,
                    ]
                }
            ]
        })
    }

    const handleDelete = (studentId: number) => {
        cancel(studentId, classId)
        if(click) setClick(false)
        else setClick(true)
        // router.reload()
    }

    const handleClick = () => {
        if (visible) setVisible(false)
        else setVisible(true)
    }
    return (
        <div style={{ display: display }}>
            <Divider orientation="left" dashed={true} plain={true} style={{ paddingBottom: '20px' }}>
                <Tooltip title="Xem danh sách sinh viên lớp">
                    <Button style={{ fontSize: '20px', fontWeight: 'bolder' }} type="text" onClick={() => handleClick()}>Danh sách sinh viên</Button>
                </Tooltip>
            </Divider>
            <Table
                style={{ display: visible ? 'inline' : 'none' }}
                columns={columns}
                dataSource={students}
                onChange={onChange}
                rowKey={(record) => { return record.id.toString() }}
            />
        </div>
    )
}

export default StudentList;