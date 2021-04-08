import axios from 'axios'
import updateStatusClass from './updateStatusClass'
import { Class, PrismaClient, User } from '@prisma/client'
export async function getAllClassroom() {
    let data = []
    const prisma = new PrismaClient()
    const teachers = await prisma.user.findMany({
        where: {
            role: 'TEACHER'
        }
    })
    teachers.forEach(x => {
        delete x.createdAt
        delete x.updatedAt
        delete x.birthDate
    })
    await axios.get("http://localhost:3000/api/classrooms").then(res => {
        data = res.data
        if (data) {
            data.forEach((x: Class) => {
                updateStatusClass(x.id)
            })
        }
    })
    return {
        data,
        teachers
    }
}

export async function getClassById(id: number) {
    const prisma = new PrismaClient()
    let teacher = null
    let classroom = null
    await updateStatusClass(id)
    await prisma.class.findUnique({
        where: {
            id: id
        }
    }).then(async clazz => {
        classroom = clazz
        teacher = await prisma.user.findUnique({
            where: {
                id: clazz.teacherId
            }
        })
        
    })
    const schedules = await prisma.schedule.findMany({
        where: {
            classId: id
        }
    })
    classroom = {
        ...classroom,
        startAtJson: classroom.startAt.toJSON(),
        endAtJson: classroom.endAt.toJSON(),
        teacherName: teacher.name,
        teacherImage: teacher.image
    }
    delete classroom.startAt
    delete classroom.endAt

    let schedulesData = []
    if (schedules.length > 0) {
        schedules.forEach(x => {
            schedulesData = [
                ...schedulesData,
                {
                    ...x,
                    startAtJson: x.startAt.toJSON(),
                    endAtJson: x.endAt.toJSON()
                }
            ]
        })
        schedulesData.forEach(x => {
            delete x.startAt
            delete x.endAt
        })
    } else {
        schedulesData = null
    }
    return {
        classroom,
        schedulesData
    }
}
