import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function answers(req: NextApiRequest, res: NextApiResponse) {
    const assignmentId = Array.isArray(req.query.assignmentId) ? undefined : parseInt(req.query.assignmentId)
    const studentId = Array.isArray(req.query.studentId) ? undefined : parseInt(req.query.studentId)
    const classId = Array.isArray(req.query.classId) ? undefined : parseInt(req.query.classId)
    const method = req.method
    if (method === 'GET') {
        let result = []
        if(Number.isNaN(classId)){
            result = await prisma.answer.findMany({
            where: {
                assignmentId: assignmentId,
                studentId: Number.isNaN(studentId)?undefined:studentId
            },
            include:{
                student: true,
                assignment: true
            }
        })
    }else {
        result = await prisma.answer.findMany({
            where:{
                assignment:{
                    classId: classId
                },
                studentId: studentId
            },
            include: {
                student: true,
                assignment: true
            }
        })
    }
        res.status(200).json(result)
    }
    else res.status(405).json("Method not allowed!")
}