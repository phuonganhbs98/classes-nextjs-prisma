import { isAfter, isBefore } from "date-fns";
import set from "date-fns/set";
import { API } from "../../prisma/type/type";

export default function checkDuplicateTimetable(schedules: API.Schedules[], timetable: API.TimetableClassItem[], classroom: API.Classroom) {
    let count: number = 0
    schedules.forEach((x: API.Schedules) => {
        timetable.forEach((y: API.TimetableClassItem) => {
            // console.log('checkInturn: ' + checkInTurn(x, y, classroom))
            if (!checkInTurn(x, y, classroom)) {
                count++
            }
        })
    })
    console.log('count: ' + count)
    if (count === 0)
        return true
    else return false
}

function checkInTurn(schedule: API.Schedules, timetable: API.TimetableClassItem, classroom: API.Classroom) {
    if (schedule.dayInWeek !== new Date(timetable.start).getDay()) {
        return true
    } else {
        if (isBefore(new Date(timetable.start), classroom.startAt) && isBefore(new Date(timetable.end), classroom.startAt)) return true
        if (isAfter(new Date(timetable.start), classroom.endAt) && isAfter(new Date(timetable.end), classroom.endAt)) return true

        const startTimetable = set(new Date(), { hours: new Date(timetable.start).getHours(), minutes: new Date(timetable.start).getMinutes() })
        const endTimetable = set(new Date(), { hours: new Date(timetable.end).getHours(), minutes: new Date(timetable.end).getMinutes() })
        const startSchedule = set(new Date(), { hours: new Date(schedule.startAt).getHours(), minutes: new Date(schedule.startAt).getMinutes() })
        const endSchedule = set(new Date(), { hours: new Date(schedule.endAt).getHours(), minutes: new Date(schedule.endAt).getMinutes() })

        console.log('-----------------')
        console.log('startTimetable: ' + startTimetable.toLocaleString())
        console.log('endTimetable: ' + endTimetable.toLocaleString())
        console.log('startSchedule: ' + startSchedule.toLocaleString())
        console.log('endSchedule: ' + endSchedule.toLocaleString())
        console.log(isBefore(startSchedule, startTimetable) && isBefore(endSchedule, startTimetable))
        console.log(isAfter(startSchedule, endTimetable) && isAfter(endSchedule, endTimetable))
        if (isBefore(startSchedule, startTimetable) && isBefore(endSchedule, startTimetable)) return true
        if (isAfter(startSchedule, endTimetable) && isAfter(endSchedule, endTimetable)) return true
    }
    return false
}