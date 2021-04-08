import { PrismaClient } from "@prisma/client";

export default async function updateStatusClass(id: number) {
    const prisma = new PrismaClient()
    const currentClass = await prisma.class.findUnique({
        where: {
            id: id
        }
    })
    const now = new Date();
    let status = ''
    if (now < currentClass.startAt) {
        status = 'PREPARE'
    } else if (now > currentClass.endAt) {
        status = 'FINISHED'
    } else status = 'STUDYING'
    if (status !== currentClass.status) {
        const update = {
            id: id,
            status: status
        }
        const res = await fetch('http://localhost:3000/api/classrooms', {
            body: JSON.stringify(update),
            method: 'PUT'
        })
    }




}