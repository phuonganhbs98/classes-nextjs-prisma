import axios from 'axios'
import updateStatusClass from './updateStatusClass'
export async function getAllClassroom() {
    let data = []
    await axios.get("http://localhost:3000/api/classrooms").then(res => {
        if (res.data) {
            res.data.forEach((x: any) => {
                updateStatusClass(x.id)
                data = [
                    ...data,
                    {
                        ...x,
                        teacherName: x.teacher.name,
                        count: x.students.length
                    }
                ]
            })
        }
    })

    return data;
}

export async function getClassById(id: number) {
    await updateStatusClass(id)
    let data = null
    let schedules = []
    await axios.get(`http://localhost:3000/api/classrooms/${id}`).then(res => {
        console.log(res)
        data = {
            ...res.data,
            teacherName: res.data.teacher.name,
            count: res.data.students.length
        }
        schedules = data.schedules
    })

    console.log("..............")
    console.log(data)

    // classroom = {
    //     ...classroom,
    //     startAtJson: classroom.startAt.toJSON(),
    //     endAtJson: classroom.endAt.toJSON(),
    //     teacherName: teacher.name,
    //     teacherImage: teacher.image
    // }
    // delete classroom.startAt
    // delete classroom.endAt

    // let schedulesData = []
    // if (schedules.length > 0) {
    //     schedules.forEach(x => {
    //         schedulesData = [
    //             ...schedulesData,
    //             {
    //                 ...x,
    //                 startAtJson: x.startAt.toJSON(),
    //                 endAtJson: x.endAt.toJSON()
    //             }
    //         ]
    //     })
    //     schedulesData.forEach(x => {
    //         delete x.startAt
    //         delete x.endAt
    //     })
    // } else {
    //     schedulesData = null
    // }
    return {
        data,
        schedules
    }
}
