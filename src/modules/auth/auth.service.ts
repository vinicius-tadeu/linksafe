import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { prisma } from '../../lib/prisma.js'
import { env } from '../../config/env.js'

const JWT_SECRET = env.JWT_SECRET ?? 'secret'

export async function registerService(email:string, password: string){
    const userExists = await prisma.user.findUnique({
        where: {email},
    })

    if(userExists){
        throw new Error('Email já cadastrado')
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
        data:{
            email,
            password: hashedPassword,
        },
    })
    return {id: user.id, email: user.email}
}

export async function loginService(email:string, password:string){
    const user = await prisma.user.findUnique({
        where: {email},
    })
    if(!user){
        throw new Error('Credenciais inválidas')
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if(!passwordMatch){
        throw new Error('Credenciais inválidas')
    }

    const token = jwt.sign({userId: user.id}, JWT_SECRET,{
        expiresIn: '7d',
    })

    return {token}
}