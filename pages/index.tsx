import React from "react";
import MainLayout from "../components/layouts/MainLayout";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useSession } from "next-auth/client"
import SignInForm from "./login";

const localizer = momentLocalizer(moment);

type Props = {};

const Blog: React.FC<Props> = (props) => {
  const [session, loading] = useSession();
  // const router = useRouter()
  return (
    session?(
    <MainLayout title="Lịch học và dạy">
      <div style={{ padding: 16 }}>
        <Calendar
          localizer={localizer}
          events={[]}
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
