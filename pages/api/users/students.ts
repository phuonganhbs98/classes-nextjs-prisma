import { NextApiRequest, NextApiResponse } from "next-auth/_utils";
import prisma from "../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const method = req.method
    const teacherId = Array.isArray(req.query.teacherId) ? null : parseInt(req.query.teacherId)
    const studentName = Array.isArray(req.query.studentName) ? undefined : req.query.studentName
    const className = Array.isArray(req.query.className) ? undefined : req.query.className
    if (method === 'GET') {
        const result = await prisma.user.findMany({
            where: {
                acceptedClasses: {
                    some: {
                        classroom: {
                            // is:{
                            teacherId: {
                                equals: teacherId
                            },
                            name:{
                                contains: className
                            }
                            // id: {
                            //     equals: classId
                            // }
                            // }
                        }
                    }
                },
                name: {
                    contains: studentName
                }
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
                createdClasses: {
                    include: {
                        teacher: true,
                        students: true
                    }
                }
            },
        })
        res.status(200).json(result)
    }
    else res.status(405).json("Method Not Allowed!")
}