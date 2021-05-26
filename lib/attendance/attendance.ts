import axios from "axios";
import { API } from "../../prisma/type/type";

export async function createAttendance(data:API.Attendance[]) {
    await axios.post(`/api/attendances`,{
        data: data
    })
    .then(res => console.log('Them attendence thanh cong'))
    .catch(err => console.error(err))
}

export async function getAttendanceByClassId(options:{[key: string]: any}) {
    let result: API.Attendance[] = []
    await axios.get(`/api/attendances`,{
        params: {...options}
    })
    .then(res => result = res.data)
    .catch(err => console.error(err))
    return result
}