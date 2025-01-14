import { id } from "date-fns/locale";
import { NextApiRequest, NextApiResponse } from "next-auth/_utils";
import prisma from "../../../lib/prisma";

export default async function findUnique(req: NextApiRequest, res: NextApiResponse) {
    const method = req.method
    const id = Array.isArray(req.query.id) ? 0 : parseInt(req.query.id)
    if (method === 'GET') {
        const result = await prisma.class.findUnique({
            where: {
                id: id
            },
            include: {
                teacher: true,
                students: {
                    include: {
                        student: true
                    }
                },
                assignments: {
                    include: {
                        answers: true
                    }
                },
                schedules: true
            }
        })
        res.status(200).json(result)
    } else if (method === 'DELETE') {
        await prisma.$transaction([
            prisma.timetableClass.deleteMany({
                where:{
                    classId: id
                }
            }),
            prisma.schedule.deleteMany({
                where: {
                    classId: id
                }
            }),
            prisma.achievement.deleteMany({
                where: {
                    classId: id
                }
            }),
            prisma.answer.deleteMany({
                where: {
                    assignment: {
                        classId: id
                    }
                }
            }),
            prisma.assignment.deleteMany({
                where: {
                    classId: id
                }
            }),
            prisma.class.delete({
                where: {
                    id: id
                }
            })
        ])
        res.status(200).json("Delete success!")
    } else if (method === 'PUT') {
        const {
            name, capacity, startAt, endAt, status
        } = req.body.data
        await prisma.$transaction([
            prisma.class.update({
                data: {
                    name: name,
                    capacity: capacity,
                    startAt: startAt,
                    endAt: endAt,
                    status: status
                },
                where: {
                    id: id
                }
            })
        ])
        res.status(200).json("Delete success!")
    }
    else res.status(405).json("Method Not Allowed!")
}