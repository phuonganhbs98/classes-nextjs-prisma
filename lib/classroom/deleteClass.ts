import { PrismaClient } from "@prisma/client"

export default async function deleteClass(id: number){
    const prisma = new PrismaClient()
    await prisma.class.delete({
        where: {
            id: id
        }
    })
}