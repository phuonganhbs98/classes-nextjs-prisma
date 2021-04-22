import { Answer, AssignmentStatus, Class, ClassroomToStudent, ClassStatus } from ".prisma/client"

declare namespace API {
  type UserInfor = {
    id: number,
    role: Role,
    gender: Gender,
    birthDate: Date,
    phoneNumber: string,
    acceptedClasses: AcceptedClass[],
    createdClasses: Classroom[],
    createdAt: Date,
    email: string,
    image: string,
    name: string
  }

  type AcceptedClass = {
    classroom: Classroom
  }

  type Classroom = {
    id: number,
    name: string,
    capacity: number,
    students: ClassroomToStudent[],
    status: ClassStatus,
    teacher:{
      name: string
    },
  }

  type Schedules = {
    dayInWeek: number,
    startAt: Date,
    endAt: Date
}

  type AssignmentItem = {
    id: number,
    title: string,
    content: string,
    attachment: string,
    status: AssignmentStatus,
    deadline: Date,
    answers: Answer,
    classId: number
    class: {
      name: string
    },
    teacherId: number
  }

  type AnswerItem = {
    id: number,
    content: string,
    attachment: string,
    score: number,
    student: {
      name: string
    },
    studentId: number,
    assignmentId: number,
    assignment: {
      teacherId: number,
      content: string,
      title: string
    },
    status: string,
    createdAt: Date,
    updatedAt: Date
  }

  type RegisteredClass = {
    id: number,
    name: string,
    count: number,
    teacherName: string,
    status: ClassStatus,
    capacity: number
  }
}

