import axios from "axios";
import { API } from "../../prisma/type/type";
import { getTimetableClassList } from "../processTimetable";

export default async function createClass(data: API.Classroom){
    let result: API.Classroom = null
    let dataTimetable:API.TimetableClassItem[] = []
    await axios.post(`/api/classrooms`,{
        data: data
    })
    .then(async res => {
        result = res.data
        dataTimetable = getTimetableClassList(data.name, res.data.id, data.teacherId, res.data)
        if(dataTimetable.length>0){
            await axios.post(`/api/timetableClasses`,{
                data: dataTimetable
            })
            .then(res =>{
                console.log('dang trong createClass: da tao timetable thanh cong')
                console.log(res.data)
            })
            .catch(err=> console.log(err))
        }
    })
    .catch(err =>{
        console.log(err)
    })
   

    

    return result
}