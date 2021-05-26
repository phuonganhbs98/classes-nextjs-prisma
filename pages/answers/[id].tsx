import { AnswerStatus } from ".prisma/client";
import { Button, Descriptions, InputNumber, Tooltip } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CommentItem from "../../components/comment/CommentItem";
import MainLayout from "../../components/layouts/MainLayout";
import { getAnswerById, scoring } from "../../lib/answer/answer";
import { API } from "../../prisma/type/type";
import { ReadOutlined } from '@ant-design/icons'
import Modal from "antd/lib/modal/Modal";
import { useSession } from "next-auth/client";
import { formatDate } from "../../lib/formatDate";

const AnswerDetail: React.FC = () => {
    const [userId, setUserId] = useState<number>(-1)
    const [data, setData] = useState<API.AnswerItem>()
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
    const [score, setScore] = useState<number>(0)
    const [reload, setReload] = useState<boolean>(false)
    const [canScoring, setCanScoring] = useState<boolean>(false)
    const router = useRouter()
    let id = -1
    if (!Array.isArray(router.query?.id)) {
        id = parseInt(router.query.id)
    }

    useEffect(() => {
        setUserId(parseInt(localStorage.getItem('userId')))
    }, [])

    useEffect(() => {
        if (!Number.isNaN(id) && !Number.isNaN(userId) && userId!== -1) {
            getAnswerById(id)
                .then(res => {
                    setData(res)
                    if (userId === res.assignment.teacherId)
                        setCanScoring(true)
                    else setCanScoring(false)
                    setScore(res !== null ? res.score : null)
                })
        }

    }, [id, reload, userId])

    const showModal = () => {
        setIsModalVisible(true)
    }

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleOk = () => {
        scoring(id, score)
        setIsModalVisible(false);
        if (reload) setReload(false)
        else setReload(true)
    };

    const onScoreChange = (e) => {
        setScore(e)
    }

    return (
        <MainLayout title={<div><span>Bài làm của {data?.student.name} {data?.status === AnswerStatus.LATE ? (<small style={{ color: 'red' }}>{`<Nộp muộn>`}</small>) : ''}</span></div>}>
            <div className="site-layout-background">
                <Descriptions title={<span style={{ fontWeight: 'bolder', fontSize: '16px' }}>Đề bài: {data?.assignment.content}</span>}
                    column={2}
                    extra={[
                        canScoring ? (<span><Tooltip title='Chấm điểm'><Button type='primary' onClick={showModal} icon={<ReadOutlined />} /></Tooltip> <br /></span>) : (<></>),
                        <p> Điểm: <strong style={{ color: 'red' }}>{data?.score}/10</strong></p>
                    ]}
                />
                <p style={{textAlign: 'justify'}}>{data?.content}</p>
                <br />
                <a href={data?.attachment} target='_blank'>{data?.attachment}</a>
                <br />
                <br />
                <em style={{ fontSize: '12px' }}>Chỉnh sửa lần cuối lúc: {data ? formatDate(new Date(data.updatedAt)) : null} {data?.status === AnswerStatus.LATE ? (<span style={{ color: 'red' }}>{`<Nộp muộn>`}</span>) : ''}</em>
            </div>
            <CommentItem
                answerId={id}
            />
            <Modal title="Chấm điểm" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <InputNumber min={0} max={10} value={score} onChange={onScoreChange} /><small> (Nhập từ 0 đến 10)</small>
            </Modal>
        </MainLayout>
    )
}

export default AnswerDetail