import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function manageNotiComment(req: NextApiRequest, res: NextApiResponse) {
    const method = req.method
    if(method==='POST'){
        const data = req.body.data
        // console.log(data)
        const [result] = await prisma.$transaction([
            prisma.notiComment.create({
                data: data
            })
        ])
        res.status(200).json(result)
    }else if(method === 'GET'){
        const notiId = Array.isArray(req.query.notiId)?null:req.query.notiId
        // console.log('answerId: ' +answerId)

        const result = await prisma.notiComment.findMany({
            where:{
                notiId: parseInt(notiId)
            }
        })
        res.status(200).json(result)
    }
    else res.status(405).json("Method not allowed!")
}