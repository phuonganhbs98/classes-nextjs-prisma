import axios from "axios";
import { API } from "../../prisma/type/type";

export default async function updateClass(id: number, data: API.Classroom) {
    let now = new Date()
    let endDate = data.endAt
    let startDate = data.startAt
    if (now < new Date(startDate)) {
        data.status = 'PREPARE'
    } else if (now > new Date(endDate)) {
        data.status = 'FINISHED'
    } else data.status = 'STUDYING'
    
    return await axios.put(`http://localhost:3000/api/classrooms/${id}`, {
        data: data
    })
}