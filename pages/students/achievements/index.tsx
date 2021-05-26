import React from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import AchievementTable from "./component/AchievementTable";
type Props = {};

const Achievements: React.FC<Props>= () => {
  
  return (
    <MainLayout title="Thành tích học tập">
      <AchievementTable />
    </MainLayout>
  );
};

export default Achievements;
