import { Answer, AssignmentStatus, AttendanceStatus, Class, ClassroomToStudent, ClassStatus } from ".prisma/client"

declare namespace API {
  type UserInfor = {
    id: number,
    role: Role,
    gender: Gender,
    birthDate: Date,
    phoneNumber: string,
    acceptedClasses?: AcceptedClass[],
    createdClasses?: Classroom[],
    createdAt: Date,
    email: string,
    image: string,
    name: string,
    attendance: Attendance[],
    presents?: Attendance[];
    absences?: Attendance[];
    total?: number;
    answers?: AnswerItem[],
    assignments?: AssignmentItem[],
    averagePoint?: number
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
    schedules: Schedules[],
    assignments: AssignmentItem[]
  }

  type Schedules = {
    dayInWeek: number,
    startAt: Date,
    endAt: Date,
    day: string
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
    assignment: AssignmentItem,
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
    answerId?: number,
    notiId?: number,
    content: string,
    avatar: string,
    datetime?: string,
    createdAt?: Date,
    updatedAt?: Date,
    author: string
  }

  type TimetableClassItem = {
    id?: number,
    title: string,
    start: Date,
    end: Date,
    classId: number,
    teacherId: number,
    tooltip?: string
  }

  type TimetableStudentItem = {
    id?: number,
    studentId: number,
    timeTable?: TimetableClassItem,
    timeTableId: number,
    student?: API.UserInfor
  }

  type Period = {
    startTime: Date,
    endTime: Date
  }

  type Attendance = {
    id?: number,
    classId: number,
    time: string,
    no?: number,
    studentId: number,
    status?: string,
    student?: UserInfor
  }

  type UpdateStatusAttendance = {
    id: number,
    status: AttendanceStatus
  }

  type AttendanceStatistic = {
    presents: Attendance[];
    absences: Attendance[];
    total: number;
  }

  type AchievementItem = {
    title: string,
    score: number
  }

  type AchievementOfStudent = {
    id?: number,
    student: UserInfor,
    achievements?: AchievementItem[],
    averagePoint: number,
    answers?: API.AnswerItem[]
  }

  type FileUpload = {
    uid: number,
    url: string,
    name: string,
    status: string
  }

  type NotificationItem ={
    id?: number,
    classId: number,
    classroom?: Classroom,
    content: string,
    notiComment?: CommentItem[],
    createdAt?: Date,
    updatedAt?: Date
  }
}

