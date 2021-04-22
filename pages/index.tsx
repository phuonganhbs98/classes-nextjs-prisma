import React from "react";
import MainLayout from "../components/layouts/MainLayout";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useSession } from "next-auth/client"
import SignInForm from "./login";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const localizer = momentLocalizer(moment);

type Props = {};

const Blog: React.FC<Props> = (props) => {
  const [session, loading] = useSession();
  const spinIcon = <LoadingOutlined style={{ fontSize: 30 }} spin />;
  const events=[{
    id: 0,
    title: 'All Day Event very long title',
    // allDay: true,
    start: new Date('2021 04 12'),
    end: new Date('2021 04 12'),
  }]
  return (
    loading?(
      <div style={{ width: 44 }} key="1">
      <Spin indicator={spinIcon} />
    </div>
    ) :session?(
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
    </MainLayout>):
    (
      <SignInForm />
    )
  );
};

export default Blog;
