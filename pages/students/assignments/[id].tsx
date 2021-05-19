import { Badge, Button, DatePicker, Descriptions, Form, Input, Table, Tabs, Tag, Tooltip } from "antd"
import { useSession } from "next-auth/client"
import { useEffect, useState } from "react"
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import { useRouter } from "next/router"
import { Role } from ".prisma/client"
import Link from "next/link"
import Modal from "antd/lib/modal/Modal"
import moment from "moment"
import { checkStudentSubmit } from "../../../lib/answer/answer"
import AssignmentDetailLayout from "../../assignments/component/AssignmentDetailLayout"
import ShowAnswer from "../../../components/answer/ShowAnswer"
import AnswerForm from "../../../components/answer/AnswerForm"
import { API } from "../../../prisma/type/type"
import { getAssignmentById } from "../../../lib/assignment/assignment"

const AssignmentDetail: React.FC = (props) => {
    const router = useRouter()
    let id = -1
    if (!Array.isArray(router.query?.id)) {
        id = parseInt(router.query?.id)
    }
    const [data, setData] = useState<API.AssignmentItem>()
    const [deadline, setDeadline] = useState<Date>()
    const [userId, setUserId] = useState<number>()
    const [checkSubmitAssign, setCheckSubmitAssign] = useState<boolean>(false)
    const [answerOfStu, setAnswerOfStu] = useState<API.AnswerItem>()
    const [reloadAnswer, setReloadAnswer] = useState<boolean>(false)

    useEffect(() => {
        const userId = localStorage.getItem('userId')
        setUserId(parseInt(userId))
        if (!Number.isNaN(id)) {
            getAssignmentById(id)
                .then(res => {
                    setData(res)
                    setDeadline(res.deadline)
                })
        }
    }, [id])

    useEffect(() => {
        if (!Number.isNaN(id) && !Number.isNaN(userId)) {
            checkStudentSubmit(userId, id).then(res => {
                if (res !== null && typeof res.id === 'undefined') setCheckSubmitAssign(false)
                else {
                    setAnswerOfStu(res)
                    setCheckSubmitAssign(true)
                }
            })
        }
    }, [checkSubmitAssign, id, userId, reloadAnswer])

    function onChange(pagination: any) {
        console.log('params', pagination);
    }

    return (
        <AssignmentDetailLayout
            id={id}
            isTeacher={false}
        >
            <div className="site-layout-background content">
                {checkSubmitAssign ? (
                    <ShowAnswer
                        data={answerOfStu}
                        reloadAnswer={reloadAnswer}
                        setReloadAnswer={setReloadAnswer}
                        deadline={deadline}
                    />
                ) : (
                    <AnswerForm
                        data={answerOfStu}
                        id={id}
                        studentId={userId}
                        setCheckSubmit={setCheckSubmitAssign}
                        setAnswer={setAnswerOfStu}
                        deadline={deadline}
                    />
                )}

            </div>
        </AssignmentDetailLayout>
    )
}

export default AssignmentDetail;