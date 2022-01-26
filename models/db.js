const Pool = require("pg").Pool;
require("dotenv").config();


const isProduction = process.env.NODE_ENV === "production";
const connectionString = `postgresql://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`;
const pool = new Pool({
    connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
    ssl: {
        rejectUnauthorized: false,
    },
});

create_users = async () => {
    const text = `CREATE TABLE IF NOT EXISTS users  (
        userid SERIAL ,
        username varchar,
        email varchar(40),
        password varchar
    )`;
    const db = await pool.query(text);
}

create_follow = async () => {
    const text = `CREATE TABLE IF NOT EXISTS follow  (
        followBy int ,
        followTo int 
    )`;
    const db = await pool.query(text);
}

create_posts = async () =>{
    const text = `CREATE TABLE IF NOT EXISTS posts  (
        postId SERIAL PRIMARY KEY,
        userId int,
        title varchar(50),
        description varchar(250),
        ts TIMESTAMP
    )`;
    const db = await pool.query(text);
}

create_like = async () => {
    const text = `CREATE TABLE IF NOT EXISTS likes  (
        userId int ,
        postId int ,
        FOREIGN KEY(postId) REFERENCES posts(postId)
    )`;
    const db = await pool.query(text);
}

create_comments = async () => {
    const text = `CREATE TABLE IF NOT EXISTS comments  (
        commentId SERIAL,
        comment varchar(250),
        userId int ,
        postId int ,
        FOREIGN KEY(postId) REFERENCES posts(postId)
    )`;
    const db = await pool.query(text);
}


create_dummy = async () => {
    const query = "Select * from users";
    const users = await pool.query(query);
    if(users.rowCount==0){
        const text = "INSERT INTO users(username,email,password) VALUES ($1,$2,$3)"
        const params = ["reunion","reunion@email.com","reunion"];
        const db = await pool.query(text,params);
    }
}
exports.create_db = () => {
    create_users();
    create_follow();
    create_posts();
    create_like();
    create_comments();
    create_dummy();
}