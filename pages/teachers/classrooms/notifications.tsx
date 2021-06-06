import { useRouter } from "next/router"
import MainLayout from "../../../components/layouts/MainLayout"
import NotificationDetail from "../../classrooms/component/NotificationDetail"

const TeacherNoti: React.FC = () => {
    const router = useRouter()
    let id = -1
    if (!Array.isArray(router.query?.id)) {
        id = parseInt(router.query.id)
    }
    return (
        <MainLayout title="Thông báo">
            <NotificationDetail
                id={id}
                isTeacher={true}
            />
        </MainLayout>
    )
}

export default TeacherNoti