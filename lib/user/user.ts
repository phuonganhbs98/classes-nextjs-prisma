import axios from "axios";
import { API } from "../../prisma/type/type";

export async function getUserById(id: number) {
    let data = null
    await axios.get(`http://localhost:3000/api/users/${id}`).then(res => {
        data = {
            ...res.data,

        }
    })
    return data
}

export async function updateUser(userId: number, data: API.UserInfor) {
    let result = null
    await axios.put(`http://localhost:3000/api/users/${userId}`).then(res => {
        result = res.data
    })
    return result
}

export async function getAllStudentOfTeacher(
    teacherId: number, 
    options?:{[key: string]: any}
    ) {
    let result: API.UserInfor[] = null
    await axios.get(`http://localhost:3000/api/users/students`, {
        params: { teacherId: teacherId, ...options }
    }).then(res => {
        result = res.data
    })
    return result
}