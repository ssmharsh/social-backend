const Pool = require("pg").Pool;
require("dotenv").config();

const {generateToken} = require("../controllers/auth")


const isProduction = process.env.NODE_ENV === "production";
const connectionString = `postgresql://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`;
const pool = new Pool({
    connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
    ssl: {
        rejectUnauthorized: false,
    },
});



exports.authenticate = async (req, res) => {
    const text = "Select userid FROM users Where email = $1 and password = $2";
    const params =[req.body.email,req.body.password];
    try{
        const db = await pool.query(text,params);
        if(db.rowCount>=1){
            let id = db.rows[0].userid;
            let token = generateToken(id);

            return {
                token : token,
                statusCode: 200,
            };
        }
        else{
            return {
                message :"Invalid email or password",
                statusCode: 401,
            };
        }

    } catch(error) {
        return {
            statusCode: 501,
            error: "Internal Server error",
        };
    }
}


exports.follow = async (req, res) => {
    const text = "Select * FROM follow Where followBy = $1 and followTo= $2";
    const params =[req.userId,req.params.id];
    try{
        const db = await pool.query(text,params);
        if(db.rowCount == 0){

            const update = "Insert into follow (followBy,followTo) VALUES ($1,$2)";;
            const db1 = await pool.query(update,params);
            return {
                statusCode: 200,
                message: "User Successfully followed.",
            };                
        }
        else{
            return {
                statusCode: 200,
                message: "User is Already followed.",
            }; 
        }
    } catch(error) {
        return {
            statusCode: 501,
            error: "Internal Server error",
        };
    }
}

exports.unfollow = async (req, res) => {
    const text = "Select * FROM follow Where followBy = $1 and followTo= $2";
    const params =[req.userId,req.params.id];
    
    try{
        const db = await pool.query(text,params);
        if(db.rowCount == 1){

            const update = "DELETE FROM follow Where followBy = $1 and followTo= $2";
            const db1 = await pool.query(update,params);
            return {
                statusCode: 200,
                message: "User Successfully unfollowed.",
            };                
        }
        else{
            return {
                statusCode: 200,
                message: "User is Already unfollowed.",
            }; 
        }
    } catch(error) {
        return {
            statusCode: 501,
            error: "Internal Server error",
        };
    }
}


exports.profile = async (req, res) => {
    const text1 = "Select count(*) FROM follow Where followBy = $1";
    const text2 = "Select count(*) FROM follow Where followTo = $1";
    const text3 = "Select username FROM users Where userid = $1";
    const params =[req.userId];
    try{
        const db1 = await pool.query(text1,params);
        const db2 = await pool.query(text2,params);
        const db3 = await pool.query(text3,params);
        const data ={
            userName:  db3.rows[0].username,
            followers: db2.rows[0].count,
            following: db1.rows[0].count
        };
        return {
            user: data,
            id: req.userId,
            statusCode: 200,
          };

    } catch(error) {
        return {
            statusCode: 501,
            error: "Internal Server error",
        };
    }
}


exports.create = async (req, res) => {
    const text = "Insert into posts (userId,title,description,ts) VALUES ($1,$2,$3,$4)";
    let dateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const params =[req.userId,req.body.title,req.body.description,dateTime];
    try{
        const db = await pool.query(text,params);
        const text1 ="Select max(postId) from posts";
        const db1 = await pool.query(text1);
        
        return {
            postId : db1.rows[0].max,
            title : req.body.title,
            description : req.body.description,
            time : dateTime,
            userid: req.userId,
            statusCode: 200,
          };

    } catch(error) {
        return {
            statusCode: 501,
            error: "Internal Server error",
        };
    }
}


exports.delete = async (req, res) => {
    const text = "DELETE FROM posts Where postId = $1";
    const params =[req.body.postId];
    try{
        const db = await pool.query(text,params);
        return {
            message : "post Successfully deleted",
            statusCode: 200,
          };

    } catch(error) {
        return {
            statusCode: 501,
            error: "Internal Server error",
        };
    }
}



exports.like = async (req, res) => {
    const text = "Insert into likes (userId,postId) VALUES ($1,$2)";
    const params =[req.userId,req.body.postId];

    try{
        const db = await pool.query(text,params);
        return {
            statusCode: 200,
            message: "post Successfully liked.",
        };                
    } catch(error) {
        return {
            statusCode: 501,
            error: "Internal Server error",
        };
    }
}

exports.unlike = async (req, res) => {
    const text = "DELETE FROM likes Where userId = $1 and postId = $2";
    const params =[req.userId,req.body.postId];

    try{
        const db = await pool.query(text,params);
        return {
            statusCode: 200,
            message: "post Successfully unliked.",
        };                
    } catch(error) {
        return {
            statusCode: 501,
            error: "Internal Server error",
        };
    }
}


exports.comment = async (req, res) => {
    const text = "Insert into comments (comment,userId,postId) VALUES ($1,$2,$3)";
    const params =[req.body.comment,req.userId,req.body.postId];

    try{
        const db = await pool.query(text,params);
        return {
            statusCode: 200,
            message: "commented Successfully.",
        };                
    } catch(error) {
        return {
            statusCode: 501,
            error: "Internal Server error",
        };
    }
}

exports.display = async (req, res) => {
    const text1 = "Select * FROM likes Where postId = $1";
    const text2 = "Select * FROM comments Where postID = $1";
    const params =[req.body.postId];
    try{
        const db1 = await pool.query(text1,params);
        const db2 = await pool.query(text2,params);
        return {
            postId: req.body.postId,
            comments: db2.rowCount,
            likes: db1.rowCount,
            statusCode: 200,
          };

    } catch(error) {
        return {
            statusCode: 501,
            error: "Internal Server error",
        };
    }
}


exports.displayAll = async (req, res) => {
    const text1 = "Select * FROM posts Where userId = $1 ORDER BY ts DESC";
    const params =[req.userId];
    let posts = [];
    try{
        const db1 = await pool.query(text1,params);
        for (let post of db1.rows){
            const text2 ="Select count(*) FROM likes Where postId = $1";
            const params1=[post.postid];
            const db2 = await pool.query(text2,params1);

            const text3 ="Select comment FROM comments Where postId = $1";
            const db3 = await pool.query(text3,params1);

            let comments = [];
            for(let comment of db3.rows){
                comments.push(comment.comment);
            }
            const data ={
                postid: post.postid,
                title: post.title,
                desc: post.description,
                created_at: post.ts,
                likes: db2.rows[0].count,
                comments : comments
            };
            posts.push(data);
        }
        
        return {
            posts : posts,
            statusCode : 200,
          };

    } catch(error) {
        return {
            statusCode: 501,
            error: "Internal Server error",
        };
    }
}