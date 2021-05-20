import axios from "axios"
import { API } from "../../prisma/type/type"

export async function submitComment(comment: API.CommentItem) {
    let result:API.CommentItem = null
    await axios.post(`/api/comments`, {
        data: comment
    }).then(res => result = res.data)
    return result
}

export async function getAllComments(answerId:number) {
    let result:API.CommentItem[] = []
    await axios.get(`/api/comments`, {
        params:{answerId: answerId}
    }).then(res => result = res.data)
    return result
}