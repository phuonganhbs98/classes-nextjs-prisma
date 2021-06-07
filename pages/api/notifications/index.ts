import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function manageNotification(req: NextApiRequest, res: NextApiResponse) {
    const method = req.method
    if (method === 'POST') {
        const data = req.body.data
        const [result] = await prisma.$transaction([
            prisma.notification.create({
                data: data
            })
        ])
        res.status(200).json(result)
    } else if (method === 'GET') {
        const classId = parseInt(Array.isArray(req.query.classId) ? null : req.query.classId)
        const studentId = parseInt(Array.isArray(req.query.studentId) ? null : req.query.studentId)

        const result = await prisma.notification.findMany({
            orderBy: [
                {
                    updatedAt: 'desc'
                }
            ],
            where: {
                classId: Number.isNaN(classId)?undefined:classId,
                classroom:Number.isNaN(studentId)?undefined:{
                    students:{
                        some:{
                            studentId: studentId,
                        }
                    }
                }
            },
            include:{
                notiComment:{
                    orderBy:{
                        updatedAt: 'desc'
                    }
                },
                classroom: true
            }
        })
        res.status(200).json(result)
    }
    else res.status(405).json("Method not allowed!")
}