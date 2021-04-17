import { RegisterStatus } from ".prisma/client";
import { NextApiRequest, NextApiResponse } from "next-auth/_utils";
import prisma from "../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const method = req.method
    const studentId = parseInt(req.query.id[0])
    if (method === 'GET') {
        let result = null
        if (req.query.id[1]) { //check register
            const classId = parseInt(req.query.id[1])
            result = await prisma.register.findUnique({
                where: {
                    studentId_classId: {
                        studentId: studentId,
                        classId: classId
                    }
                }
            })
        } else {// lay cac lop da dang ky
            result = await prisma.register.findMany({
                where: {
                    studentId: studentId,
                    status: RegisterStatus.REGISTERED
                },
                select: {
                    classroom: {
                        select: {
                            id: true,
                            name: true,
                            students: true,
                            teacher: {
                                select: {
                                    name: true
                                }
                            },
                            status: true,
                            capacity: true
                        }
                    }
                }
            })
        }
        res.status(200).json(result)
    } else if (method === 'POST') {
        const classId = parseInt(req.query.id[1])
        await prisma.$transaction([
            prisma.register.create({
                data: {
                    studentId: studentId,
                    classId: classId
                }
            })
        ])
        res.status(200).json("Register success!")
    } else if (method === 'DELETE') {
        const classId = parseInt(req.query.id[1])
        const register = await prisma.register.findUnique({
            where:{
                studentId_classId:{
                    studentId: studentId,
                    classId: classId
                }
            }
        })
        if(register.status === RegisterStatus.REGISTERED){
            await prisma.$transaction([
                prisma.register.delete({
                    where: {
                        studentId_classId: {
                            studentId: studentId,
                            classId: classId
                        }
                    }
                })
            ])
        }
        else {
            await prisma.$transaction([
                prisma.register.delete({
                    where:{
                        studentId_classId:{
                            studentId: studentId,
                            classId: classId
                        }
                    }
                }),
                prisma.classroomToStudent.delete({
                    where:{
                        studentId_classId:{
                            studentId: studentId,
                            classId: classId
                        }
                    }
                })
            ])
        }
        
        res.status(200).json("Cancel register success!")
    } else if (method === 'PUT') {
        const classId = parseInt(req.query.id[1])
        let student = await prisma.user.findUnique({
            where: {
                id: studentId
            }
        })
        await prisma.$transaction([
            prisma.register.update({
                where: {
                    studentId_classId: {
                        studentId: studentId,
                        classId: classId
                    }
                },
                data: {
                    status: RegisterStatus.ACCEPTED
                }
            }),

            prisma.classroomToStudent.create({
                data:{
                    studentId: studentId,
                    classId: classId
                }
            })
        ])
        res.status(200).json("Accepted!")
    }
    else res.status(405).json("Method Not Allowed!")
}