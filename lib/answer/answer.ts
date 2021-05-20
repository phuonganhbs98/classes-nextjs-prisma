import axios from "axios"
import { API } from "../../prisma/type/type"

export async function getAllAnswer(assignmentId: number) {
    let data = []
    await axios.get(`/api/answers`, {
        params: {
            assignmentId: assignmentId
        }
    })
        .then(res => data = res.data)
        .catch(err => console.error(err))
    return data
}

export async function submitAssign(answer: API.AnswerItem) {
    let result = null
    await axios.post(`/api/answers/submit`, {
        data: answer
    }).then(res => result = res.data)
    return result
}

export async function updateAssign(answer: API.AnswerItem, answerId: number) {
    let result = null
    await axios.put(`/api/answers/${answerId}`, {
        data: answer
    }).then(res => result = res.data)
    return result
}

export async function checkStudentSubmit(studentId: number, assignmentId: number) {
    let result = null
    if (studentId && assignmentId) {
        await axios.get(`/api/answers/submit`, {
            params: {
                studentId: studentId,
                assignmentId: assignmentId
            }
        }).then(res => result = res.data)
    }
    return result
}

export async function getAnswerById(id: number) {
    let result = null
    await axios.get(`/api/answers/${id}`)
        .then(res => result = res.data)
        .catch(err => console.error(err))
    return result
}

export async function scoring(id: number, score: number) {
    await axios.put(`/api/answers/${id}`, {
        data: {score: score}
    })
        .then(res => console.log(res))
        .catch(err => console.error(err))
}

export async function updateStatusAnswer(answer: API.AnswerItem, deadline: Date) {
    let status = setStatusAnswer(deadline)
    if (answer.status !== status) {
        await axios.put(`/api/answers/${answer.id}`, {
            data: { status: status }
        })
            
    }
}

export function setStatusAnswer(deadline: Date) {
    const now = new Date()
    if (now > new Date(deadline)) return 'LATE'
    else return 'SUBMITTED'
}
