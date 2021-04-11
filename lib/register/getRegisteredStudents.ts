import axios from "axios"

export default async function getRegisteredStudents (classId:number) {
    let data =[]
    await axios.get(`http://localhost:3000/api/registers/classes/${classId}`).then(res => {
        data = res.data
    })
    return data;
}