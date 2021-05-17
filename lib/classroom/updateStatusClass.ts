import { API } from "../../prisma/type/type";

export default async function updateStatusClass(classroom: API.Classroom) {
    
    const now = new Date();
    const endDate = classroom.endAt
    const startDate = classroom.startAt
    let status = ''
    if (now < new Date(startDate)) {
        status = 'PREPARE'
    } else if (now > new Date(endDate)) {
        status = 'FINISHED'
    } else status = 'STUDYING'
    if (status !== classroom.status) {
        const update = {
            id: classroom.id,
            status: status
        }
        const res = await fetch('http://localhost:3000/api/classrooms', {
            body: JSON.stringify(update),
            method: 'PUT'
        })
    }
    return status;

}