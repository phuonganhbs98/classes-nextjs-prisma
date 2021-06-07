import React, { ReactNode, useEffect, useState } from "react";
import { Col, Divider, Layout, Row } from "antd";
import MenuHeader from "./MenuHeader";
import { useSession } from "next-auth/client"
import { Role } from ".prisma/client";
import Loading from "../Loading";
import AccessDenied from "../AccessDenied";
import { useRouter } from "next/router";
import StudentBar from "../sidebar/StudentBar";
import TeacherBar from "../sidebar/TeacherBar";
import Head from 'next/head'
import SignInForm from "../../pages/login";
const { Content, Footer } = Layout;

type Props = {
  children: ReactNode;
  title: string | ReactNode;
};

const MainLayout: React.FC<Props> = ({ children, title }) => {
  const [session, loading] = useSession();
  const [role, setRole] = useState<Role>()
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) => {
    return router.pathname === pathname;
  };

  useEffect(() => {
    if (session) {
      setRole(session.role)
      localStorage.setItem('userId', session.userId)
      localStorage.setItem('role', session.role)
      localStorage.setItem('image', session.user.image)
      localStorage.setItem('name', session.user.name)
    }
  }, [session])
  const checkPermission = role === 'STUDENT' && router.pathname.startsWith('/teachers') ? false : true
  return (
    <>
      <Head>
        <title>Classroom Management</title>
        <link rel="icon" type="image/ico" href="./favicon.ico"/>
      </Head>
    {loading ? (<Loading />) : session ? checkPermission ? (
      <Layout>
        <Row wrap={false}>
          <Col flex='200px' style={{ minHeight: 'inherit'}}>
            {/* <MenuSider role={role} loading={loading} /> */}
            {(role === "STUDENT") ? (
              <StudentBar pathname={router.pathname} />
            ) : (
              <TeacherBar pathname={router.pathname} />
            )}
          </Col>
          <Col flex='auto'>
            <Layout className="site-layout" style={{ position: 'absolute', width: '100%' }}>
              <MenuHeader title={title} />
              <Content
                style={{
                  margin: '0 16px',
                  overflow: "initial",
                  minHeight: '72vh'
                }}
              >
                <div className=" main-container"
                  style={{
                    minHeight: 'inherit'
                  }}>{children}</div>
              </Content>
              <Footer style={{ textAlign: "center" }}>
              {/* <CopyrightOutlined /> */}
              ĐHBKHN - Viện CNTT & TT<br/>
              Classes Management ©2021 - Created by Nguyễn Phương Anh
              {/* Trường đại học Bách Khoa Hà Nội */}
                <div></div>
                <div></div>
                <div></div>
              </Footer>
            </Layout>
          </Col>
        </Row>
      </Layout>
  )
    : <AccessDenied content='Bạn không có quyền truy cập' />
    : <SignInForm />}
    </>);
}

export default MainLayout;
