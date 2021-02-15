import { Router } from 'express'
import { saveUser, login, forgotPassword } from './controller/UserController'


const router = Router()

router.get('/', (req, res) => {
    return res.json("Hello")
})

router.post('/users', saveUser)
router.post('/login', login)
router.post('/forgot', forgotPassword)

export default router;