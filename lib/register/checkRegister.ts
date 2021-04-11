import axios from "axios"

 const checkRegister = async (studentId: number, classId: number) => {
    let result = null
    await axios.get(`http://localhost:3000/api/registers/${studentId}/${classId}`).then(res => {
        if (res.data)
            result = res.data.status
    })
    return result;
}

export default checkRegister;