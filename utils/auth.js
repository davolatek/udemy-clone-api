import bcrypt from 'bcryptjs'


export const hashPassword = (password) =>{
    return new Promise((resolve, reject)=>{
        bcrypt.hash(password, 12, (err, hashedPassword)=>{
            if(err){
                reject(err)
            }
            resolve(hashedPassword)
        })
    })
}


export const comparePassword = (password, hashedPassword) =>{
    return bcrypt.compare(password, hashedPassword);
}