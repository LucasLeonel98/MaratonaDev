/* Configurando o servidor */
const express = require("express")
const server = express()

//Configurando o servidor para apresentar arquivos estaticos
server.use(express.static('public'))

//Habilitar body do formulario
server.use(express.urlencoded({extended: true}))

//Configurando banco de dados
const Pool = require("pg").Pool
const db = new Pool({
    user: 'postgres',
    password: '1234',
    host: 'localhost',
    port: 5432,
    database: 'doe',
})

/* Configurando a template engine */
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true,
})


/* Configurar a apresentação da página */
server.get("/", function (req,res){

    db.query("SELECT * FROM donors", function(err,result) {
        if (err)  return res.send("Erro banco de dados")
        
        const donors = result.rows
        return res.render("index.html", {donors})
    })
    
})

server.post("/", function(req,res){
    //Pegar dados do formulario
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if (name == "" || email == "" || blood == "")
    {
        res.send("Todos os campos são obrigatórios.")
    }

    const query = `
        INSERT INTO donors ("name", "email", "blood") 
        VALUES ($1, $2, $3)`
    
    const values = [name, email, blood]

    db.query(query, values, function(err) {
       if (err) return res.send("Erro ao gravar no Banco de dados.")

       return res.redirect("/")
    })

    
})
/*ligar o servidor, permitir o acesso na porta 3000 */
server.listen(3000)