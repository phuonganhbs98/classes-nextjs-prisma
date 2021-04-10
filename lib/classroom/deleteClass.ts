import axios from "axios";

export default async function deleteClass(id: number){
    await axios.delete(`http://localhost:3000/api/classrooms/${id}`).then(res=> console.log(res.data))
}