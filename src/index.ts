import 'reflect-metadata'
import { createConnection } from 'typeorm'
import * as express from "express";
import route from "./routes";


const app = express()
createConnection()

app.use(express.json())

app.use(route)

const port = 3333
app.listen(port, () => console.log('Server is running'))