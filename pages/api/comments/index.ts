import { PrismaClient } from ".prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function manageComment(req: NextApiRequest, res: NextApiResponse) {
    // const prisma = new PrismaClient()
    const method = req.method
    const selectData = {
        id: true,
        userId: true,
        avatar: true,
        answerId: true,
        content: true,
        author: true,
        createdAt: true,
        updatedAt: true
    }

    if(method==='POST'){
        const data = req.body.data
        console.log(data)
        const [result] = await prisma.$transaction([
            prisma.comment.create({
                data: data
            })
        ])
        res.status(200).json(result)
    }else if(method === 'GET'){
        const answerId = Array.isArray(req.query.answerId)?null:req.query.answerId
        console.log('answerId: ' +answerId)

        const result = await prisma.comment.findMany({
            select: selectData,
            where:{
                answerId: parseInt(answerId)
            }
        })
        res.status(200).json(result)
    }
    else res.status(405).json("Method not allowed!")
}