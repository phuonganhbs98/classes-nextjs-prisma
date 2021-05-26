import { CheckOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Divider, Table, Tooltip } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import getRegisteredStudents from "../../lib/register/getRegisteredStudents";
import { accept } from "../../lib/register/handleRegister";
import { getAllTimetableClass } from "../../lib/timetable/timetable";
import { API } from "../../prisma/type/type";

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
    const [timeTable, setTimetable] = useState<API.TimetableClassItem[]>([])
    const router = useRouter()
    let students = []
    useEffect(() => {
        getRegisteredStudents(classId).then((res: ListStudents[]) => {
            setTotal(res.length)
            setData(res)
        })
    }, [reload])

    useEffect(() => {
        getAllTimetableClass({ classId: classId })
            .then(res => setTimetable(res))
    }, [])
    if (data.length > 0) {
        data.forEach((x: ListStudents) => {
            students = [
                ...students,
                {
                    ...x.student,
                    action: [
                        <Tooltip title='Xem'>
                            <Button
                                key={x.student.id}
                                type="link"
                                icon={<EyeOutlined />}
                                onClick={() => router.push({
                                    pathname: `/users/${x.student.id}`,
                                })} /></Tooltip>,
                        <Tooltip title='Đồng ý'>
                            <Button type="link"
                                icon={<CheckOutlined style={{ color: 'green' }} />}
                                onClick={() => handleAccept(x.student.id)} /></Tooltip>
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
        accept(studentId, classId, timeTable)
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