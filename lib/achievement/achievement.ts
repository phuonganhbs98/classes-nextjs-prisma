import axios from "axios";
import { API } from "../../prisma/type/type";

export async function calculateAveragePoint(classId: number, studentId: number) {
    let answerList: API.AnswerItem[]=[]
    let total: number = 0
    await axios.get(`/api/answers`, {
        params: {
            classId: classId,
            studentId: studentId
        }
    }).then(res => {
        answerList = res.data
        res.data.forEach((x: API.AnswerItem) => {
            total = total + x.score
        });
    })
    return {
        answerList,
        total
    };
}

export function getAnswer(answers:API.AnswerItem[], assignmentId: number) {
    const result = answers.filter((x: API.AnswerItem)=> x.assignmentId === assignmentId)
    console.log('result')
    console.log(result)
    return result
}

export function getAveragePoint(answers: API.AnswerItem[], assignmentsTotal: number, classId: number){
    let total = assignmentsTotal
    let sumPoint = 0
    let answersOfClass:API.AnswerItem[]=answers.filter((x: API.AnswerItem)=> x.assignment.classId === classId)
    answersOfClass.forEach((x: API.AnswerItem)=>{
        sumPoint= sumPoint + x.score
    })
    return sumPoint/total
}