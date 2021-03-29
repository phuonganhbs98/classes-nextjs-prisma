import React, { useState } from "react";
import { PageHeader, Button } from "antd";
import MainLayout from "../../components/layouts/MainLayout";
import Link from "next/link";

const Classes: React.FC = () => {
  const [create, setCreate] = useState(false)
  return (
    <MainLayout title="Danh sách lớp học">
      <Link key="1" href="/classrooms/create">
        <Button>Tạo lớp mới</Button>
      </Link>
    </MainLayout>
  );
};

export default Classes;
