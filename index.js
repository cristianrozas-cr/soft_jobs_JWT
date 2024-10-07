//importar módulos
const express = require("express")
const cors = require("cors")
const jwt = require("jsonwebtoken")

//importar funciones
const { getUsuarios, agregarUsuario, verificarCredenciales } = require("./consultas") 

//Instanciamos express
const app = express()

//Levantar el servidor
const PORT = 3000;
app.listen(PORT, console.log("Server ON"));

//Middlewares
app.use(cors());
app.use(express.json())

//Llave secreta
const JWT_SECRET_KEY = "100%seguro"


///RUTAS
//Ruta para obtener usuarios
app.get("/usuarios", async (req, res) => {
    try{
        const Authorization = req.header("Authorization")
        const token = Authorization.split("Bearer ")[1]
        console.log(token)
        jwt.verify(token, JWT_SECRET_KEY)
        jwt.decode(token)
        const users = await getUsuarios()
        res.json(users)
    } catch (error) {
        res.send(error)
    }
})

//Ruta login que devuelve un token
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        await verificarCredenciales(email, password)
        const token = jwt.sign({email}, JWT_SECRET_KEY)
        res.send(token)
    } catch (error) {
        res.json(error)
    }
})

//Ruta registrarse para agregar usuarios
app.post("/usuarios", async (req, res) => {
    try{
        await agregarUsuario(req.body)
        res.send("Usuario agregado con éxito")
    } catch (error) {
        res.send(error)
    }
})


