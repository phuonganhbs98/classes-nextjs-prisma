import React, { useState } from "react";
import { Button, PageHeader } from "antd";
import MainLayout from "../components/layouts/MainLayout";
import { signOut } from "next-auth/client";

const Profile: React.FC = () => {

  return (
    <MainLayout title="">
      <PageHeader
        title="Thông tin cá nhân"
        extra={[
          <Button key="3">Sửa</Button>,
          <Button key="1" type="primary" danger onClick={() => signOut()}>
            Đăng xuât
          </Button>,
        ]}
      />
    </MainLayout>
  );
};

export default Profile;
