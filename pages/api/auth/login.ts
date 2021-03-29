import { NextApiRequest, NextApiResponse } from "next-auth/_utils";
import { PrismaClient } from "@prisma/client";

var md5 = require('md5')

export default async function login(req: NextApiRequest, res: NextApiResponse){
    const {
        email,
        password
    } = JSON.parse(req.body)

    const prisma = new PrismaClient()
    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    })
    if(user){
        if(md5(password) === user.password){
            // cho dang nhap
        }
        else{
            //bao sai mat khau
        }
    }else {
        // thong bao khong ton tai tai khoan
    }
}