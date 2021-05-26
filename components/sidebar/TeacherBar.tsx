import Sider from "antd/lib/layout/Sider";
import { Dropdown, Menu } from "antd";
import Link from "next/link";
import {
  BankOutlined,
  UploadOutlined,
  CalendarOutlined,
  ReadOutlined,
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
      <Menu.Item key="/teachers/classrooms">
        <Link href="/teachers/classrooms">Danh sách lớp học</Link>
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
        minHeight: "inherit",
        // position:'absolute'
      }}
    >
      <div className="logo" />
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[pathname]}
      >
        <Menu.Item key="/" icon={<CalendarOutlined />} active={true}>
          <Link href="/"><p className={hide}>Thời khóa biểu</p></Link>
        </Menu.Item>
        {collapsed ?
          (<Dropdown overlay={menuClass}>
            <ReadOutlined style={{ lineHeight: '40px', paddingLeft: '24px', margin: '4px 0' }} />
          </Dropdown>) : (
            <SubMenu key="class" icon={<ReadOutlined />} title='Lớp học' >
              <Menu.Item key="/teachers/classrooms">
                <Link href="/teachers/classrooms">Danh sách lớp học</Link>
              </Menu.Item>
              <Menu.Item key="/classrooms/create">
                <Link href="/classrooms/create">Tạo lớp mới</Link>
              </Menu.Item>
            </SubMenu>
          )
        }
        <Menu.Item key="/teachers/studentList" icon={<BankOutlined />}>
          <Link href="/teachers/studentList"><p className={hide}>Danh sách học sinh</p></Link>
        </Menu.Item>
        {collapsed ?
          (
            <Dropdown overlay={menuAssignment}>
              <BankOutlined style={{ lineHeight: '40px', paddingLeft:'24px', margin: '4px 0' }} />
            </Dropdown>
          ) : (<SubMenu key="assignment" icon={<ReadOutlined />} title='Bài tập'>
            <Menu.Item key="/teachers/assignments">
              <Link href="/teachers/assignments">Danh sách bài tập</Link>
            </Menu.Item>
            <Menu.Item key="/teachers/assignments/create" >
              <Link href="/teachers/assignments/create">Giao bài tập</Link>
            </Menu.Item>
          </SubMenu>)
        }
      </Menu>
    </Sider>
  )
}

export default TeacherBar;