import { AssignmentStatus } from ".prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function assignmentItemManager(req: NextApiRequest, res: NextApiResponse) {
    const method = req.method
    const id = Array.isArray(req.query.id) ? 0 : parseInt(req.query.id)
    if (method === 'GET') {
        const result = await prisma.assignment.findUnique({
            where: {
                id: id
            },
            include:{
                answers: true,
                class: true
            }
            // select: {
            //     id: true,
            //     title: true,
            //     content: true,
            //     attachment: true,
            //     status: true,
            //     deadline: true,
            //     answers: {
            //         select: {
            //             id: true,
            //             updatedAt: true,
            //             status: true
            //         }
            //     },
            //     classId: true,
            //     class: {
            //         select: {
            //             name: true
            //         }
            //     },
            //     teacherId: true
            // }
        })
        res.status(200).json(result)
    } else if (method === 'PUT') {
        const {
            title,
            content,
            attachment,
            deadline,
            status
        } = req.body.data
        const [result] = await prisma.$transaction([
            prisma.assignment.update({
                where: {
                    id: id
                },
                data: {
                    title: title,
                    content: content,
                    attachment: attachment,
                    deadline: deadline,
                    status: status
                }
            })
        ])
        res.status(200).json(result)
    } else if (method === 'DELETE') {
        await prisma.$transaction([
            prisma.answer.deleteMany({
                where: {
                    assignmentId: id
                }
            }),
            prisma.assignment.delete({
                where: {
                    id: id
                }
            })
        ])
        res.status(200).json('ok')
    }
    else res.status(405).json("Method not allowed!")
}