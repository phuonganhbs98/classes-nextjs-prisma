import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function getAllStudents(req: NextApiRequest, res: NextApiResponse) {
    const method = req.method
    if (method === 'GET') {
        const classId = Array.isArray(req.query.classId) ? undefined : parseInt(req.query.classId)
        const result = await prisma.user.findMany({
            where: {
                acceptedClasses: {
                    some: {
                        classId: Number.isNaN(classId) ? undefined : classId
                    }
                }
            },
            include: {
                attendance: true,
                assignments: true,
                answers:{
                    include:{
                        assignment: true
                    }
                }
            }
        })
        res.status(200).json(result)
    }
    else res.status(405).json("Method not allowed!")
}