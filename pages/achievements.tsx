import React from "react";
import { PageHeader } from "antd";
import MainLayout from "../components/layouts/MainLayout";
import { PrismaClient } from "@prisma/client";
import { useSession, getSession } from "next-auth/client";
type Props = {};

const Achievements: React.FC<Props>= () => {
  
  return (
    <MainLayout title="Bảng thành tích">
      <div></div>
    </MainLayout>
  );
};

export default Achievements;
