import axios from "axios";
import { set } from "date-fns";
import { API } from "../../prisma/type/type";
import { createAttendance } from "../attendance/attendance";
import { formatDate, setTimeToZero } from "../formatDate";
import { createTimetableStu } from "../timetable/timetable";

export async function sendRegister(studentId: number, classId: number) {
    await axios.post(`/api/registers/${studentId}/${classId}`)
        .then(res => console.log(res.data))
        .catch(err => console.error(err))
}

export async function cancel(studentId: number, classId: number) {
    await axios.delete(`/api/registers/${studentId}/${classId}`)
        .then(res => console.log(res.data))
        .catch(err => console.error(err))
}

export async function accept(studentId: number, classId: number, timeTable: API.TimetableClassItem[]) {
    await axios.put(`/api/registers/${studentId}/${classId}`)
        .then(async res => {
            let attendance: API.Attendance[] = []
            let timeTableStu: API.TimetableStudentItem[] = []
            timeTable.forEach((x: API.TimetableClassItem) => {
                attendance = [
                    ...attendance,
                    {
                        studentId,
                        classId,
                        time: new Date(x.start).toLocaleDateString()
                    }
                ]
                timeTableStu = [
                    ...timeTableStu,
                    {
                        studentId: studentId,
                        timeTableId: x.id
                    }
                ]

            })
            await createAttendance(attendance)
                .then(res => console.log(res))
                .catch(err => console.error(err))
            await createTimetableStu(timeTableStu)
                .then(res => console.log(res))
            console.log('----------tao xog attendance va timetablestu....')
        })
        .catch(err => console.error(err))
}
