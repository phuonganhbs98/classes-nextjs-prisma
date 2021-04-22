import { AssignmentStatus } from ".prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function assignmentItemManager(req: NextApiRequest, res: NextApiResponse) {
    const method = req.method
    const id = parseInt(req.query.id[0])
    if (method === 'GET') {
        const result = await prisma.assignment.findUnique({
            where: {
                id: id
            },
            select: {
                id: true,
                title: true,
                content: true,
                attachment: true,
                status: true,
                deadline: true,
                answers: true,
                classId: true,
                class: {
                    select: {
                        name: true
                    }
                },
                teacherId: true
            }
        })
        res.status(200).json(result)
    } else if (method === 'PUT') {
        if (!req.body.data.status) {
            const {
                title,
                content,
                attachment,
                deadline
            } = req.body.data
            await prisma.$transaction([
                prisma.assignment.update({
                    where: {
                        id: id
                    },
                    data: {
                        title: title,
                        content: content,
                        attachment: attachment,
                        deadline: deadline
                    }
                })
            ])
        } else {
            const {status} = req.body.data
            await prisma.$transaction([
                prisma.assignment.update({
                    where: {
                        id: id
                    },
                    data: {
                        status: status
                    }
                })
            ])
        }
        res.status(200).json('ok')
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