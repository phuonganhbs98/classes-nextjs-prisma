import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

export default async function submitAssignment(req: NextApiRequest, res: NextApiResponse) {
    const method = req.method
    if (method === 'POST') {
        const {
            content,
            attachment,
            assignmentId,
            studentId,
            status
        } = req.body.data
        const [answer] = await prisma.$transaction([
        prisma.answer.create({
                data: {
                    content: content,
                    attachment: attachment,
                    assignmentId: assignmentId,
                    studentId: studentId,
                    status: status
                }
            })

        ])
        res.status(200).json(answer)
    }
    else if(method==='GET'){
         const assignmentId = parseInt(req.query.assignmentId[0])   
     const studentId = parseInt(req.query.studentId[0])   
     const result = await prisma.answer.findUnique({
         where:{
             studentId_assignmentId:{
                 studentId: studentId,
                 assignmentId: assignmentId
             },
         },
         select:{
            id: true,
            content: true,
            attachment: true,
            score: true,
            student:{
                select:{
                    name: true
                }
            },
            studentId: true,
            assignmentId: true,
            assignment:{
                select:{
                    content: true,
                    title: true
                }
            },
            createdAt: true,
            updatedAt: true,
            status: true
        }
     })
     res.status(200).json(result)
    }
    else res.status(405).json('Method Not Allowed!')
}