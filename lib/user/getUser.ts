import axios from "axios";

export async function getUserById(id: number) {
    let data = null
    await axios.get(`http://localhost:3000/api/users/${id}`).then(res => {
        console.log(res.data)
        data = {
            ...res.data,

        }
    })
    return data
}