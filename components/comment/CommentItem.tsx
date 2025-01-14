import { Avatar, Button, Comment, Descriptions, Form, List, message } from "antd"
import TextArea from "antd/lib/input/TextArea";
import { useEffect, useState } from "react";
import { getAllComments, submitComment } from "../../lib/comment/comment";
import { formatDate } from "../../lib/formatDate";
import { API } from "../../prisma/type/type";

const CommentItem: React.FC<{ answerId: number }> = ({ answerId }) => {
    const [comments, setComments] = useState<API.CommentItem[]>([])
    const [value, setValue] = useState<string>()
    const [image, setImage] = useState<string>()
    const [userId, setUserId] = useState<number>()
    const [author, setAuthor] = useState<string>()
    const [reload, setReload] = useState<boolean>(false)

    useEffect(() => {
        setImage(localStorage.getItem('image'))
        setUserId(parseInt(localStorage.getItem('userId')))
        setAuthor(localStorage.getItem('name'))
    }, [])

    useEffect(() => {
        if (!Number.isNaN(answerId) && typeof answerId !== 'undefined') {
            getAllComments(answerId)
                .then(res => {
                    setComments(res)
                })
        }
    }, [reload, answerId])

    if (comments.length > 0) {
        comments.forEach((x: API.CommentItem) => {
            x.datetime = formatDate(new Date(x.createdAt))
        })
    }

    const handleSubmit = async (value: any) => {
        if (!Number.isNaN(answerId) && !Number.isNaN(userId)) {
            const data: API.CommentItem = {
                ...value,
                userId: userId,
                answerId: answerId,
                avatar: image,
                author: author
            }
            await submitComment(data)
                .then(res => {
                    message.success('Comment thành công')
                    if (reload) setReload(false)
                    else setReload(true)
                }).catch(err => message.error('Thất bại'))
        }
    }
    const CommentList = ({ comments }) => (
        <List
            dataSource={comments}
            header={`${comments.length} câu trả lời`}
            itemLayout="horizontal"
            renderItem={(props: any) => <Comment {...props} />}
        />
    );

    const Editor = () => (
        <Form
            onFinish={handleSubmit}
        >
            <Form.Item name='content'>
                <TextArea rows={4} />
            </Form.Item>
            <Form.Item>
                <Button htmlType="submit" type="primary">
                    Đăng
            </Button>
            </Form.Item>
        </Form>
    );
    return (
        <div className="site-layout-background" style={{ marginTop: '20px' }}>
            <Descriptions title={<span style={{ fontWeight: 'bolder', fontSize: '16px' }}>Bình luận:</span>}
                column={2}
                extra={[
                ]}
            />

            {comments.length > 0 && <CommentList comments={comments} />}
            <Comment
                avatar={
                    <Avatar
                        src={image}
                        alt='avatar'
                    />
                }
                content={
                    <Editor />
                }
            />
        </div>
    )
}

export default CommentItem