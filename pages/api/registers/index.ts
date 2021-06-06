import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function checkStudent(req: NextApiRequest, res: NextApiResponse) {
    const method = req.method
    if(method==='GET'){
       const studentId = parseInt(Array.isArray(req.query.studentId) ? null : req.query.studentId)
       const classId = parseInt(Array.isArray(req.query.classId) ? null : req.query.classId)
       const result = await prisma.classroomToStudent.findMany({
           where:{
               studentId:Number.isNaN(studentId)?undefined:studentId,
               classId: Number.isNaN(classId)?undefined:classId,
           }
       })
        res.status(200).json(result)
    }
    else res.status(405).json("Method not allowed!")
}