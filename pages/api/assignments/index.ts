import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function managerAssignment(req: NextApiRequest, res: NextApiResponse) {
    const method = req.method
    if (method === 'POST') {
        const {
            title,
            content,
            deadline,
            classId,
            teacherId,
            attachment
        } = req.body.data
        const [result] = await prisma.$transaction([
            prisma.assignment.create({
                data: {
                    title: title,
                    content: content,
                    deadline: deadline,
                    classId: classId,
                    teacherId: teacherId,
                    attachment: attachment
                }
            })
        ])
        res.status(200).json(result)
    } else if (method === 'GET') {
        const classId = Array.isArray(req.query.classId) ? '0' : req.query.classId
        const teacherId = Array.isArray(req.query.teacherId) ? '0' : req.query.teacherId
        const studentId = Array.isArray(req.query.studentId) ? '0' : req.query.studentId
        let result = null
        if (typeof classId === 'undefined' && typeof teacherId === 'undefined' && typeof studentId === 'undefined') {
            result = await prisma.assignment.findMany()
        } else if (typeof classId !== 'undefined') {
            result = await prisma.assignment.findMany({
                where: {
                    classId: parseInt(classId)
                },
                include: {
                    class: true
                }
            })
        } else if (typeof studentId !== 'undefined') {
            console.log('StudentID: ' + studentId)
            let arrayId = []
            const classId = await prisma.classroomToStudent.findMany({
                select: {
                    classId: true
                },
                where: {
                    studentId: parseInt(studentId)
                }

            }).then(async res => {
                res.forEach(x => arrayId.push(x.classId))
            })

            result = await prisma.assignment.findMany({
                include: {
                    class: true
                },
                where: {
                    classId: {
                        in: arrayId
                    }
                }
            })

            res.status(200).json(result)
        } else {
            result = await prisma.assignment.findMany({
                where: {
                    teacherId: parseInt(teacherId[0])
                },
                include: {
                    class: true
                }
            })
        }
        res.status(200).json(result)
    }
    else res.status(405).json("Method not allowed!")
}