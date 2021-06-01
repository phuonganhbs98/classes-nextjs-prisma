import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import formidable from 'formidable'

export default async function manageFile(req: NextApiRequest, res: NextApiResponse) {
    const method = req.method
    if (method === 'POST') {
        // const data = req.body.data
        //console.log(data)
        //console.log('----------body')
        // console.log("request",req)
        // data.classId = parseInt(data.classId)
        // const [result] = await prisma.$transaction([
        //     prisma.fileUpload.create({
        //         data: data
        //     })
        // ])
        // var form = new multiparty.Form();
        // form.parse(req, function (err, fields, files) {
        //     // fields fields fields
        // });
        console.log('aaaaaaaaaaa')
        // console.log(req.body)
        console.log(req.body)
        let data = null
        // const post = async (req, res) => {
        //     const form = new formidable.IncomingForm();
        //     form.parse(req, async function (err, fields, files) {
        //         console.log('---------------------')
        //         console.log(fields.classId)
        //         console.log(files)
        //         console.log('---------------------')
        //         return fields
        //         // data = fields
        //         // await test(fields)
        //         // await test(err)
        //     });
        // };
        console.log('---------------------')
        // console.log(post)
        console.log(data)
        res.status(200).json(req.body.data)
    }
    else res.status(405).json("Method not allowed!")
}

export function test(fileds: any) {
    console.log('-----------------')
    console.log(fileds)
    return;
}