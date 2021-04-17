import { Button, Descriptions, Tooltip } from "antd"
import { useSession } from "next-auth/client"
import { useEffect, useState } from "react"
import MainLayout from "../../components/layouts/MainLayout"
import { getAssignmentById, updateStatus } from "../../lib/assignment/assignment"
import { formatDate } from "../../lib/formatDate"
import { API } from "../../prisma/type/type"
import {EditOutlined, DeleteOutlined} from '@ant-design/icons'
import { useRouter } from "next/router"

export async function getServerSideProps({ params }) {
    let id = parseInt(params.id)
    return {
        props: {
            id
        }
    }
}
const AssignmentDetail: React.FC<{ id: number }> = (props) => {
    const [session] = useSession()
    const router = useRouter()
    const id = props.id
    const [data, setData] = useState<API.AssignmentItem>()
    const [deadline, setDeadline] = useState<Date>()
    useEffect(() => {
        updateStatus(id)
        getAssignmentById(id)
            .then(res => {
                setData(res)
                setDeadline(res.deadline)
            })

    }, [session])
    const handleEdit = ()=>{

    }

    const handleDelete = ()=> {
        router.push('/assignments')
    }
    return (
        <MainLayout title={data?.title}>
            <strong>Đề bài: </strong><em>{data?.content}</em>

            <Descriptions title=''
                column={2}
                extra={[
                    <Tooltip overlay='Sửa'><Button type='ghost' icon={<EditOutlined />} onClick={() => handleEdit()} ></Button></Tooltip>,
                    <Tooltip overlay='Xóa'><Button type='ghost' icon={<DeleteOutlined />} onClick={() => handleDelete()} danger></Button></Tooltip>
                ]}
            >
                <Descriptions.Item label={<strong>Đường dẫn bổ sung</strong>}>
                    <a href={data ? data.attachment : ''} target='_blank'>{data?.attachment}</a>
                </Descriptions.Item>
                <Descriptions.Item label={<strong>Trạng thái</strong>}>{data?.status}</Descriptions.Item>
                <Descriptions.Item label={<strong>Thời hạn</strong>}>{deadline?formatDate(new Date(deadline), true):null}</Descriptions.Item>
                <Descriptions.Item label={<strong>Lớp</strong>}>{data?.class?.name}</Descriptions.Item>
            </Descriptions>
        </MainLayout>
    )
}

export default AssignmentDetail;