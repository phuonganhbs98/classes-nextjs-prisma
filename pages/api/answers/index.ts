import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function answers(req: NextApiRequest, res: NextApiResponse) {
    const assignmentId = req.query.assignmentId[0]
    const method = req.method
    if (method === 'GET') {
        const result = await prisma.answer.findMany({
            where: {
                assignmentId: parseInt(assignmentId)
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
                        content: true,
                        title: true
                    }
                },
                status: true
            }
        })
        res.status(200).json(result)
    }
    else res.status(405).json("Method not allowed!")
}