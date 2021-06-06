import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function manageNotification(req: NextApiRequest, res: NextApiResponse) {
    const method = req.method
    if (method === 'POST') {
        const data = req.body.data
        console.log('-------- new notification: -------')
        console.log(data)
        const [result] = await prisma.$transaction([
            prisma.notification.create({
                data: data
            })
        ])
        res.status(200).json(result)
    } else if (method === 'GET') {
        const classId = Array.isArray(req.query.classId) ? null : req.query.classId
        console.log('classId: ' + classId)

        const result = await prisma.notification.findMany({
            orderBy: [
                {
                    updatedAt: 'desc'
                }
            ],
            where: {
                classId: parseInt(classId)
            },
            include:{
                notiComment:{
                    orderBy:{
                        createdAt: 'desc'
                    }
                }
            }
        })
        res.status(200).json(result)
    }
    else res.status(405).json("Method not allowed!")
}