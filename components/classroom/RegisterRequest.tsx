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
    const [visible, setVisible] = useState<Boolean>(false)
    const [checkReload, setCheckLoad] = useState<Boolean>(false)
    const router = useRouter()
    let students = []
    useEffect(() => {
        getRegisteredStudents(classId).then((res: ListStudents[]) => {
            setData(res)
        })
    }, [display])
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
        if(checkReload) setCheckLoad(false)
        else setCheckLoad(true)
    }
    const handleClick = () => {
        if (visible) setVisible(false)
        else setVisible(true)
    }
    return (
        <div style={{ display: display }}>
            <Divider orientation="left" dashed={true} plain={true} style={{ paddingBottom: '20px' }}>
                <Tooltip title="Xem các yêu cầu vào lớp">
                    <Button style={{ fontSize: '20px', fontWeight: 'bolder' }} type="text" onClick={() => handleClick()}>Yêu cầu vào lớp{visible ? <CaretUpOutlined /> : <CaretDownOutlined />}</Button>
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

export default RegisterRequest;