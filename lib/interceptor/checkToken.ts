import { NextApiRequest } from "next";
import { NextApiResponse } from "next";
import jwt from 'next-auth/jwt'

export default async function checkToken(req: NextApiRequest, res: NextApiResponse) {
    
    // if (localStorage.getItem('accessToken') || localStorage.getItem('refreshToken')) {
    //     console.log('Cookie')
    // } else {
    //     console.log('k co token')
    //     return res.status(403).send({
    //         message: 'No token provided.',
    //     });
    // }
}