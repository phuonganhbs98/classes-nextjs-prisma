import { Avatar, Button, Comment, Descriptions, Form, List } from "antd"
import TextArea from "antd/lib/input/TextArea";
import { useState } from "react";

const CommentItem: React.FC = () => {
    const [submitting, setSubmitting] = useState<boolean>(false)
    const [comments, setComments] = useState([])
    const [value, setValue] = useState<string>()
    const handleChange = (e: any) => {
        setValue(e.target.value)
    };

    const handleSubmit = ()=>{

    }
    const CommentList = ({ comments }) => (
        <List
            dataSource={comments}
            header={`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`}
            itemLayout="horizontal"
            renderItem={props => <Comment {...props} />}
        />
    );

    const Editor = ({ onChange, onSubmit, submitting, value }) => (
        <>
            <Form.Item>
                <TextArea rows={4} onChange={onChange} value={value} />
            </Form.Item>
            <Form.Item>
                <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
                    Add Comment
            </Button>
            </Form.Item>
        </>
    );
    return (
        <div className="site-layout-background" style={{ marginTop: '20px' }}>
            <Descriptions title={<span style={{fontWeight: 'bolder', fontSize: '16px'}}>Nhận xét:</span>}
                    column={2}
                    extra={[
                    ]}
                />
            
            {comments.length > 0 && <CommentList comments={comments} />}
            <Comment
                avatar={
                    <Avatar
                        src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                        alt="Han Solo"
                    />
                }
                content={
                    <Editor
                        onChange={handleChange}
                        onSubmit={handleSubmit}
                        submitting={submitting}
                        value={value}
                    />
                }
            />
        </div>
    )
}

export default CommentItem