import { add, isFriday, isMonday, isSaturday, isSunday, isThursday, isTuesday, isWednesday, set } from "date-fns";
import { API } from "../prisma/type/type";

export function firstDate(startDate: Date, schedule: API.Schedules) {
    const dayOfWeek = schedule.dayInWeek
    const startAt = schedule.startAt
    const endAt = schedule.endAt
    let check = new Date(startDate)
    while (!checkFirstDate(check, dayOfWeek)) {
        check = add(check, { days: 1 })
    }
    let firstDateStart = set(check, { hours: new Date(startAt).getHours(), minutes: new Date(startAt).getMinutes() })
    let firstDateEnd = set(check, { hours: new Date(endAt).getHours(), minutes: new Date(endAt).getMinutes() })
    return {
        startTime: firstDateStart,
        endTime: firstDateEnd
    }
}

export function getAllStudyDay(firstDate: API.Period, endDate: Date) {
    let arrayDates: API.Period[] = []
    let start = firstDate
    const end = add(new Date(endDate), {days: 1})
    while (new Date(start.startTime) < new Date(end)) {
        arrayDates = [...arrayDates,
        {
            startTime: start.startTime,
            endTime: start.endTime
        }]
        start.startTime = add(new Date(start.startTime), { weeks: 1 })
        start.endTime = add(new Date(start.endTime), { weeks: 1 })
    }
    return arrayDates;
}

export function checkFirstDate(date: Date, dayOfWeek: number) {
    switch (dayOfWeek) {
        case 0:
            return isSunday(new Date(date))

        case 1:
            return isMonday(new Date(date))

        case 2:
            return isTuesday(new Date(date))

        case 3:
            return isWednesday(new Date(date))

        case 4:
            return isThursday(new Date(date))

        case 5:
            return isFriday(new Date(date))

        default:
            return isSaturday(new Date(date))
    }
}

export function getTimetableClassList(title: string, classId: number, teacherId: number, classroom: API.Classroom) {
    const startDate = new Date(classroom.startAt)
    const endDate = new Date(classroom.endAt)
    let result: API.TimetableClassItem[] = []
    const schedules = classroom.schedules
    schedules.forEach((x: API.Schedules) => {
        let first = firstDate(startDate, x)
        let arrayDates = getAllStudyDay(first, endDate)
        arrayDates.forEach((y: API.Period) => {
            result = [
                ...result,
                {
                    title: title,
                    start: y.startTime,
                    end: y.endTime,
                    classId: classId,
                    teacherId: teacherId
                }
            ]

        })
    })

    return result
}