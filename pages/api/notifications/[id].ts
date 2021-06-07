import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function manageNotification(req: NextApiRequest, res: NextApiResponse) {
    const method = req.method
    const id = Array.isArray(req.query.id) ? null : req.query.id
    if (method === 'GET') {
        const result = await prisma.notification.findUnique({
            where: {
                id: parseInt(id)
            },
            include:{
                classroom: true
            }
        })
        res.status(200).json(result)
    } else if(method === 'PUT'){
        const {content} = req.body.data
        const result = await prisma.$transaction([
            prisma.notification.update({
                where:{
                    id: parseInt(id)
                },
                data:{
                    content: content
                }
            })
        ])
        res.status(200).json(result)
    }else if(method === 'DELETE'){
        await prisma.$transaction([
            prisma.notiComment.deleteMany({
                where:{
                    notiId: parseInt(id)
                }
            }),
            prisma.notification.delete({
                where:{
                    id: parseInt(id)
                }
            })
        ])
        res.status(200).json('ok')
    }
    else res.status(405).json("Method not allowed!")
}