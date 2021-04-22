import { Button, Form, Input, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { API } from "../../prisma/type/type";
import { EditOutlined } from '@ant-design/icons'
import { AnswerStatus } from ".prisma/client";
import Modal from "antd/lib/modal/Modal";
import TextArea from "antd/lib/input/TextArea";
import { updateAssign } from "../../lib/answer/answer";

type Props = {
    data: API.AnswerItem,
    setReloadAnswer: any,
    reloadAnswer: boolean,
    deadline: Date
}
const ShowAnswer: React.FC<Props> = ({ data, reloadAnswer, setReloadAnswer, deadline }) => {
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
    const layout = {
        labelCol: { span: 8, offset: 0 },
        wrapperCol: { span: 10 },
    };
    const tailLayout = {
        wrapperCol: { offset: 8, span: 8 },
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const onFinish = async (values: any) => {
        const body = {
            ...values,
            status: new Date() > new Date(deadline) ? 'LATE' : 'SUBMITTED',
            updatedAt: new Date()
        }
        await updateAssign(body, data.id)
            .then((res: any) => {
                console.log(res)
            })
            .catch(err => console.error(err))
        setIsModalVisible(false)
        if (reloadAnswer) setReloadAnswer(false)
        else setReloadAnswer(true)

    }
    return (
        <>
            <p style={{ fontSize: '18px' }}><strong>Bài làm của bạn</strong>
                <Tooltip title='Chỉnh sửa'>
                    <Button
                        type='primary'
                        icon={<EditOutlined />}
                        shape='circle'
                        size='middle'
                        onClick={() => setIsModalVisible(true)}
                        style={{ marginLeft: '10px' }} />
                </Tooltip>
                <br />
                {data.status === AnswerStatus.LATE ? (<small style={{ color: 'red' }}>{`<Nộp muộn>`}</small>) : ''}
            </p>
            {data?.content}
            <br />
            <a href={data?.attachment} target='_blank'>{data?.attachment}</a>
            <Modal title='Chỉnh sửa bài làm' visible={isModalVisible} footer={null} onCancel={() => setIsModalVisible(false)}>
                <Form
                    {...layout}
                    name="basic"
                    layout="horizontal"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <Form.Item
                        label="Bài làm của bạn"
                        name="content"
                        initialValue={data?.content}
                        rules={[{ required: true, message: 'Hãy điền câu trả lời !' }]}
                    >
                        <TextArea showCount />
                    </Form.Item>
                    <Form.Item
                        label="Đường dẫn bổ sung"
                        name="attachment"
                        initialValue={data?.attachment}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item {...tailLayout} >
                        <Button type="primary" htmlType="submit" style={{ margin: '0 0 30px' }}>
                            Nộp bài
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default ShowAnswer;