import { NextApiRequest, NextApiResponse } from "next-auth/_utils";
import prisma from "../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const method = req.method
    const id = Array.isArray(req.query.id) ? 0 : parseInt(req.query.id)
    if (method === 'GET') {
        const result = await prisma.user.findUnique({
            where: {
                id: id
            },
            include: {
                acceptedClasses: {
                    include: {
                        classroom: {
                            include: {
                                teacher: true,
                                students: true
                            }
                        }
                    }
                },
                createdClasses:{
                    include:{
                        teacher: true,
                        students: true
                    }
                }
            },
        })
        res.status(200).json(result)
    } else if (method === 'PUT') {
        const data = req.body.data
        const [result] = await prisma.$transaction([
            prisma.user.update({
                data: data,
                where: {
                    id: id
                }
            })
        ])
        res.status(200).json(result)
    }
    else res.status(405).json("Method Not Allowed!")
}