import axios from "axios";
import { API } from "../../prisma/type/type";

export async function createTimetableClass (data: API.TimetableClassItem[]){
    let result:API.TimetableClassItem[] = null
    await axios.post(`/api/timetableClasses`, {
        data: data
    }).then(res => result = res.data)
    return result
}

export async function getAllTimetableClass (options: {[key: string]: any}){
    let result:API.TimetableClassItem[] = null
    await axios.get(`/api/timetableClasses`, {
        params: {...options}
    }).then(res => result = res.data)
    return result
}

export async function updateTimetableClass(
    classId: number, 
    options?:{[key: string]: any}){
    let result: API.TimetableClassItem[] = null
    await axios.put(`/api/timetableClasses`, {
        data: {classId: classId, ...options}
    }).then(res => result = res.data)
    return result
}

export async function createTimetableStu (data: API.TimetableStudentItem[]){
    console.log('-------timetableStu trong ham create....')
    console.log(data)
    let result:API.TimetableStudentItem[] = null
    await axios.post(`/api/timetableStudents`, {
        data: data
    }).then(res => result = res.data)
    return result
}

export async function getAllTimetableOfStu (options: {[key: string]: any}){
    let result:API.TimetableClassItem[] = null
    await axios.get(`/api/timetableStudents`, {
        params: {...options}
    }).then(res => result = res.data)
    return result
}