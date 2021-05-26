import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { API } from "../../../prisma/type/type";

export default async function manageTimetable(req: NextApiRequest, res: NextApiResponse) {
    const method = req.method

    if (method === 'POST') {
        const data: API.TimetableClassItem[] = req.body.data
        let result = []
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
        const teacherId = Array.isArray(req.query.teacherId) ? null : parseInt(req.query.teacherId)
        const classId = Array.isArray(req.query.classId) ? null : parseInt(req.query.classId)
        console.log('teacherId: ' + teacherId)

        const result = await prisma.timetableClass.findMany({
            where: {
                teacherId: Number.isNaN(teacherId)?undefined:teacherId,
                classId: Number.isNaN(classId)?undefined:classId,
            }
        })
        res.status(200).json(result)
    } else if (method === 'PUT') {
        const {
            classId, title
        } = req.body.data

        const result = await prisma.timetableClass.updateMany({
            data: {
                title: title
            },
            where: {
                classId: parseInt(classId)
            }
        })
        res.status(200).json(result)
    }
    else res.status(405).json("Method not allowed!")
}