import { isAfter, isBefore } from "date-fns";
import set from "date-fns/set";
import { API } from "../../prisma/type/type";

export default function checkDuplicateTimetable(
    schedules: API.Schedules[], 
    timetable: API.TimetableClassItem[], 
    classroom: API.Classroom) {
    let check = false
    schedules.forEach((x: API.Schedules) => {
        check =timetable.some((y: API.TimetableClassItem) => !checkInTurn(x, y, classroom))
    })
    if(check) return false
    return true
}

function checkInTurn(schedule: API.Schedules, timetable: API.TimetableClassItem, classroom: API.Classroom) {
    const dayOfSchedule = schedule.dayInWeek
    const dayOfTimetable = new Date(timetable.start).getDay()

    if (dayOfSchedule !== dayOfTimetable) {
        return true
    } else {
        if (isBefore(new Date(timetable.start), classroom.startAt) && 
            isBefore(new Date(timetable.end), classroom.startAt)) return true
        if (isAfter(new Date(timetable.start), classroom.endAt) && 
            isAfter(new Date(timetable.end), classroom.endAt)) return true

        const startTimetable = set(new Date(), { hours: new Date(timetable.start).getHours(), 
                                                minutes: new Date(timetable.start).getMinutes() })
        const endTimetable = set(new Date(), { hours: new Date(timetable.end).getHours(), 
                                                minutes: new Date(timetable.end).getMinutes() })
        const startSchedule = set(new Date(), { hours: new Date(schedule.startAt).getHours(), 
                                                minutes: new Date(schedule.startAt).getMinutes() })
        const endSchedule = set(new Date(), { hours: new Date(schedule.endAt).getHours(), 
                                                minutes: new Date(schedule.endAt).getMinutes() })
        if (isBefore(startSchedule, startTimetable) && 
            isBefore(endSchedule, startTimetable)) return true
        if (isAfter(startSchedule, endTimetable) && 
            isAfter(endSchedule, endTimetable)) return true
    }
    return false
}