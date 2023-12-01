import Express from "express";
import route from "./routes/routes.js";
import cors from 'cors'

const app = Express()

const PUERTO = 3000
app.use(cors())
app.use(Express.json())
app.use(Express.urlencoded({ extended: true }))
app.use('/uploads', Express.static('uploads'));


app.use(route)

app.listen(PUERTO, () => {
    console.log(`http://localhost:${PUERTO}`)
})