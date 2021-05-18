import React from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import AssignmentTableList from "../../assignments/component/AssignmentTableList";

const Assignments: React.FC = () => {
  
  return (
    <MainLayout title="Danh sách bài tập">
      <AssignmentTableList isTeacher={false} />
    </MainLayout>
  );
};

export default Assignments;
