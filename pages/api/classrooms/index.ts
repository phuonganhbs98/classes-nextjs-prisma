import { PrismaClient } from ".prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function create(req: NextApiRequest, res: NextApiResponse) {
    const method = req.method
    const selectData = {
        id: true,
        name: true,
        capacity: true,
        teacherId: true,
        teacher: {
            select: {
                name: true
            }
        },
        status: true,
        students: {
            select: {
                studentId: true
            }
        },
        startAt: true,
        endAt: true
    }

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
                        dayInWeek: parseInt(x.day)
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
                select: selectData,
                where: {
                    students: {
                        some: {
                            studentId: parseInt(studentId)
                        }
                    }
                }
            })
        }
        else {
            result = await prisma.class.findMany({
                select: selectData,
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
                }
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