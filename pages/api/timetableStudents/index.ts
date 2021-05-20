import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function manageTimetable(req: NextApiRequest, res: NextApiResponse) {
    const method = req.method
    const selectData = {
        id: true,
        studentId: true,
        title: true,
        start: true,
        end: true,
    }

    if(method==='POST'){
        const data = req.body.data
        console.log(data)
        const [result] = await prisma.$transaction([
            prisma.timetableStudent.create({
                data: data
            })
        ])
        res.status(200).json(result)
    }else if(method === 'GET'){
        const studentId = Array.isArray(req.query.studentId)?null:req.query.studentId
        console.log('studentId: ' +studentId)

        const result = await prisma.timetableStudent.findMany({
            select: selectData,
            where:{
                studentId: parseInt(studentId)
            }
        })
        res.status(200).json(result)
    }
    else res.status(405).json("Method not allowed!")
}