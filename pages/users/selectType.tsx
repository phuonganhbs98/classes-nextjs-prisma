import { Button, Form, Select } from "antd"
import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import alert from "../../lib/alert";
import { updateUser } from "../../lib/user/user";
import { API } from "../../prisma/type/type";

const SelectType: React.FC = () => {
    const [userId, setUserId] = useState<number>(-1)
    const router = useRouter()
    const [session, loading]=useSession()
    useEffect(() => {
        if(session){
            setUserId(parseInt(session.userId))
        }
    }, [session])
    const layout = {
        labelCol: { span: 8, offset: 8, },
        wrapperCol: { span: 8, offset: 8 },
    };
    const tailLayout = {
        wrapperCol: { offset: 8, span: 16 },
    };
    const onFinish = async (values: API.UserInfor) => {
        console.log('values:', values);
        if (userId !== -1 && !Number.isNaN(userId)) {
            console.log(userId)
            if (values.role !== 'STUDENT') {
                await updateUser(userId, values)
                    .then(res => {
                        console.log(res)
                        localStorage.setItem('role', values.role)
                        alert('Chào mừng thành viên mới', 'success')
                        router.push('/')
                    })
            }
            alert('Chào mừng thành viên mới', 'success')
            router.push('/')
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <div style={{
            padding: "120px 2%",
            backgroundImage: 'url(/image/home_bg.png)',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            minHeight: '650px'

        }}>
            <h2 style={{ textAlign: "center", fontWeight: 'bolder' }}>Bạn là học sinh/ sinh viên hay giáo viên?</h2>
            <Form
                {...layout}
                name="basic"
                layout="vertical"
                initialValues={{ remember: false }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                style={{
                    margin: '2% auto'
                }}
            >
                <Form.Item
                    name='role'
                    initialValue={'TEACHER'}
                    rules={[{ required: true, message: 'Hãy chọn một lớp' }]}
                >
                    <Select placeholder='Hãy chọn một lớp'>
                        <Select.Option value='TEACHER'>Giáo viên</Select.Option>
                        <Select.Option value='STUDENT'>Học sinh / Sinh viên</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        OK
                    </Button>
                </Form.Item>
            </Form>
        </div >
    )
}

export default SelectType