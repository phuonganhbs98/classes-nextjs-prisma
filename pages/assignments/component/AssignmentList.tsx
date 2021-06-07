import { Badge, Button, Popconfirm, Table, Tag, Tooltip } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { deleteAssignment, findAll, getUndoneAssignments, updateStatus } from "../../../lib/assignment/assignment";
import { formatDate } from "../../../lib/formatDate";
import { API } from "../../../prisma/type/type";
import { EyeOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { ColumnsType } from "antd/lib/table";
import { calculateAveragePoint } from "../../../lib/achievement/achievement";
import { getAllAnswer } from "../../../lib/answer/answer";

type Props = {
  classId: number,
  isTeacher: boolean,
  done?: boolean
}
function onChange(pagination: any) {
  console.log('params', pagination);
}
const AssignmentList: React.FC<Props> = ({ classId, isTeacher, done }) => {
  const [data, setData] = useState<API.AssignmentItem[]>([])
  const [checkReload, setCheckReload] = useState<boolean>(false)
  const [total, setTotal] = useState<number>(0)
  const [userId, setUserId] = useState<number>(-1)
  let doneAssignment: number[] = []
  const router = useRouter()
  const pathname = isTeacher ? '/teachers/assignments' : '/students/assignments'
  let assignments = []
  useEffect(() => {
    const userId = parseInt(localStorage.getItem('userId'))
    setUserId(userId)
    if (typeof done === 'undefined') {
      findAll({ classId: classId }).then(res => {
        setData(res)
        setTotal(res.length)
      })
    } else {
      if (done) {
        getAllAnswer({ classId: classId, studentId: userId })
          .then(res => {
            let array: API.AssignmentItem[] = []
            console.log('res: ')
            console.log(res)
            res.forEach((x: API.AnswerItem) => {
              console.log(x)
              array = [
                ...array,
                x.assignment
              ]
            })
            setData(array)
            setTotal(array.length)
          })
      } else {
        getUndoneAssignments(classId, userId)
          .then(res => {
            setData(res)
            setTotal(res.length)
          })
      }
    }
  }, [checkReload])

  if (data.length > 0) {
    data.forEach((x: API.AssignmentItem) => {
      updateStatus(x)
      assignments = [
        ...assignments,
        {
          ...x,
          deadlineFormat: formatDate(new Date(x.deadline), true),
          statusRender: <>{x.status === "ASSIGNED" ? <Badge status="success" /> : <Badge status="error" />}{x.status}</>,
          action: [
            <Tooltip overlay='Xem' key={1}><Button key={1} type='link' icon={<EyeOutlined />} onClick={() => router.push(`${pathname}/${x.id}`)} ></Button></Tooltip>,
            isTeacher ?
              <Popconfirm
                title="Bạn chắc chắn chứ ?"
                onConfirm={() => handleDelete(x.id)}
              ><Tooltip overlay='Xóa' key={3}><Button key={3} type='link' icon={<DeleteOutlined />} danger></Button></Tooltip>
              </Popconfirm> : null
          ]
        }
      ]
    })
  }

  const handleDelete = (assignmentId: number) => {
    deleteAssignment(assignmentId)
    if (checkReload) setCheckReload(false)
    else setCheckReload(true)
  }
  const columns: ColumnsType<API.AssignmentItem> = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
    },
    {
      title: 'Thời hạn',
      dataIndex: 'deadlineFormat',
      // align: 'center'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'statusRender',
      // align: 'center',
      render: (value, record) => {
        return (
          record.status === 'ASSIGNED' ?
            <Tag color="success">Còn thời gian</Tag> :
            <Tag color="error">Quá hạn</Tag>
        )
      }
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
      align: 'center'
    }
  ]
  return (
    <Table<API.AssignmentItem>
      columns={columns}
      dataSource={assignments}
      onChange={onChange}
      pagination={{
        total: total,
        showTotal: total => `Tổng ${total} bài tập`,
        defaultPageSize: 10,
        defaultCurrent: 1
      }}
      rowKey={(record) => { return record.id.toString() }}
    />
  )
}

export default AssignmentList;