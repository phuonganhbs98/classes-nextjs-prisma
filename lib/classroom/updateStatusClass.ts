import { Class } from ".prisma/client";
import axios, { AxiosResponse } from "axios";

export default async function updateStatusClass(id: number) {
    
    let data :AxiosResponse<Class> = await axios.get(`http://localhost:3000/api/classrooms/${id}`)
    const currentClass = data.data
    const now = new Date();
    let status = ''
    if (now < new Date(currentClass.startAt)) {
        status = 'PREPARE'
    } else if (now > new Date(currentClass.endAt)) {
        status = 'FINISHED'
    } else status = 'STUDYING'
    if (status !== currentClass.status) {
        const update = {
            id: id,
            status: status
        }
        const res = await fetch('http://localhost:3000/api/classrooms', {
            body: JSON.stringify(update),
            method: 'PUT'
        })
    }

}