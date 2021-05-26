import { NextApiRequest, NextApiResponse } from "next";
import { setTimeToZero } from "../../../lib/formatDate";
import prisma from "../../../lib/prisma";
import { API } from "../../../prisma/type/type";

export default async function manageAttendance(req: NextApiRequest, res: NextApiResponse) {
    const method = req.method
    if(method==='POST'){
        let result =[]
        const data: API.Attendance[] = req.body.data
        console.log(data)
        data.forEach(async (x: any)=>{
            result = await prisma.$transaction([
                prisma.attendance.create({
                    data: x
                })
            ])  
        })
        res.status(200).json(result)
    }
    else if(method === 'GET'){
        const classId = Array.isArray(req.query.classId)?null:parseInt(req.query.classId)
        const date = Array.isArray(req.query.date)?undefined:setTimeToZero(new Date(req.query.date))
        console.log(new Date(date).toLocaleDateString())
        console.log(new Date(date).toLocaleDateString() === '5/3/2021')
        const result = await prisma.attendance.findMany({
            where:{
                classId: Number.isNaN(classId)?undefined:classId,
                time: new Date(date).toLocaleDateString()        
            },
            include:{
                student: true,
            }
        })
        res.status(200).json(result)
    }
    else res.status(405).json("Method not allowed!")
}