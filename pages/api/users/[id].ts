import { NextApiRequest, NextApiResponse } from "next-auth/_utils";
import prisma from "../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const method = req.method
    const id = parseInt(req.query.id[0])
    if (method === 'GET') {
        const result = await prisma.user.findUnique({
            where: {
                id: id
            },
            select: {
                id: true,
                role: true,
                gender: true,
                birthDate: true,
                phoneNumber: true,
                acceptedClasses: {
                    select: {
                        classroom: {
                            select: {
                                id: true,
                                name: true,
                                capacity: true,
                                students: true,
                                status: true,
                                teacher: {
                                    select: {
                                        name: true
                                    }
                                }
                            }
                        }
                    }
                },
                createdClasses: {
                    select: {
                        id: true,
                        name: true,
                        capacity: true,
                        students: true,
                        status: true,
                        teacher: {
                            select: {
                                name: true
                            }
                        }
                    }
                },
                createdAt: true,
                email: true,
                image: true,
                name: true
            }
        })
        res.status(200).json(result)
    }
    else res.status(405).json("Method Not Allowed!")
}