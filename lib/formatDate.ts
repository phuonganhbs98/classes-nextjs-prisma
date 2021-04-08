export function formatDate(date: Date) {
    const a = formatDay(date.getDay())
    return a + ', ' + date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
}

export function formatTime(time: Date) {
    const hour = time.getHours()
    const minute = time.getMinutes()
    if (minute === 0) return hour + 'h '
    return hour + 'h' + minute +'ph'
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