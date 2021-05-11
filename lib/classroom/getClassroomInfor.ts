import axios from 'axios'
import updateStatusClass from './updateStatusClass'
export async function getAllClassroom() {
    let data = []
    await axios.get("http://localhost:3000/api/classrooms").then(res => {
        if (res.data) {
            // res.data.forEach((x: any) => {
            //     updateStatusClass(x.id)
            // })
            data = res.data
        }
    })

    return data;
}

export async function getClassById(id: number) {
    await updateStatusClass(id)
    let data = null
    let schedules = []
    await axios.get(`http://localhost:3000/api/classrooms/${id}`).then(res => {
        data = res.data
        schedules = data.schedules
    })

    return {
        data,
        schedules
    }
}
