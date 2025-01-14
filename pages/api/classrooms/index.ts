import { PrismaClient } from ".prisma/client";
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
        } = req.body.data

        let newSchedules = []
        if (schedules) {
            schedules.forEach((x: any) => {
                newSchedules = [
                    ...newSchedules,
                    {
                        startAt: x.startAt,
                        endAt: x.endAt,
                        dayInWeek: parseInt(x.dayInWeek)
                    }
                ]
            });
        }
        const [result] = await prisma.$transaction([
            prisma.class.create({
                include: {
                    schedules: true,
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
        ])
        res.status(200).json(result)
    } else if (method === 'GET') {
        const name = Array.isArray(req.query.name) ? null : req.query.name
        const teacherName = Array.isArray(req.query.teacherName) ? null : req.query.teacherName
        const studentId = Array.isArray(req.query.studentId) ? null : req.query.studentId
        let teacherIdParam = Array.isArray(req.query.teacherId) ? null : req.query.teacherId
        let teacherId = undefined
        if (typeof teacherIdParam !== 'undefined') teacherId = parseInt(teacherIdParam)
        let result = null
        if (typeof studentId !== 'undefined') {
            result = await prisma.class.findMany({
                where: {
                    students: {
                        some: {
                            studentId: parseInt(studentId)
                        }
                    }
                },
                include: {
                    teacher: true,
                    students: true
                },
                orderBy: [
                    {
                        createdAt: 'desc'
                    }
                ]
            })
        }
        else {
            result = await prisma.class.findMany({
                where: {
                    name: {
                        contains: name
                    },
                    teacher: {
                        name: {
                            contains: teacherName
                        }
                    },
                    teacherId: teacherId
                },
                include: {
                    teacher: true,
                    students: true
                },
                orderBy: [
                    {
                        updatedAt: 'desc'
                    }
                ]
            })
        }
        res.status(200).json(result)
    } else if (method === 'PUT') {
        const {
            id,
            status,
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