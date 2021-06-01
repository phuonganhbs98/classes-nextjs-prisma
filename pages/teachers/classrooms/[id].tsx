import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ClassDetail from "../../classrooms/component/ClassDetail";
import MainLayout from "../../../components/layouts/MainLayout";
import { Button, Tabs, Tooltip } from "antd";
import RegisterRequest from "../../../components/classroom/RegisterRequest";
import StudentList from "../../../components/classroom/StudentList";
import AssignmentList from "../../assignments/component/AssignmentList";
import { TrophyOutlined } from "@ant-design/icons";
import FileUpload from "../../../components/classroom/FileUpload";

const ClassroomInfor: React.FC = () => {
    const router = useRouter()
    let id = -1
    if (!Array.isArray(router.query?.id)) {
        id = parseInt(router.query.id)
    }
    const [role, setRole] = useState<string>()
    const [userId, setUserId] = useState<number>()
    const [reloadRequest, setReloadRequest] = useState<boolean>(false)
    const [reloadStudent, setReloadStudent] = useState<boolean>(false)

    useEffect(() => {
        setRole(localStorage.getItem('role'))
        setUserId(parseInt(localStorage.getItem('userId')))
    }, [])

    return (
        <MainLayout title="Thông tin lớp học">
            <ClassDetail id={id} isTeacher={true} />
            <div className="site-layout-background content">
                <Tabs
                    defaultActiveKey="1"
                    tabBarExtraContent={<Tooltip title='Thống kê điểm danh và thành tích của học sinh'><Button key='2' type="primary" shape='round' icon={<TrophyOutlined />} onClick={() => {
                        if (!Number.isNaN(id) && id !== -1) {
                            router.push({
                                pathname: `/teachers/classrooms/statistic`,
                                query: {
                                    classId: id
                                }
                            }, `/classrooms/${id}/statistic`)
                        }
                    }
                    }
                    > Thống kê </Button></Tooltip>}
                >
                    <Tabs.TabPane tab="Yêu cầu vào lớp" key="1">
                        <RegisterRequest
                            classId={id}
                            reload={reloadRequest}
                            setReload={setReloadRequest}
                        />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Học sinh / Sinh viên" key="2">
                        <StudentList
                            classId={id}
                            reloadRequest={reloadRequest}
                            reload={reloadStudent}
                            setReload={setReloadStudent}
                        />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Bài tập" key="3">
                        <AssignmentList
                            isTeacher={true}
                            classId={id}
                        />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Files" key="4">
                        <FileUpload
                            isTeacher={true}
                            classId={id}
                        />
                    </Tabs.TabPane>
                </Tabs>
            </div>
        </MainLayout>
    )
}

export default ClassroomInfor;