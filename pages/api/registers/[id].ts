import { RegisterStatus } from ".prisma/client";
import { NextApiRequest, NextApiResponse } from "next-auth/_utils";
import prisma from "../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const method = req.method
    const id = parseInt(req.query.id[0])
    if(method === 'GET'){
        const result = await prisma.register.findMany({
            where:{
                studentId: id,
                status: RegisterStatus.REGISTERED
            },
            select:{
                classroom: {
                    select:{
                        id: true,
                        name: true,
                        students:true,
                        teacher: {
                            select:{
                                name: true
                            }
                        },
                        status: true,
                        capacity: true
                    }
                }
            }
        })
        res.status(200).json(result)
    }
    else res.status(405).json("Method Not Allowed!")
}