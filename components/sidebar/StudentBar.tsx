import Sider from "antd/lib/layout/Sider";
import { Menu } from "antd";
import Link from "next/link";
import {
    AppstoreOutlined,
    TeamOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from "@ant-design/icons";
import SubMenu from "antd/lib/menu/SubMenu";

type Props = {
   pathname: string
}

const StudentBar: React.FC<Props> = ({pathname}) => {
    
    return (
        <Sider
            style={{
                overflow: "auto",
                height: "100vh",
                position: "fixed",
                left: 0,
            }}
        >
            <div className="logo" />
            <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[pathname]}
            >
                <Menu.Item key="/" icon={<AppstoreOutlined />} active={true}>
                    <Link href="/">Thời khóa biểu</Link>
                </Menu.Item>
                <SubMenu key="sub1" icon={<UserOutlined />} title="Lớp học">
                    <Menu.Item key="/classrooms">
                        <Link href="/classrooms" >Tất cả các lớp học </Link>
                    </Menu.Item>
                    <Menu.Item key="/classrooms/registered">
                        <Link href="/classrooms/registered">Các lớp đã đăng ký</Link>
                    </Menu.Item>
                    <Menu.Item key="/classrooms/active">
                        <Link href="/classrooms/active" >Các lớp đang học</Link>
                    </Menu.Item>
                </SubMenu>
                <SubMenu key="sub2" icon={<TeamOutlined />} title="Bài tập">
                    <Menu.Item key="/assignments">
                        <Link href="/assignments">Tất cả bài tập</Link>
                    </Menu.Item>
                    <Menu.Item key="/assignments/done">
                        <Link href="/assignments/done" >Bài tập đã làm</Link>
                    </Menu.Item>
                    <Menu.Item key="/assignments/unfinished">
                        <Link href="/assignments/unfinished" >Bài tập chưa hoàn thành</Link>
                    </Menu.Item>
                </SubMenu>
                <Menu.Item key="/achievements" icon={<VideoCameraOutlined />}>
                    <Link href="/achievements">Kết quả học tập</Link>
                </Menu.Item>
            </Menu>
            </Sider>
    )
}

export default StudentBar;