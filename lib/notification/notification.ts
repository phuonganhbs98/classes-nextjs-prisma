import { message } from "antd"
import axios from "axios"
import { API } from "../../prisma/type/type"

export async function createNoti(notification: API.NotificationItem) {
    let result:API.NotificationItem = null
    await axios.post(`/api/notifications`, {
        data: notification
    }).then(res => {
        result = res.data
        message.success('Đăng thông báo thành công')
    }).catch(err => message.error('Thất bại'))
    return result
}

export async function getAllNotifications(options?:{[key: string]: any}) {
    let result:API.NotificationItem[] = []
    await axios.get(`/api/notifications`, {
        params:{...options}
    }).then(res => result = res.data)
    .catch(err => message.error('Có lỗi khi lấy danh sách các thông báo'))
    return result
}

export async function editNoti(data:{content: string}, notiId: number) {
    let result:API.NotificationItem = null
    await axios.put(`/api/notifications/${notiId}`, {
        data: data
    }).then(res => {
        result = res.data
        message.success('Thành công')
    }).catch(err => message.error('Thất bại'))
    return result
}

export async function deleteNoti(notiId: number) {
    await axios.delete(`/api/notifications/${notiId}`)
    .then(res => console.log(res))
    .catch(err=> console.error(err))
}

export async function getNotiById(notiId: number) {
    let result:API.NotificationItem = null
    await axios.get(`/api/notifications/${notiId}`).then(res => result = res.data)
    return result
}

export async function getAllNotiComments(notiId: number) {
    let result:API.CommentItem[] = []
    await axios.get(`/api/notiComments`,{
        params:{notiId}
    }).then(res => result = res.data)
    return result
}

export async function submitNotiComments(data:any) {
    let result:any = null
    await axios.post(`/api/notiComments`,{
        data: data
    }).then(res => result = res.data)
    return result
}

