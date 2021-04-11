import axios from "axios";

export default async function getRegisteredClass(studentId: number) {
    let data = []
    await axios.get(`http://localhost:3000/api/registers/${studentId}`).then(
        res => {
            res.data.forEach((x: any) => {
                data =[
                    ...data,
                    {
                        ...x.classroom,
                        teacherName: x.classroom.teacher.name,
                        count: x.classroom.students.length
                    }
                ]
            });
        }
    )

    return data;
}