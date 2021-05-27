import { Avatar, Button, Divider, Tabs, Tooltip } from "antd"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import MainLayout from "../../../components/layouts/MainLayout"
import { API } from "../../../prisma/type/type"
import { getAllStudents } from '../../../lib/classroom/getAllStudents'
import Table, { ColumnsType } from "antd/lib/table"
import StudentList from "../../../components/classroom/StudentList"
import getAttendanceDetail from "../../../lib/attendance/getAttendanceDetail"
import { EyeOutlined } from "@ant-design/icons"
import AttendanceStatistic from "./component/AttendanceStatistic"
import AchievementStatistic from "./component/AchievementStatistic"

const StatisticOfClass: React.FC = () => {
    const router = useRouter()
    const classId = Array.isArray(router.query.classId) ? undefined : parseInt(router.query.classId)
    const [students, setStudents] = useState<API.UserInfor[]>([])
    const [totalStu, setTotalStu] = useState<number>(0)

    useEffect(() => {
        getAllStudents(classId)
            .then(res => {
                console.log(res)
                setStudents(res)
                setTotalStu(res.length)
            })

    }, [])

    return (
        <MainLayout title='Thống kê'>
            <div className="site-layout-background">
                <Tabs defaultActiveKey="1">
                    <Tabs.TabPane tab="Điểm danh" key="1">
                        <AttendanceStatistic
                            students={students}
                            classId={classId}
                        />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Thành tích học tập" key="2">
                        <AchievementStatistic
                            students={students}
                            classId={classId}
                        />
                    </Tabs.TabPane>
                </Tabs>
            </div>
        </MainLayout>
    )
}

export default StatisticOfClass

