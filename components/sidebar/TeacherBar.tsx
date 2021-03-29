import Sider from "antd/lib/layout/Sider";
import { Menu } from "antd";
import Link from "next/link";
import {
    AppstoreOutlined,
    TeamOutlined,
    UserOutlined,
    UploadOutlined,
  } from "@ant-design/icons";

type Props ={
    pathname: string
}

const TeacherBar: React.FC<Props> = ({pathname}) => {

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
          <Menu.Item key="/classrooms/created" icon={<TeamOutlined />}>
            <Link href="/classrooms/">Danh sách lớp học</Link>
          </Menu.Item>
          <Menu.Item key="/students" icon={<UserOutlined />}>
            <Link href="/students">Danh sách học sinh</Link>
          </Menu.Item>
          <Menu.Item key="/assignments" icon={<UploadOutlined />}>
            <Link href="/assignments">Danh sách bài tập</Link>
          </Menu.Item>
        </Menu>
      </Sider>
    )
}

export default TeacherBar;