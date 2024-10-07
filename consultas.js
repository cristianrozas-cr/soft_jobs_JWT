const { Pool } = require("pg");
const bcrypt = require('bcryptjs') 

const pool = new Pool({
    host: 'localhost',
    user: 'crenz',
    password: '12345',
    database: 'softjobs',
    allowExitOnIdle: true
})


//Función para obtener los usuarios
const getUsuarios = async () => {
    const consulta = "SELECT * FROM usuarios";
    const { rows: jobs } = await pool.query(consulta)
    return jobs;
}

//Función que verifica si existe un usuario en la base de datos (AUTH)
const verificarCredenciales = async (email, password) => {
    const consulta = "SELECT * FROM usuarios WHERE email = $1 AND password = $2"
    const values = [email, password]
    const { rowCount } = await pool.query(consulta, values)

    //Si existe un registro, el código seguirá funcionando. Si no existe, tirará error.
    if (!rowCount)
        throw {
            code: 404,
            message: "No se encontró ningún usuario con estas credenciales"
        } 
    return;
}

//Función para registrar nuevos usuarios
const agregarUsuario = async ({email, lenguage, password, rol}) => {
    try{
        console.log(email, lenguage, password, rol)
        
        let passwordEncriptada = await bcrypt.hash(password, 10)
    
        console.log("PasswordEncriptada: ", passwordEncriptada)
    
        const consulta = "INSERT INTO usuarios (id, email, password, rol, lenguage) values (DEFAULT, $1, $2, $3, $4)"
        const values = [email, passwordEncriptada, rol, lenguage]
        await pool.query(consulta, values)
    } catch (error){
        console.error('Error agregando usuario:', error.message);
    }
}



module.exports = { getUsuarios, agregarUsuario, verificarCredenciales }