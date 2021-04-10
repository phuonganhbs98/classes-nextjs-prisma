import { NextApiRequest, NextApiResponse } from "next-auth/_utils";
import prisma from "../../../lib/prisma";

export default async function findUnique(req: NextApiRequest, res: NextApiResponse){
    const method = req.method
    if(method === 'GET'){
        const id = parseInt(req.query.id[0])
        const result= await prisma.class.findUnique({
            where:{
                id: id
            },
            select:{
                id: true,
                name: true,
                teacherId: true,
                teacher:{
                    select:{
                        name: true
                    }
                },
                status: true,
                capacity: true,
                students: {
                    select:{
                        id: true
                    }
                },
                startAt: true,
                endAt: true,
                schedules: true
            }
        })
        res.status(200).json(result)
    }else if(method === 'DELETE'){
        const id = parseInt(req.query.id[0])
        await prisma.$transaction([
            prisma.schedule.deleteMany({
                where: {
                    classId: id
                }
            }),
            prisma.achievement.deleteMany({
                where:{
                    classId: id
                }
            }),
            prisma.answer.deleteMany({
                where: {
                    assignment: {
                        classId: id
                    }
                }
            }),
            prisma.assignment.deleteMany({
                where:{
                    classId: id
                }
            }),
            prisma.class.delete({
                where:{
                    id: id
                }
            })
        ])
        res.status(200).json("Delete success!")
    }
    else res.status(405).json("Method Not Allowed!")
}