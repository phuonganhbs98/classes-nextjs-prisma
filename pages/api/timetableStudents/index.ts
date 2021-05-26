import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function manageTimetableStu(req: NextApiRequest, res: NextApiResponse) {
    const method = req.method

    if(method==='POST'){
        const dataInput:any[] = req.body.data
        let result = []
        console.log('--------timetable Student')
        console.log(dataInput)
        dataInput.forEach(async (x: any) => {
            const [timetable] = await prisma.$transaction([
                prisma.timetableStudent.create({
                    data: x
                })
            ])
            result = [...result, timetable]
        })
        res.status(200).json(result)
    }else if(method === 'GET'){
        const studentId = Array.isArray(req.query.studentId)?null:req.query.studentId
        console.log('studentId: ' +studentId)

        const result = await prisma.timetableClass.findMany({
            where:{
                TimetableStudent:{
                    some:{
                        studentId: parseInt(studentId)
                    }
                }
            },
            include:{
                classroom: true
            }
        })
        res.status(200).json(result)
    }
    else res.status(405).json("Method not allowed!")
}