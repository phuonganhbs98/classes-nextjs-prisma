import MainLayout from "../../components/layouts/MainLayout";
import { List, PageHeader, Button, Row, Col, Divider } from "antd";
import { useSession } from "next-auth/client";
import { formatDate, formatTime, formatDay } from "../../lib/formatDate"
import {getClassById} from '../../lib/classroom/getClassroomInfor'
import deleteClass from '../../lib/classroom/deleteClass'

export async function getServerSideProps({ params }) {
    let id = parseInt(params.id)
    const {
        classroom,
        schedulesData
    } = await getClassById(id)
    
    return {
        props: {
            classroom,
            schedulesData
        }
    }
}
export default function ClassroomInfor({ classroom, schedulesData }) {
    const [session] = useSession()
    const editButton = session?.userId === classroom.teacherId ? { display: 'inline' } : { display: 'none' }

    //can check lai xem sinh vien da dang ky lop chua roi ms disable
    const disableButton = (session?.role === 'STUDENT')||(false) ? false : true 
    const startAtDate = new Date(classroom.startAtJson)
    const endAtDate = new Date(classroom.endAtJson)
    let schedule = []
    if (schedulesData){
        schedulesData.forEach((x: any) => {
            schedule = [
                ...schedule,
                [
                    <><p>{formatDay(x.dayInWeek)}</p><p>{formatTime(new Date(x.startAtJson))}</p>~<p> {formatTime(new Date(x.endAtJson))}</p></>
                ],
            ]
        })
    } else {
        schedule=[(<p>Chưa cập nhật</p>)]
    }
    
    return (
        <MainLayout title="Thông tin lớp học">
            <PageHeader
                title=""
                extra={[
                    <Button key='1' disabled={disableButton} type="primary">Đăng ký</Button>,
                    <Button key='2' style={editButton} type="ghost">Sửa</Button>,
                    <Button key='3' style={editButton} type="primary" onClick={()=> deleteClass(classroom.id)} danger>Xóa</Button>
                ]}
            ></PageHeader>
            <p style={{
                fontSize: '30px',
                fontWeight: 'bolder',
                margin: '0 20px 0 2%',
            }}> {classroom.name} </p>
            <Divider orientation="right" plain={false} style={{ fontSize: '14px' }}>
                <em>Được tạo bởi:
                    <a href={`/users/${classroom.teacherId}`}> {classroom.teacherName}</a></em>
            </Divider>
            <Row align="top" justify="space-around" style={{
                marginTop: '2em'
            }}>
                <Col key="1" span={10} push={1}>
                    <p><strong>ID: </strong>{classroom.id}</p>
                    <p><strong>Trạng thái: </strong>{classroom.status}</p>
                    <Divider/>
                    <p><strong>Số lượng học viên tối đa: </strong>{classroom.capacity}</p>
                    <p><strong>Sĩ số: </strong>{}</p>
                    <Divider/>
                    <p><strong>Ngày bắt đầu: </strong>{formatDate(startAtDate)}</p>
                    <p><strong>Ngày kết thúc: </strong>{formatDate(endAtDate)}</p>
                </Col>
                <Col key="2" span={10} push={1}>
                    <List
                        size="small"
                        header={<strong>Thời khóa biểu</strong>}
                        bordered={false}
                        dataSource={schedule}
                        renderItem={(item, index) => <List.Item key={index}>{item}</List.Item>}
                        style={{
                            margin: '0px 5% 20px'
                        }}
                    />
                </Col>
            </Row>
        </MainLayout>
    )
}

