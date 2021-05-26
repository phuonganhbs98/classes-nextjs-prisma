import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function undoneAssignments(req: NextApiRequest, res: NextApiResponse) {
    const method = req.method
    if (method === 'GET') {
        const classId = Array.isArray(req.query.classId) ? '0' : req.query.classId
        const studentId = Array.isArray(req.query.studentId) ? '0' : req.query.studentId
        let result = null
            result = await prisma.assignment.findMany({
                where: {
                    classId: parseInt(classId),
                    answers:{
                        none:{
                            studentId: parseInt(studentId)
                        }
                    }
                },
                include: {
                    class: true
                }
            })
        res.status(200).json(result)
    }
    else res.status(405).json("Method not allowed!")
}