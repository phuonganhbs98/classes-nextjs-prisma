import Sider from "antd/lib/layout/Sider";
import { Dropdown, Menu } from "antd";
import Link from "next/link";
import {
  AppstoreOutlined,
  TeamOutlined,
  UserOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import SubMenu from "antd/lib/menu/SubMenu";
import { useState } from "react";

type Props = {
  pathname: string
}

const TeacherBar: React.FC<Props> = ({ pathname }) => {
  const [collapsed, setCollapsed] = useState<boolean>(false)
  const [hide, setHide] = useState<string>('show')
  const onCollapse = (collapsed) => {
    setCollapsed(collapsed)
    if (collapsed)
      setHide('hide')
    else setHide('show')
  }
  const menuClass = (
    <Menu>
      <Menu.Item key="/classrooms">
        <Link href="/classrooms">Danh sách lớp học</Link>
      </Menu.Item>
      <Menu.Item key="/classrooms/create">
        <Link href="/classrooms/create">Tạo lớp mới</Link>
      </Menu.Item>
    </Menu>
  )

  const menuAssignment = (
    <Menu>
      <Menu.Item key="/assignments">
        <Link href="/assignments">Danh sách bài tập</Link>
      </Menu.Item>
      <Menu.Item key="/assignments/create" icon={<UploadOutlined />}>
        <Link href="/assignments/create">Giao bài tập</Link>
      </Menu.Item>
    </Menu>
  )

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      style={{
        overflow: "auto",
        height: "100vh",
        // position:'absolute'
      }}
    >
      <div className="logo" />
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[pathname]}
      >
        <Menu.Item key="/" icon={<AppstoreOutlined />} active={true}>
          <Link href="/"><p className={hide}>Thời khóa biểu</p></Link>
        </Menu.Item>
        {collapsed ?
          (<Dropdown overlay={menuClass}>
            <TeamOutlined style={{ lineHeight: '40px', paddingLeft: '24px', margin: '4px 0' }} />
          </Dropdown>) : (
            <SubMenu key="class" icon={<TeamOutlined />} title='Lớp học' >
              <Menu.Item key="/classrooms">
                <Link href="/classrooms">Danh sách lớp học</Link>
              </Menu.Item>
              <Menu.Item key="/classrooms/create">
                <Link href="/classrooms/create">Tạo lớp mới</Link>
              </Menu.Item>
            </SubMenu>
          )
        }
        <Menu.Item key="/students" icon={<UserOutlined />}>
          <Link href="/students"><p className={hide}>Danh sách học sinh</p></Link>
        </Menu.Item>
        {collapsed ?
          (
            <Dropdown overlay={menuAssignment}>
              <UserOutlined style={{ lineHeight: '40px', paddingLeft:'24px', margin: '4px 0' }} />
            </Dropdown>
          ) : (<SubMenu key="assignment" icon={<UserOutlined />} title='Bài tập'>
            <Menu.Item key="/assignments">
              <Link href="/assignments">Danh sách bài tập</Link>
            </Menu.Item>
            <Menu.Item key="/assignments/create" >
              <Link href="/assignments/create">Giao bài tập</Link>
            </Menu.Item>
          </SubMenu>)
        }
      </Menu>
    </Sider>
  )
}

export default TeacherBar;