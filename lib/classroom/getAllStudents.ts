import axios from "axios";
import { API } from "../../prisma/type/type";

export async function getAllStudents(classId:number) {
    let result: API.UserInfor[]=[]
    await axios.get(`/api/classrooms/students`,{
        params:{classId: classId}
    }).then(res => result = res.data)
    .catch(err => console.error(err))

    return result
}