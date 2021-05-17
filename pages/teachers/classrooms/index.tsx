import React from "react";
import { PageHeader, Button } from "antd";
import MainLayout from "../../../components/layouts/MainLayout";
import ClassroomTableList from "../../classrooms/component/ClassroomTableList";

type Props = {}
const Classes: React.FC<Props> = () => {
  return (
    <MainLayout title="Danh sách lớp học">
        <ClassroomTableList isTeacher={true} />
    </MainLayout>
  );
};

export default Classes;