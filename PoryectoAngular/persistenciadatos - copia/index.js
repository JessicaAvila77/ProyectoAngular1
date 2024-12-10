const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;
const jwt = require('jsonwebtoken');
const cors = require('cors');
const mysql = require('mysql2');
const SECRET_KEY = 'ClaveProyecto';
require('dotenv').config();


//debes instalar en consola npm i mysql2

//todo lo que venga en el body sea un objeto json
app.use(express.json());

// Habilitar CORS para todas las solicitudes
app.use(cors());

//middleware para autenticacion jwt

const verificarToken=(req,res,next) =>{
    const authHeader = req.headers['authorization']; //captura el header
    if(!authHeader){//sino trae token no esta autorizado a pasar
        return res.status(401).json({mensaje: 'Token no proporcionado'});

    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token,SECRET_KEY, (err, user) =>{

        if(err){
            return res.status(403).json({mensaje:'Token invalido o expirado'});
        }

        req.user = user;
        next();

    });

};


const conexion = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'root',
    database:'gestion_usuarios_inventario'
});

conexion.connect((err) => {
    if(err){
        console.error('Error de conexión a la base de datos',err);
    }else{
        console.log('Conexión exitosa...');
    }
});


//api login
/*
app.post('/login', (req, res) =>{
    const {username, password} = req.body;

    if(username === 'admin' && password === '1234'){
        const token = jwt.sign({username}, SECRET_KEY, {expiresIn: '1h'});
        res.json({mensaje: 'Succes', token});
    }
    else{
        res.status(401).json({mensaje:'Credenciales invalidas'})
    }


});*/

//login pegado a la base de datos
app.post('/login', (req, res) =>{
    const {email, password} = req.body;

    // Consulta SQL para buscar el correo
    const sql = 'SELECT * FROM usuario WHERE email = ?';

    conexion.query(sql, [email], (err, resultados) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ mensaje: 'Error en el servidor' });
        }

        if (resultados.length === 0) {
            // Si no se encuentra el usuario
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }

        const usuario = resultados[0];

        if (usuario.password === password) {
            const token = jwt.sign({ id: usuario.id, email: usuario.email }, SECRET_KEY, { expiresIn: '1h' });
            return res.json({ mensaje: 'Success', token });
        } else {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }
    });

});




//desplegando lo de la DB verificarToken,
app.get('/usuarios', verificarToken, (req,res)=>{ //lleva inserto el middleware
    const sql = 'select * from usuario';
    conexion.query(sql, (err, resultado) =>{
        if(err){
            res.status(500).json({error:'Error al obtener los datos del usuario'});
        }else{
            res.json(resultado);
        }
    });
});


//get con filtro desde DB
app.get('/usuarios/:id', (req,res)=>{
  
    const id = req.params.id;    
    
    const sql = 'SELECT * FROM usuario WHERE id = ?';
   
    conexion.query(sql, [id], (err, resultado) => {
        if (err) {
            res.status(500).json({ mensaje: 'Error al obtener el usuario' });
        } else if (resultado.length === 0) {
            res.status(404).json({ mensaje: 'Usuario no encontrado' });
        } else {
            res.json({ mensaje: 'Ok', usuario: resultado[0] });
        }
    });

});

app.get('/usuarios-nextid', (req,res)=>{
    const sql = 'SELECT MAX(id) AS maxId FROM usuario'; 

    conexion.query(sql, (err, resultado) => {
        if (err) {
            res.status(500).json({ mensaje: 'Error al obtener el siguiente ID' });
        } else {
            const maxId = resultado[0].maxId || 0; 
            res.json({ nextId: maxId + 1 });
        }
    });
});

app.post('/usuarios', (req,res)=>{
    const { nombre, email, password, id_rol } = req.body; 

    const sql = 'INSERT INTO usuario (nombre, email, password, id_rol) VALUES (?, ?, ?, ?)'; 

    //obligatorio el ingreso, ingresar aca el if


    conexion.query(sql, [nombre, email, password, id_rol], (err, resultado) => {
        if (err) {
            res.status(500).json({ mensaje: 'Error al registrar el usuario', error: err });
        } else {
            res.status(201).json({ mensaje: 'Registro exitoso', userId: resultado.insertId });
        }
    });
});

//actualizando
app.put('/usuarios/:id', (req, res) => {
    const id = req.params.id; 
    const { nombre, email, password, id_rol } = req.body; 

    const sql = `UPDATE usuario 
                 SET nombre = ?, email = ?, password = ?, id_rol = ? 
                 WHERE id = ?`;

    conexion.query(sql, [nombre, email, password, id_rol, id], (err, resultado) => {
        if (err) {
            res.status(500).json({ mensaje: 'Error al actualizar el usuario', error: err });
        } else if (resultado.affectedRows === 0) {
            res.status(404).json({ mensaje: 'Usuario no encontrado' });
        } else {
            res.json({ mensaje: 'Usuario actualizado correctamente' });
        }
    });
});


app.delete('/usuarios/:id', (req,res)=>{
   
    const id = req.params.id;    
    
    const sql = 'delete from usuario where id = ?';
   
    conexion.query(sql, [id], (err, resultado) => {
        if (err) {
            res.status(500).json({ mensaje: 'Error al eliminar el usuario' });
        } else if (resultado.affectedRows === 0) {
            res.status(404).json({ mensaje: 'Usuario no encontrado' });
        } else {
            res.json({ mensaje: 'Usuario eliminado' , affectedRows: resultado.affectedRows });
        }
    });

});






app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
