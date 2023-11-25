import Consultas from "../Consultas.js"
import Router from "express"

const route = Router()
const consulta = new Consultas('localhost', 'root', '2605', 'vue_final')

route.post('/registrar', (req, res) => {

})


route.get('/tabla', async (req, res) => {
    const result = await consulta.select('publicaciones')
    res.json(result)
    await consulta.closeConect();
})



export default route