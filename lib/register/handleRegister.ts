import axios from "axios";

export async function sendRegister(studentId:number, classId:number) {
    await axios.post(`http://localhost:3000/api/registers/${studentId}/${classId}`)
    .then(res => console.log(res.data))
    .catch(err =>console.error(err))
}

export async function cancel(studentId:number, classId:number) {
    await axios.delete(`http://localhost:3000/api/registers/${studentId}/${classId}`)
    .then(res => console.log(res.data))
    .catch(err =>console.error(err))
}

export async function accept(studentId:number, classId:number) {
    await axios.put(`http://localhost:3000/api/registers/${studentId}/${classId}`)
    .then(res => console.log(res.data))
    .catch(err =>console.error(err))
}
