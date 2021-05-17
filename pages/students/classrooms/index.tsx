import React, { useState } from "react";
import { PageHeader } from "antd";
import MainLayout from "../../../components/layouts/MainLayout";
import { useRouter } from "next/router";
import { API } from "../../../prisma/type/type";
import ClassroomTableList from "../../classrooms/component/ClassroomTableList";

type Props = {}
const Classes: React.FC<Props> = () => {
  return (
    <MainLayout title="Danh sách lớp học">
        <ClassroomTableList isTeacher={false} />
    </MainLayout>
  );
};

export default Classes;