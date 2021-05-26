import React, { useEffect, useState } from "react";
import MainLayout from "../components/layouts/MainLayout";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { API } from "../prisma/type/type";
import { getAllTimetableClass, getAllTimetableOfStu } from "../lib/timetable/timetable";
import { useRouter } from "next/router";

const localizer = momentLocalizer(moment);
type Props = {};

const Blog: React.FC<Props> = (props) => {
  const [events, setEvents] = useState<API.TimetableClassItem[]>([])
  const [role, setRole] = useState<string>()
  const [userId, setUserId] = useState<number>(-1)
  const router = useRouter()
  useEffect(() => {
    setUserId(parseInt(localStorage.getItem('userId')))
    setRole(localStorage.getItem('role'))
  }, [])
  useEffect(() => {
    if (!Number.isNaN(userId) && userId !== -1) {
      if (role === 'TEACHER') {
        getAllTimetableClass({ teacherId: userId })
          .then(res => {
            setEvents(res.map(({ start, end, ...rest }) => {
              return {
                start: new Date(start),
                end: new Date(end),
                ...rest
              }
            }))
          })
      }
      else {
        getAllTimetableOfStu({ studentId: userId })
          .then(res => {
            setEvents(res.map(({ start, end, ...rest }) => {
              return {
                start: new Date(start),
                end: new Date(end),
                ...rest
              }
            }))
          })
      }
    }
  }, [userId, role])

  return (
    <MainLayout title="Lịch học và dạy">
      <div style={{ padding: 16 }} className="site-layout-background">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          onSelectEvent={(event: API.TimetableClassItem, e) => router.push({
            pathname: `/teachers/classrooms/attendance`,
            query: {
              classId: event.classId,
              day: event.start.toString()
            }
          }, `/teachers/classrooms/${event.classId}/attendance`)}
          style={{
            height: "calc(100vh - 24px - 70px - 64px - 16px - 16px)",
            minHeight: 500,
          }}
        />
      </div>
    </MainLayout>
  )
};

export default Blog;
