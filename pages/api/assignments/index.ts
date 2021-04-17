import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function managerAssignment(req: NextApiRequest, res: NextApiResponse) {
    const method = req.method
    if (method === 'POST') {
        console.log('req.body')
        console.log(req.body)
        const {
            title,
            content,
            deadline,
            classId,
            teacherId,
            attachment
        } = req.body.data

        await prisma.$transaction([
            prisma.assignment.create({
                data:{
                    title: title,
                    content: content,
                    deadline: deadline,
                    classId: classId,
                    teacherId: teacherId,
                    attachment: attachment
                }
            })
        ])
        res.status(200).json("Create assignment success")
    }else if(method==='GET'){
        const classId = req.query.classId
        const teacherId = req.query.teacherId
        let result = null
        if(typeof classId === 'undefined' && typeof teacherId === 'undefined'){
            result = await prisma.assignment.findMany()
        }else if(typeof classId !== 'undefined'){
            result = await prisma.assignment.findMany({
                where: {
                    classId: parseInt(classId[0])
                },
                select:{
                    id: true,
                    title: true,
                    content: true,
                    attachment: true,
                    status: true,
                    deadline: true,
                    answers: true,
                    classId: true
                }
            })
        }else {
            result = await prisma.assignment.findMany({
                where: {
                    teacherId: parseInt(teacherId[0])
                },
                select:{
                    id: true,
                    title: true,
                    content: true,
                    attachment: true,
                    status: true,
                    deadline: true,
                    answers: true,
                    classId: true,
                    class: {
                        select:{
                            name: true
                        }
                    }
                }
            })
        }
        res.status(200).json(result)
    }
    else res.status(405).json("Method not allowed!")
}