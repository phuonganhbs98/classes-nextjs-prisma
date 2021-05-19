import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function answerDetail(req: NextApiRequest, res: NextApiResponse) {
    const method = req.method
    const id = Array.isArray(req.query.id)?0:parseInt(req.query.id)
    if (method === 'GET') {
        const result = await prisma.answer.findUnique({
            where: {
                id: id
            },
            select: {
                id: true,
                content: true,
                attachment: true,
                score: true,
                student: {
                    select: {
                        name: true
                    }
                },
                studentId: true,
                assignmentId: true,
                assignment: {
                    select: {
                        teacherId: true,
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
    } else if (method === 'PUT') {
        if (req.body.data.score) {
            const score = req.body.data
            await prisma.$transaction([
                prisma.answer.update({
                    where: {
                        id: id
                    },
                    data: {
                        score: score
                    }
                })
            ])
        } 
        // else if(req.body.data.status){
        //     const {status} = req.body.data
        //     await prisma.$transaction([
        //         prisma.answer.update({
        //             where: {
        //                 id: id
        //             },
        //             data: {
        //                 status: status
        //             }
        //         })
        //     ])
        // res.status(200).json('ok')
        // }
        else {
            const {
                content,
                attachment,
                updatedAt,
                status,
            } = req.body.data
            await prisma.$transaction([
                prisma.answer.update({
                    where: {
                        id: id
                    },
                    data: {
                        content: content,
                        attachment: attachment,
                        updatedAt: updatedAt,
                        status: status
                    }
                })
            ])
        }

        res.status(200).json('ok')
    }
    else res.status(405).json("Method Not Allowwed!")
}