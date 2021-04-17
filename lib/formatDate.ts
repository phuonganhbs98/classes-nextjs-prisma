import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

export function formatDate(date: Date, time?: boolean) {
    if (typeof time === 'undefined' || time)
        return format(date, 'Pp', { locale: vi })
    return format(date, 'P', { locale: vi })

}

export function formatTime(time: Date) {
    return format(time, 'p')
}

export function formatDay(day: Number) {
    switch (day) {
        case 0:
            return 'Chủ nhật'

        case 1:
            return 'Thứ 2'

        case 2:
            return 'Thứ 3'

        case 3:
            return 'Thứ 4'

        case 4:
            return 'Thứ 5'

        case 5:
            return 'Thứ 6'

        default:
            return 'Thứ 7'
    }
}