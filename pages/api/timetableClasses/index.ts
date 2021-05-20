import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { API } from "../../../prisma/type/type";

export default async function manageTimetable(req: NextApiRequest, res: NextApiResponse) {
    const method = req.method
    const selectData = {
        id: true,
        teacherId: true,
        title: true,
        start: true,
        end: true,
        classId: true,
    }

    if (method === 'POST') {
        const data: API.TimetableClassItem[] = req.body.data
        let result=[]
        data.forEach(async (x: API.TimetableClassItem) => {
            const [timetable] = await prisma.$transaction([
                prisma.timetableClass.create({
                    data: x,
                })
            ])
            result = [...result, timetable] 
        })
        res.status(200).json(result)
    } else if (method === 'GET') {
        const teacherId = Array.isArray(req.query.teacherId) ? null : req.query.teacherId
        console.log('teacherId: ' + teacherId)

        const result = await prisma.timetableClass.findMany({
            select: selectData,
            where: {
                teacherId: parseInt(teacherId)
            }
        })
        res.status(200).json(result)
    }
    else res.status(405).json("Method not allowed!")
}