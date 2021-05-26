import { Tabs } from "antd";
import React, { useEffect, useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { getAllClassroom } from "../../../lib/classroom/getClassroomInfor";
import { API } from "../../../prisma/type/type";
import AssignmentList from "../../assignments/component/AssignmentList";

const UnfinishedAssignments: React.FC = () => {
  const [classess, setClassess] = useState<API.Classroom[]>([])
  useEffect(() => {
    const userId = parseInt(localStorage.getItem('userId'))
    getAllClassroom({ studentId: userId })
      .then(res => {
        setClassess(res)
      })
  },[])
  return (
    <MainLayout title="Bài tập chưa hoàn thành">
      <div className="site-layout-background">
        <Tabs
          defaultActiveKey="1"
          tabPosition='top'
        >
          {classess.map((i: API.Classroom) => (
            <Tabs.TabPane tab={`Lớp ${i.name}`} key={i.id} >
              <AssignmentList
                classId={i.id}
                isTeacher={false}
                done={false}
              />
            </Tabs.TabPane>
          ))}
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default UnfinishedAssignments;
