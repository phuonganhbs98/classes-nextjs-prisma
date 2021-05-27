import { API } from "../../prisma/type/type";

export default function getAttendanceDetail(classId: number, attendances: API.Attendance[]) {
    attendances = attendances.filter((x: API.Attendance) => x.classId === classId)
    let presents = attendances.filter((x: API.Attendance) => x.status === 'P' || x.status === 'L')
    let absences = attendances.filter((x: API.Attendance) => x.status === 'UA' || x.status === 'AA')
    const result: API.AttendanceStatistic = {
        presents,
        absences,
        total: presents.length + absences.length
    }
    return result
}