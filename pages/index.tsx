import React, { useEffect, useState } from "react";
import MainLayout from "../components/layouts/MainLayout";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { API } from "../prisma/type/type";
import { getAllTimetableClass } from "../lib/timetable/timetable";

const localizer = momentLocalizer(moment);
type Props = {};

const Blog: React.FC<Props> = (props) => {
  const [events, setEvents] = useState<API.TimetableClassItem[]>([])
  const [userId, setUserId] = useState<number>(-1)
  useEffect(() => {
    setUserId(parseInt(localStorage.getItem('userId')))
  },[])
  useEffect(()=>{
    if(!Number.isNaN(userId) && userId!==-1){
      getAllTimetableClass(userId)
      .then(res => {
        setEvents(res)
      })
    }
  },[userId])
  return (
    <MainLayout title="Lịch học và dạy">
      <div style={{ padding: 16 }} className="site-layout-background">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
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
