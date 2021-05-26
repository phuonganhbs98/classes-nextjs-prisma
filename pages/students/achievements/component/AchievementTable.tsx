import { Tabs } from "antd"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { getAllClassroom } from "../../../../lib/classroom/getClassroomInfor"
import { API } from "../../../../prisma/type/type"
import AveragePoint from "./AveragePoint"

const AchievementTable: React.FC = () => {
    const [classes, setClasses] = useState<API.Classroom[]>([])
    const [userId, setUserId] = useState<number>(-1)
    const router = useRouter()
    useEffect(() => {
        const userId = parseInt(localStorage.getItem('userId'))
        setUserId(userId)
        // if (isTeacher) {
        //   getAllClassroom({ teacherId: userId })
        //     .then(res => {
        //       setClasses(res)
        //       setActiveKey(res[0].id)
        //     })
        //     .catch(err => console.error(err))
        // } else {
        getAllClassroom({ studentId: userId })
            .then(res => {
                setClasses(res)
            })
    },[])
    return (
        <div className="site-layout-background">
            <Tabs
                defaultActiveKey="1"
                tabPosition='top'
            // onChange={(activeKey) => setActiveKey(parseInt(activeKey))}
            // tabBarExtraContent={
            //     isTeacher ? <Button
            //         type='primary'
            //         shape='round'
            //         icon={<PlusOutlined />}
            //         onClick={() => setIsModalVisible(true)}
            //     >
            //         Tạo bài tập
            // </Button> : null}
            >
                {classes.map((i: API.Classroom) => (
                    <Tabs.TabPane tab={`Lớp ${i.name}`} key={i.id} >
                        <AveragePoint
                            classId={i.id}
                            studentId={userId}
                        />
                    </Tabs.TabPane>
                ))}
            </Tabs>
        </div>
    )
}

export default AchievementTable