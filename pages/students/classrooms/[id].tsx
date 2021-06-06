import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ClassDetail from "../../classrooms/component/ClassDetail";
import MainLayout from "../../../components/layouts/MainLayout";
import { Tabs } from "antd";
import AssignmentList from "../../assignments/component/AssignmentList";
import FileUpload from "../../../components/classroom/FileUpload";
import NotificationTab from "../../classrooms/component/NotificationTab";
import checkRegister, { checkStudentOfClass } from "../../../lib/register/checkRegister";

const ClassroomInfor: React.FC = () => {
    const router = useRouter()
    const [visible, setVisible] = useState<boolean>(false)
    let id = -1
    if (!Array.isArray(router.query?.id)) {
        id = parseInt(router.query.id)
    }

    useEffect(() => {
        const userId = localStorage.getItem('userId')
        if (id !== -1 && !Number.isNaN(id)) {
            checkStudentOfClass(parseInt(userId), id)
                .then(res => {
                    if (res.length > 0) setVisible(true)
                    else setVisible(false)
                })
        }
    }, [id])

    return (
        <MainLayout title="Thông tin lớp học">
            <ClassDetail id={id} isTeacher={false} />
            {visible ? <div className="site-layout-background content">
                <Tabs defaultActiveKey="1" >
                    <Tabs.TabPane tab="Thông báo" key="1">
                        <NotificationTab
                            classId={id}
                            isTeacher={false}
                        />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Bài tập" key="3">
                        <AssignmentList
                            isTeacher={false}
                            classId={id}
                        />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Files" key="4">
                        <FileUpload
                            isTeacher={false}
                            classId={id}
                        />
                    </Tabs.TabPane>
                </Tabs>
            </div> : null}
        </MainLayout>
    )
}

export default ClassroomInfor;