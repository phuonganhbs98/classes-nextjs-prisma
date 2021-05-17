import { RegisterStatus } from ".prisma/client";
import { NextApiRequest, NextApiResponse } from "next-auth/_utils";
import prisma from "../../../../lib/prisma";

export default async (req:NextApiRequest, res: NextApiResponse) => {
    const method = req.method
    const classId = Array.isArray(req.query.id)?0:parseInt(req.query.id)
    if(method === 'GET'){
        const result = await prisma.register.findMany({
            where:{
                classId: classId,
                status: RegisterStatus.REGISTERED
            },
            select: {
                student:{
                    select:{
                        id: true,
                        name: true,
                        email: true,
                        phoneNumber: true
                    }
                }
            }
        })
        res.status(200).json(result)
    }
    else res.status(405).json("Method Not Allowed!")
}