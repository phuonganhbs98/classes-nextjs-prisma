const columnClasses = [
    {
        title:'ID',
        dataIndex: 'id',
        key: 'key'
      },
      {
        title:'Tên lớp',
        dataIndex: 'name',
        key: 'key'
      },
      {
        title:'Giáo viên',
        dataIndex: 'teacherName',
        key: 'key'
      },
      {
        title:'SL tối đa',
        dataIndex: 'capacity',
        key: 'key'
      },
      {
        title:'SL hiện tại',
        dataIndex: 'count',
        key: 'count'
      },
      {
        title:'Trạng thái',
        dataIndex: 'status',
        key: 'key'
      },
      {
        title:'Hành động',
        dataIndex: 'action',
        key: 'key'
      }
]

const columnStudents=[
  {
    title:'ID',
    dataIndex: 'id',
  },
  {
    title:'Tên sinh viên',
    dataIndex: 'name',
  },
  {
    title:'Email',
    dataIndex: 'email',
  },
  {
    title:'Số điện thoại',
    dataIndex: 'phoneNumber',
  },
  {
    title:'Hành động',
    dataIndex: 'action',
  }
]

const columnAssignments = [
  {
    title:'ID',
    dataIndex: 'id',
  },
  {
    title:'Tiêu đề',
    dataIndex: 'title',
  },
  {
    title:'Lớp',
    dataIndex: 'className',
  },
  {
    title:'Thời hạn',
    dataIndex: 'deadlineFormat',
  },
  {
    title:'Status',
    dataIndex: 'statusRender',
  },
  {
    title:'Hành động',
    dataIndex: 'action',
  }
]

const columnAnswers=[
  {
    title:'ID',
    dataIndex: 'id',
  },
  {
    title:'Sinh viên',
    dataIndex: 'studentName',
  },
  {
    title:'Câu trả lời',
    dataIndex: 'content',
    render: (text, record)=> (<strong>record.content</strong>)
  },
  {
    title:'',
    dataIndex: 'action',
  }
]

export default {
    columnClasses,
    columnStudents,
    columnAssignments,
    columnAnswers
};