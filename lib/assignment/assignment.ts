import axios from "axios";

export async function create(data: any) {
    await axios.post('http://localhost:3000/api/assignments', {
        data: data
    })
        .then(res => console.log(res))
        .catch(err => console.error(err))
}

export async function updateStatus(assignmentId: number) {
    let assignment = null
    await getAssignmentById(assignmentId).then(res => assignment = res)
    if (new Date(assignment.deadline) < new Date()) {
        await axios.put(`http://localhost:3000/api/assignments/${assignmentId}`)
            .then(res => console.log(res))
            .catch(err => console.error(err))
    }
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
        teacherId?: number
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