import axios from "axios";
import { API } from "../../prisma/type/type";
import { updateTimetableClass } from "../timetable/timetable";

export default async function updateClass(id: number, data: API.Classroom) {
    let now = new Date()
    let endDate = data.endAt
    let startDate = data.startAt
    if (now < new Date(startDate)) {
        data.status = 'PREPARE'
    } else if (now > new Date(endDate)) {
        data.status = 'FINISHED'
    } else data.status = 'STUDYING'
    // let result: API.Classroom
    
    await axios.put(`http://localhost:3000/api/classrooms/${id}`, {
        data: data
    }).then(async res => {
        await updateTimetableClass(id, {title: data.name})
    })

    return 
}