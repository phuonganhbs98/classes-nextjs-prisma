import { Button, message, Popconfirm, Table, Tooltip } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { getClassById } from "../../lib/classroom/getClassroomInfor";
import { UserDeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { cancel } from "../../lib/register/handleRegister";
import { API } from "../../prisma/type/type";
import { ColumnsType } from "antd/lib/table";

type Props = {
    classId: number,
    reloadRequest: boolean,
    reload: boolean,
    setReload: any
}

function onChange(pagination: any) {
    console.log('params', pagination);
}
const StudentList: React.FC<Props> = ({ classId, reloadRequest, reload, setReload }) => {
    const [data, setData] = useState<API.StudentAndClassroom[]>([])
    const [total, setTotal] = useState<number>(0)
    const router = useRouter()
    let students = []
    useEffect(() => {
        getClassById(classId).then(res => {
            setData(res.data.students)
            setTotal(res.data.students.length)
        })
    }, [reload, reloadRequest])

    if (data.length > 0) {
        data.forEach((x: API.StudentAndClassroom) => {
            students = [
                ...students,
                {
                    ...x.student,
                    action: [
                        <Tooltip title='Xem'><Button
                            key={x.student.id}
                            type="link"
                            icon={<EyeOutlined />}
                            onClick={() => router.push({
                                pathname: `/users/${x.student.id}`,
                            })}
                        /></Tooltip>,
                        <Popconfirm
                            title="Bạn chắc chắn chứ ?"
                            onConfirm={() => handleDelete(x.student.id)}
                        >
                            <Tooltip title='Xóa khỏi lớp'>
                                <Button
                                    type="link"
                                    // shape="circle"
                                    size='small'
                                    icon={<UserDeleteOutlined />}
                                    danger />
                            </Tooltip>
                        </Popconfirm>,
                    ]
                }
            ]
        })
    }

    const columns: ColumnsType<API.StudentInfor> = [
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
            align: 'center'
        },
        {
            title: 'Hành động',
            dataIndex: 'action',
            align: 'center'
        }
    ]

    const handleDelete = async (studentId: number) => {
        await cancel(studentId, classId)
        .then(res =>{
            if (reload) setReload(false)
            else setReload(true)
        })
        
    }

    return (
        <Table<API.StudentInfor>
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

export default StudentList;