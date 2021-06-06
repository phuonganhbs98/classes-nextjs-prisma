import axios from "axios"

 const checkRegister = async (studentId: number, classId: number) => {
    let result = null
    await axios.get(`http://localhost:3000/api/registers/${studentId}/${classId}`).then(res => {
        if (res.data)
            result = res.data.status
    })
    return result;
}

export async function checkStudentOfClass(studentId: number, classId: number) {
    let result = null
    await axios.get(`http://localhost:3000/api/registers`,{
        params:{
            studentId: studentId,
            classId: classId
        }
    }).then(res => {
        if (res.data)
            result = res.data
    })
    return result
}

export default checkRegister;