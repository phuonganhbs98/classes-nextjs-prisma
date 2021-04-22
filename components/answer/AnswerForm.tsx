import { Button, Form, Input } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { submitAssign } from "../../lib/answer/answer";
import { API } from "../../prisma/type/type";

type Props = {
    id: number,
    studentId: number,
    setCheckSubmit: any,
    setAnswer: any,
    deadline: Date,
    data: API.AnswerItem
}
const AnswerForm: React.FC<Props> = ({ id, studentId, setCheckSubmit, setAnswer, deadline, data }) => {
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
        const data = {
            ...values,
            assignmentId: id,
            studentId: studentId,
            status: new Date()> new Date(deadline)? 'LATE': 'SUBMITTED'
        }
        await submitAssign(data)
            .then((res: any) => {
                console.log(res)
                setAnswer(res)
            })
            .catch(err => console.error(err))
        setCheckSubmit(true)
        
    }
    return (
        <Form
            {...layout}
            name="basic"
            layout="horizontal"
            initialValues={{ remember: false }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            style={{
                paddingTop: "2%"
            }}
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
    )
}

export default AnswerForm;