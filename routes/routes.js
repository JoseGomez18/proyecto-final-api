import Consultas from "../Consultas.js"
import Router from "express"
//biblioteca para manejar la carga de archivos en formularios
import multer from "multer"
import path from 'path'
import crypto from 'node:crypto'

const route = Router()
const consulta = new Consultas('localhost', 'root', '2605', 'vue_final')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Ajusta la carpeta de destino según tus necesidades
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

route.post('/registrar', upload.single('foto'), async (req, res) => {
    try {
        const { nombre, correo, contra } = req.body;
        const id = crypto.randomUUID().substring(0, 10)

        const foto_perfil = req.file.filename;  // Accede a la imagen desde req.file
        const ruta_foto = `/uploads/${foto_perfil}` // ruta que va guardar en la db

        const result = await consulta.insert('usuarios', `('${id}','${nombre}','${correo}','${contra}','${ruta_foto}')`)
        console.log(result)

        res.json({ info: "se creo bien", consulta: result })
        await consulta.closeConect()
    } catch (error) {
        res.json({ error: "hubo un eror" + error })
        await consulta.closeConect()
    }
})

route.post('/iniciar-sesion', async (req, res) => {
    try {
        const { correo, contra } = req.body
        const result = await consulta.select('usuarios')

        let usuarioAutenticado = "false";
        let perfil = ''
        let nombre = ''
        let correou = ''

        result.forEach(resul => {
            if (correo === resul.correo && contra === resul.contraseña) {
                usuarioAutenticado = "true";
                perfil = resul.foto_perfil
                nombre = resul.nombre
                correou = resul.correo
            }
        });

        if (usuarioAutenticado == "true") {
            res.json({ nombre: nombre, validacion: usuarioAutenticado, foto: perfil, correo: correou });
        } else {
            res.json({ message: 'Credenciales inválidas' });
        }
        await consulta.closeConect();
    } catch (error) {
        res.status(400).send('Hubo un error: ' + error.message);
        await consulta.closeConect();
    }
})

route.post('/crear', upload.single('foto'), async (req, res) => {
    try {
        const { titulo } = req.body;

        const id = crypto.randomUUID().substring(0, 10)
        const fechaActual = new Date();
        const fechaFormateada = fechaActual.toISOString().slice(0, 19).replace('T', ' ');
        const foto_publicacion = req.file.filename;  // Accede a la imagen desde req.file
        const ruta_foto = `/uploads/${foto_publicacion}` // ruta que va guardar en la db

        const insert = await consulta.insert('publicaciones', `('${id}','${ruta_foto}','${titulo}','${fechaFormateada}')`)
        console.log(insert)

        console.log(titulo, ruta_foto, fechaFormateada)
        res.send("bien")

    } catch (error) {
        console.log("error" + error)
        res.send("mal" + error)
    }
})


route.delete('/eliminar/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deletee = await consulta.delete('publicaciones', `id = '${id}'`)
        console.log(deletee)

        res.send("bien")

    } catch (error) {
        console.log("error" + error)
        res.send("mal" + error)
    }
})

route.get('/tabla', async (req, res) => {
    try {
        const result = await consulta.select('publicaciones')
        res.json(result)
        await consulta.closeConect();
    } catch (error) {
        res.json({ error: "hubo un error" + error })
        await consulta.closeConect();
    }
})

route.patch('/modificar/:id', upload.single('foto'), async (req, res) => {
    try {
        const { id } = req.params
        const { titulo } = req.body

        let result
        let foto_publicacion

        if (req.file && req.file.filename) {
            foto_publicacion = req.file.filename;
        }

        const ruta_foto = `/uploads/${foto_publicacion}` // ruta que va guardar en la db

        if (titulo && foto_publicacion) {
            result = await consulta.update('publicaciones', `imagen = '${ruta_foto}', titulo = '${titulo}'`, `id ='${id}'`)
        } else if (foto_publicacion) {
            result = await consulta.update('publicaciones', `imagen = '${ruta_foto}'`, `id ='${id}'`)
        } else if (titulo) {
            result = await consulta.update('publicaciones', `titulo = '${titulo}'`, `id ='${id}'`)
        }

        console.log(result)
        res.json(result)
    } catch (error) {
        console.log(error)
        res.json({ error: "hubo un error" + error })
        await consulta.closeConect();
    }
})



export default route