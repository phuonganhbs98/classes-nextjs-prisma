import axios from 'axios'
import { API } from '../../prisma/type/type'
import updateStatusClass from './updateStatusClass'
export async function getAllClassroom(
    option?: {[key: string]:any}
) {
    let data = []
    await axios.get("http://localhost:3000/api/classrooms",{
        params: {...option}
    }).then(res => {
        if (res.data) {
            res.data.forEach((x: API.Classroom) => {
                updateStatusClass(x)
            })
            data = res.data
        }
    })

    return data;
}

export async function getClassById(id: number) {
    // await updateStatusClass(id)
    let data:API.Classroom = null
    let schedules = []
    await axios.get(`http://localhost:3000/api/classrooms/${id}`).then(async (res) => {
        data = res.data
        data.status = await updateStatusClass(data)
        schedules = data.schedules
    })

    return {
        data,
        schedules
    }
}
