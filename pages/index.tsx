import React from "react";
import MainLayout from "../components/layouts/MainLayout";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";

const localizer = momentLocalizer(moment);

type Props = {};

const Blog: React.FC<Props> = (props) => {
  return (
    <MainLayout title="Lịch học và dạy">
      <div style={{ padding: 16 }}>
        <Calendar
          localizer={localizer}
          events={[]}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
        />
      </div>
    </MainLayout>
  );
};

export default Blog;
