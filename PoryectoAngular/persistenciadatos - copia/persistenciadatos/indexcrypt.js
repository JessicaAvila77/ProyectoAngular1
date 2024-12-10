const express = require('express');
const bcrypt = require('bcrypt');
const fs = require('fs');
const app = express();
const PORT = 3000;
const jwt = require('jsonwebtoken');
const cors = require('cors');
const mysql = require('mysql2');
const SECRET_KEY = 'ClaveProyecto';


app.use(express.json());

app.use(cors());


const verificarToken=(req,res,next) =>{
   
    const authHeader = req.headers['authorization']; 
    if(!authHeader){ 
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


app.post('/login', async(req, res) =>{
    const {email, password} = req.body;

      
    const sql = 'SELECT * FROM usuario WHERE email = ?';

    conexion.query(sql, [email, password], async(err, resultados) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ mensaje: 'Error en el servidor' });
        }

        if (resultados.length === 0) {
            
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }

        const usuario = resultados[0];

        const isMatch = await bcrypt.compare(password, usuario.password);

       
       if (!isMatch) {
           return res.status(401).json({ mensaje: 'Credenciales inválidas' });
            
       } 

        const token = jwt.sign({ id: usuario.id, email: usuario.email }, SECRET_KEY, { expiresIn: '1h' });
       
        return res.json({ mensaje: 'Success', token });
          
        
    });

});



app.get('/usuarios', verificarToken, (req,res)=>{ 
    const sql = 'select * from usuario';
    conexion.query(sql, (err, resultado) =>{
        if(err){
            res.status(500).json({error:'Error al obtener los datos del usuario'});
        }else{
            res.json(resultado);
        }
    });
});

app.get('/inventario', verificarToken, (req,res)=>{ 
    const sql = 'select * from inventario';
    conexion.query(sql, (err, resultado) =>{
        if(err){
            res.status(500).json({error:'Error al obtener los datos del inventario'});
        }else{
            res.json(resultado);
        }
    });
});



app.get('/usuarios/:id', verificarToken, (req,res)=>{
  
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

app.get('/inventario/:id', verificarToken, (req,res)=>{
  
    const id = req.params.id;    
    
    const sql = 'SELECT * FROM inventario WHERE id = ?';
   
    conexion.query(sql, [id], (err, resultado) => {
        if (err) {
            res.status(500).json({ mensaje: 'Error al obtener el producto' });
        } else if (resultado.length === 0) {
            res.status(404).json({ mensaje: 'Producto no encontrado' });
        } else {
            res.json({ mensaje: 'Ok', producto: resultado[0] });
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

app.get('/inventario-nextid', (req,res)=>{
    const sql = 'SELECT MAX(id) AS maxId FROM inventario'; 

    conexion.query(sql, (err, resultado) => {
        if (err) {
            res.status(500).json({ mensaje: 'Error al obtener el siguiente ID' });
        } else {
            const maxId = resultado[0].maxId || 0; 
            res.json({ nextId: maxId + 1 });
        }
    });
});


app.post('/usuarios', verificarToken, async (req,res)=>{
    const { nombre, email, password, id_rol } = req.body; 

    const sql = 'INSERT INTO usuario (nombre, email, password, id_rol) VALUES (?, ?, ?, ?)'; 

    if(!nombre || !email || !password || !id_rol){
        return res.status(400).json({error:'Todos los campos son obligatorios'});
    }
    
    const saltRound = 10; 
    const ipassword = await bcrypt.hash(password, saltRound);
    

    conexion.query(sql, [nombre, email, ipassword, id_rol], (err, resultado) => {
        if (err) {
            res.status(500).json({ mensaje: 'Error al registrar el usuario', error: err });
        } else {
            res.status(201).json({ mensaje: 'Registro exitoso', userId: resultado.insertId });
        }
    });
});

app.post('/inventario', verificarToken, (req,res)=>{
    const { nombre, precio, cantidad } = req.body; 

    const sql = 'INSERT INTO inventario (nombre, precio, cantidad) VALUES (?, ?, ?)'; 

    if(!nombre || !precio || !cantidad){
        return res.status(400).json({error:'Todos los campos son obligatorios'});
    }
    

    conexion.query(sql, [nombre, precio, cantidad], (err, resultado) => {
        if (err) {
            res.status(500).json({ mensaje: 'Error al registrar el producto', error: err });
        } else {
            res.status(201).json({ mensaje: 'Registro exitoso', prodId: resultado.insertId });
        }
    });
});


app.put('/usuarios/:id', verificarToken, async(req, res) => {
    const id = req.params.id; 
    const { nombre, email, password, id_rol } = req.body; 

    const sql = `UPDATE usuario 
                 SET nombre = ?, email = ?, password = ?, id_rol = ? 
                 WHERE id = ?`;

    if (password) {
        //Encriptar la contraseña si se actualiza
       const saltRound = 10;
       const ipassword = await bcrypt.hash(password, saltRound);
        
        conexion.query(sql, [nombre, email, ipassword, id_rol, id], (err, resultado) => {
            if (err) {
                res.status(500).json({ mensaje: 'Error al actualizar el usuario', error: err });
            } else if (resultado.affectedRows === 0) {
                res.status(404).json({ mensaje: 'Usuario no encontrado' });
            } else {
                res.json({ mensaje: 'Usuario actualizado correctamente' });
            }
        
        });
    }
       
});



app.put('/inventario/:id', verificarToken, (req, res) => {
    const id = req.params.id; 
    const { nombre, precio, cantidad } = req.body; 

    const sql = `UPDATE inventario 
                 SET nombre = ?, precio = ?, cantidad = ? WHERE id = ?`;

    conexion.query(sql, [nombre, precio, cantidad, id], (err, resultado) => {
        if (err) {
            res.status(500).json({ mensaje: 'Error al actualizar el producto', error: err });
        } else if (resultado.affectedRows === 0) {
            res.status(404).json({ mensaje: 'Producto no encontrado' });
        } else {
            res.json({ mensaje: 'Producto actualizado correctamente' });
        }
    });
});



app.delete('/usuarios/:id', verificarToken, (req,res)=>{
   
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

app.delete('/inventario/:id', verificarToken, (req,res)=>{
   
    const id = req.params.id;    
    
    const sql = 'delete from inventario where id = ?';
   
    conexion.query(sql, [id], (err, resultado) => {
        if (err) {
            res.status(500).json({ mensaje: 'Error al eliminar el producto' });
        } else if (resultado.affectedRows === 0) {
            res.status(404).json({ mensaje: 'Producto no encontrado' });
        } else {
            res.json({ mensaje: 'Producto eliminado' , affectedRows: resultado.affectedRows });
        }
    });

});






app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
