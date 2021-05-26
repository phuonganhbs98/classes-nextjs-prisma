import axios from "axios";
import { API } from "../../prisma/type/type";
import { getAllClassroom } from "../classroom/getClassroomInfor";

export async function create(data: API.AssignmentItem) {
    let result: API.AssignmentItem = null
    data.status = setStatus(data.deadline)
    await axios.post('http://localhost:3000/api/assignments', {
        data: data
    })
        .then(res => {
            result = res.data
        })
        .catch(err => console.error(err))
    return result
}

export async function update(assignmentId: number, data: API.AssignmentItem) {
    let result: API.AssignmentItem = null
    data.status = setStatus(data.deadline)
    await axios.put(`http://localhost:3000/api/assignments/${assignmentId}`, {
        data: data
    })
        .then(res => result = res.data)
    // .catch(err => console.error(err))
    return result
}

export async function updateStatus(assignment: API.AssignmentItem) {
    const status = setStatus(assignment.deadline)
    if (status !== assignment.status) {
        await axios.put(`http://localhost:3000/api/assignments/${assignment.id}`, {
            data: { status: status }
        })
            .then(res => console.log(res))
            .catch(err => console.error(err))
    }
    return status
}

export async function getAssignmentById(assignmentId: number) {
    let data: API.AssignmentItem = null
    await axios.get(`http://localhost:3000/api/assignments/${assignmentId}`).then(res => {
        data = res.data
    })
    return data
}

export async function findAll(
    params: {
        classId?: number,
        teacherId?: number,
        studentId?: number
    }
) {
    let data = []
    await axios.get(`http://localhost:3000/api/assignments`, {
        params: { ...params }
    }).then(res => {
        data = res.data
    })
    return data
}

export async function deleteAssignment(assignmentId: number) {
    await axios.delete(`http://localhost:3000/api/assignments/${assignmentId}`)
        .then(res => console.log(res))
        .catch(err => console.error(err))
}

export function setStatus(deadline: Date) {
    if (new Date(deadline) < new Date()) {
        status = 'EXPIRED'
    } else status = 'ASSIGNED'
    return status
}

export async function getUndoneAssignments(classId: number, studentId: number) {
    let result: API.AssignmentItem[] = []
    await axios.get(`http://localhost:3000/api/assignments/undone`, {
        params: {
            classId: classId,
            studentId: studentId
        }
    })
        .then(res => {
            console.log(res)
            result = res.data
        })
        .catch(err => console.error(err))
    return result
}