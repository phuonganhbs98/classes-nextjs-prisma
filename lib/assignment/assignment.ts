import axios from "axios";
import { getAllClassroom } from "../classroom/getClassroomInfor";

export async function create(data: any) {
    let result = null
    await axios.post('http://localhost:3000/api/assignments', {
        data: data
    })
        .then(res => {
            result = res
            console.log(res)
        })
        .catch(err => console.error(err))
    return result
}

export async function update(assignmentId: number, data: any) {
    await axios.put(`http://localhost:3000/api/assignments/${assignmentId}`, {
        data: data
    })
        .then(res => console.log(res))
        .catch(err => console.error(err))
}

export async function updateStatus(assignmentId: number) {
    let assignment = null
    let status = null
    await getAssignmentById(assignmentId).then(res => assignment = res)
    if (new Date(assignment.deadline) < new Date()) {
        status = 'EXPIRED'
    } else status = 'ASSIGNED'
    await axios.put(`http://localhost:3000/api/assignments/${assignmentId}`, {
        data: { status: status }
    })
        .then(res => console.log(res))
        .catch(err => console.error(err))
}

export async function getAssignmentById(assignmentId: number) {
    let data = null
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