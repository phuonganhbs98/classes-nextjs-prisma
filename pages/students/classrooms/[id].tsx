import React from "react";
import { useRouter } from "next/router";
import ClassDetail from "../../classrooms/component/ClassDetail";
import MainLayout from "../../../components/layouts/MainLayout";
import { Tabs } from "antd";
import AssignmentList from "../../../components/classroom/AssignmentList";

const ClassroomInfor: React.FC = () => {
    const router = useRouter()
    const id = parseInt(router.query.id)

    return (
        <MainLayout title="Thông tin lớp học">
            <ClassDetail id={id} isTeacher={false} />
            <div className="site-layout-background content">
                <Tabs defaultActiveKey="1" >
                    <Tabs.TabPane tab="Bài tập" key="3">
                        <AssignmentList
                            isTeacher={false}
                            classId={id}
                        />
                    </Tabs.TabPane>
                </Tabs>
            </div>
        </MainLayout>
    )
}

export default ClassroomInfor;