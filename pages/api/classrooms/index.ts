import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function create(req: NextApiRequest, res: NextApiResponse) {
    const method = req.method
    if (method === 'POST') {
        const {
            name,
            capacity,
            schedules,
            startAt,
            endAt,
            teacherId
        } = JSON.parse(req.body)

        let newSchedules=[]
        if (schedules) {
            schedules.forEach((x:any) => {
                newSchedules=[
                    ...newSchedules,
                    {
                        startAt: x.startAt,
                        endAt: x.endAt,
                        dayInWeek: parseInt(x.day)
                    }
                ]
            });
        }
         await prisma.class.create({
            include: {
                schedules: true
            },
            data: {
                name: name,
                capacity: capacity,
                startAt: startAt,
                endAt: endAt,
                teacherId: teacherId,
                schedules: {
                    create: newSchedules
                }
            }
        })
        res.status(200).json("success")
    } else if (method === 'GET') {
        const result = await prisma.class.findMany({
            select:{
                id: true,
                name: true,
                capacity: true,
                teacherId: true,
                teacher: {
                    select:{
                        name: true
                    }
                },
                status: true,
                students: {
                    select:{
                        studentId: true
                    }
                }
            }
        })
        res.status(200).json(result)
    }else if(method === 'PUT'){
        const {
           id,
           status
        } = JSON.parse(req.body)
        await prisma.class.update({
            where: {
                id: id
            },
            data: {
                status: status
            }
        })
        res.status(200).json("OK")
    }
    else res.status(405).json("Method not allowed!")
}