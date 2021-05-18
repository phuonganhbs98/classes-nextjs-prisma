import { Button, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { API } from "../../../prisma/type/type";
import { PlusOutlined } from '@ant-design/icons'
import { useRouter } from "next/router";
import { getAllClassroom } from "../../../lib/classroom/getClassroomInfor";
import AssignmentList from "./AssignmentList";
import CreateModalForm from "./CreateModalForm";

const AssignmentTableList: React.FC<{ isTeacher: boolean }> = ({ isTeacher }) => {
  const [classes, setClasses] = useState<API.Classroom[]>([])
  const router = useRouter()
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  const [activeKey, setActiveKey] = useState<number>(-1)
  useEffect(() => {
    const userId = parseInt(localStorage.getItem('userId'))
    if (isTeacher) {
      getAllClassroom({ teacherId: userId })
        .then(res => {
          setClasses(res)
          setActiveKey(res[0].id)
        })
        .catch(err => console.error(err))
    } else {
      let arrayClasses: API.Classroom[] = []
      getAllClassroom({ studentId: userId })
        .then(res => {
          if (res.length > 0) {
            res.forEach((x: API.Classroom) => arrayClasses.push(x))
          }
          setClasses(arrayClasses)
          setActiveKey(arrayClasses[0].id)
        })
    }
  }, [])


  return (
    <div className="site-layout-background">
      <Tabs
        defaultActiveKey="1"
        tabPosition='top'
        onChange={(activeKey) => setActiveKey(parseInt(activeKey))}
        tabBarExtraContent={
          <Button
            type='primary'
            shape='round'
            icon={<PlusOutlined />}
            onClick={()=> setIsModalVisible(true)}
          >
            Tạo bài tập
        </Button>}
      >
        {classes.map((i: API.Classroom) => (
          <Tabs.TabPane tab={`Lớp ${i.name}`} key={i.id} >
            <AssignmentList
              classId={i.id}
              isTeacher={isTeacher}
            />
          </Tabs.TabPane>
        ))}
      </Tabs>
      <CreateModalForm
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        currentTabKey={activeKey}
      />
    </div>
  );
};

export default AssignmentTableList;
