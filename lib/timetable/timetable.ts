import axios from "axios";
import { API } from "../../prisma/type/type";

export async function createTimetableClass (data: API.TimetableClassItem[]){
    let result:API.TimetableClassItem[] = null
    await axios.post(`/api/timetableClasses`, {
        data: data
    }).then(res => result = res.data)
    return result
}

export async function getAllTimetableClass (teacherId: number){
    let result:API.TimetableClassItem[] = null
    await axios.get(`/api/timetableClasses`, {
        params: {teacherId: teacherId}
    }).then(res => result = res.data)
    return result
}