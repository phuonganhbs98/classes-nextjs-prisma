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
    students: StudentAndClassroom[],
    status: string,
    teacher: {
      name: string
    },
    teacherId: number,
    startAt: Date,
    endAt: Date,
    schedules: Schedules[]
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
    status: string,
    deadline: Date,
    answers: AnswerItem[],
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

  type StudentAndClassroom = {
    studentId: number,
    classId: number,
    student: StudentInfor,
    classroom: Classroom
  }

  type StudentInfor = {
    id: number,
    name: string,
    email: string,
    phoneNumber: string
  }

  type CommentItem = {
    id?: number,
    userId: number,
    answerId: number,
    content: string,
    avatar: string,
    datetime?: string,
    createdAt?: Date,
    author: string
  }

  type TimetableClassItem = {
    id?: number,
    title: string,
    start: Date,
    end: Date,
    classId: number,
    teacherId: number
  }

  type TimetableStudentItem = {
    id?: number,
    title: string,
    start: Date,
    end: Date,
    studentId: number
  }

  type Period ={
    startTime: Date,
    endTime: Date
  }
}

