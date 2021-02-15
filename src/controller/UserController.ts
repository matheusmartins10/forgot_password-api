import { getRepository } from 'typeorm'
import { Request, Response } from 'express'
import { User } from '../entity/User'
import * as nodemailer from 'nodemailer'
import * as crypto from 'crypto'

import * as bcrypt from 'bcrypt'

export const saveUser = async (request: Request, response: Response) => {

    const { name, email, password } = request.body

    try {

       const passwordHash = await bcrypt.hash(password, 8)

       const user = await getRepository(User).save({
           name,
           email,
           password: passwordHash
       })

       return response.status(201).json(user)

    }catch(err){
       return response.status(422).json({ message: 'Error in entities!' })
    }
}

export const login = async (request: Request, response: Response) => {

    const { email, password } = request.body

    try {

       const user = await getRepository(User).find({
           where: {
               email
           }
       })

       if(await bcrypt.compare(password, user[0].password)){

           const data = {
               id: user[0].id,
               name: user[0].name,
               email: user[0].email
            }

           return response.json(data)
       }else {
           return response.status(404).json({ message: 'User not found' })
       }

       return response.status(201).json(user)

    }catch(err){
        return response.status(404).json({ message: 'User not found' })
    }
}

export const forgotPassword = async (request: Request, response: Response) => {

    const { email } = request.body

    try {

       const user = await getRepository(User).find({
           where: {
               email
           }
       })

       const newPassword = crypto.randomBytes(4).toString('hex')

       const transporter = nodemailer.createTransport({
           host: 'smtp.gmail.com',
           port: 587,
           secure: false,
           auth: {
             user: 'mathews20104540@gmail.com',
             pass: '24563930a'
           }
       })

       const data = {
        to: email,
        from: 'Administrador',
        subject: 'Recuperação de senha',
        html: `<p>Olá a sua nova senha é ${newPassword}</p>`
       }

       transporter.sendMail(data, async () => {
        const password = await bcrypt.hash(newPassword, 8)

        getRepository(User).update(user[0].id, {
            password
          }).then(() => {
              return response.status(200).json({ message: `google senha foi enviado para o email: ${email}.` })
          }).catch(() => {
              return response.status(404).json({message: 'user not found'})
          })
       })


    }catch(err){ 
        return response.status(401).json({ message: 'fail' })
    }
}