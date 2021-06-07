import Sider from "antd/lib/layout/Sider";
import { Avatar, Divider, Dropdown, Menu, Space } from "antd";
import Link from "next/link";
import {
    BankOutlined,
    CalendarOutlined,
    NotificationOutlined,
    ReadOutlined,
    TrophyOutlined,
} from "@ant-design/icons";
import SubMenu from "antd/lib/menu/SubMenu";
import { useState } from "react";

type Props = {
    pathname: string
}

const StudentBar: React.FC<Props> = ({ pathname }) => {
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
            <Menu.Item key="/students/classrooms">
                <Link href="/students/classrooms" >Tất cả các lớp học </Link>
            </Menu.Item>
            <Menu.Item key="/students/classrooms/registered">
                <Link href="/students/classrooms/registered">Các lớp đã đăng ký</Link>
            </Menu.Item>
            <Menu.Item key="/students/classrooms/active">
                <Link href="/students/classrooms/active" >Các lớp đang học</Link>
            </Menu.Item>
        </Menu>
    )

    const menuAssignment = (
        <Menu>
            <Menu.Item key="/students/assignments">
                <Link href="/students/assignments">Tất cả bài tập</Link>
            </Menu.Item>
            <Menu.Item key="/students/assignments/done">
                <Link href="/students/assignments/done" >Bài tập đã làm</Link>
            </Menu.Item>
            <Menu.Item key="/students/assignments/unfinished">
                <Link href="/students/assignments/unfinished" >Bài tập chưa làm</Link>
            </Menu.Item>
        </Menu>
    )

    return (
        <Sider
            // collapsible
            collapsed={collapsed}
            onCollapse={onCollapse}
            style={{
                overflow: "auto",
                height: '100%',
                position: 'fixed'
            }}>
            <div className="logo" style={{ color: 'white' }} >
                {collapsed ? <Avatar shape="square" style={{ backgroundColor: 'white' }} size="large" src='/image/logo.png' />
                    : (<Space align='center'>
                        <Avatar shape="square" style={{ backgroundColor: 'white' }} size="large" src='/image/logo.png' />
                        <strong style={{ fontSize: '18px' }}>Classroom Management</strong>
                    </Space>
                    )}
            </div>
            <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[pathname]}
                style={{
                }}
            >
                <Menu.Item key="/students/schedule" icon={<CalendarOutlined />} active={true}>
                    <Link href="/"><p className={hide}>Thời khóa biểu</p></Link>
                </Menu.Item>
                <Menu.Item key="/students/notifications" icon={<NotificationOutlined />} active={true}>
                    <Link href="/students/notifications"><p className={hide}>Thông báo</p></Link>
                </Menu.Item>
                {collapsed ? (
                    <>
                        <Dropdown overlay={menuClass}>
                            <BankOutlined style={{ lineHeight: '40px', paddingLeft: '24px', margin: '4px 0' }} />
                        </Dropdown>
                        <br />
                        <Dropdown overlay={menuAssignment}>
                            <ReadOutlined style={{ lineHeight: '40px', paddingLeft: '24px', margin: '4px 0' }} />
                        </Dropdown>
                    </>
                ) : (
                    <>
                        <SubMenu key="sub1" icon={<BankOutlined />} title="Lớp học">
                            <Menu.Item key="/students/classrooms">
                                <Link href="/students/classrooms" >Tất cả các lớp học </Link>
                            </Menu.Item>
                            <Menu.Item key="/students/classrooms/registered">
                                <Link href="/students/classrooms/registered">Các lớp đã đăng ký</Link>
                            </Menu.Item>
                            <Menu.Item key="/students/classrooms/active">
                                <Link href="/students/classrooms/active" >Các lớp đang học</Link>
                            </Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub2" icon={<ReadOutlined />} title="Bài tập">
                            <Menu.Item key="/students/assignments">
                                <Link href="/students/assignments">Tất cả bài tập</Link>
                            </Menu.Item>
                            <Menu.Item key="/students/assignments/done">
                                <Link href="/students/assignments/done" >Bài tập đã làm</Link>
                            </Menu.Item>
                            <Menu.Item key="/students/assignments/unfinished">
                                <Link href="/students/assignments/unfinished" >Bài tập chưa làm</Link>
                            </Menu.Item>
                        </SubMenu>
                    </>
                )}

                <Menu.Item key="/students/achievements" icon={<TrophyOutlined />}>
                    <Link href="/students/achievements"><p className={hide}>Kết quả học tập</p></Link>
                </Menu.Item>
            </Menu>
        </Sider>
    )
}

export default StudentBar;