import { CloudUploadOutlined, DeleteOutlined } from "@ant-design/icons"
import { Button, message, Upload } from "antd"
import { useEffect, useState } from "react"
import { storage } from "../../lib/firebase"
import { API } from "../../prisma/type/type"

const FileUpload: React.FC<{ classId: number, isTeacher: boolean }> = ({ classId, isTeacher }) => {
    const [files, setFiles] = useState<any[]>([])
    const [file, setFile] = useState<any>()
    let fileList: API.FileUpload[] = []

    useEffect(() => {
        if (!Number.isNaN(classId)) {
            storage.ref(`/images/class${classId}`).listAll()
                .then(async snaps => {
                    let count: number = 0
                    snaps.items.forEach(async (x) => await x.getDownloadURL().then(res => {
                        let fileItem: API.FileUpload = {
                            uid: ++count,
                            url: res,
                            name: x.name,
                            status: 'done'
                        }
                        fileList = [...fileList, fileItem]
                    }))
                })
            setTimeout(() => {
                setFiles(fileList)
                console.log('----------------')
                console.log(fileList)
            }, 1000)
        }
    }, [])

    const handleDelete = (fileName: string, uid: string) => {
        if (!Number.isNaN(classId)) {
            storage.ref(`/images/class${classId}/${fileName}`).delete()
                .then(res => {
                    setFiles(files.filter((x) => x.uid.toString() !== uid.toString()))
                    message.success('Xóa thành công')
                })
        }
    }

    return (
        <div>
            <Upload
                onChange={(infor) => {
                    setFile(infor.file)
                }}
                customRequest={async (a) => {
                    if (!Number.isNaN(classId)) {
                        // message.success('Đang tải tài liệu')
                        const uploadTask = storage.ref(`/images/class${classId}/${file.name}`).put(new Blob([file.originFileObj], { type: file.originFileObj.type }))
                        uploadTask.on('state_changed',
                            (snapShot) => {
                                // console.log(snapShot)
                            }, (err) => {
                                console.log(err)
                            }, () => {

                                // gets the functions from storage refences the image storage in firebase by the children
                                // gets the download url then sets the image from firebase as the value for the imgUrl key:
                                storage.ref(`/images/class${classId}`).child(file.name).getDownloadURL()
                                    .then(fireBaseUrl => {
                                        message.success('Thành công')
                                        file.status = 'done'
                                        file.url = fireBaseUrl
                                        setFiles([...files, file])
                                    })
                            })
                    }
                }}
                fileList={files}
                showUploadList={{
                    showRemoveIcon: isTeacher ? true : false,
                    removeIcon: (file) => <DeleteOutlined style={{ color: 'red' }} onClick={(e) => handleDelete(file.name, file.uid)} />
                }}
            >
                {isTeacher ? <Button type='primary' shape='round' icon={<CloudUploadOutlined />}>Tải tài liệu</Button> : null}
            </Upload>
        </div >
    )
}

export default FileUpload