const rimraf = require('rimraf');
const gitPromise = require('simple-git/promise');
const git = require('simple-git');
const fs = require('fs');

const USER = process.env.GIT_USER;
const PASS = process.env.GIT_PASSWORD;
const REPO = process.env.GIT_REPO;

const remote = `https://${USER}:${PASS}@${REPO}`;
 

module.exports= function __commiter(req, res, next) {    

    const repoLocalPath = '.git_dump'
    const targetFile = 'README.md';
    
    rimraf(repoLocalPath, () => { 
        gitPromise()
        .silent(true)
        .clone(remote, repoLocalPath)
        .then(() => timestampWriter(`${repoLocalPath}/${targetFile}`) )
        .then( () => git(repoLocalPath).add(targetFile) )
        .then( () => {
            return git(repoLocalPath)
            .addConfig('user.name', 'Bot commiter')
            .addConfig('user.email', 'marianofheller@gmail.com')
            .commit( String( Date.now() ), { '--author': '"Bot <bot@commiter.com>"' } ) 
        })
        .then( () => {
            return git(repoLocalPath)
            .addConfig('user.name', 'Bot commiter')
            .addConfig('user.email', 'marianofheller@gmail.com')
            .push('origin', 'master')
        } )
        .then( () => {
            console.log("FINISHED");
            next();
        } )
        .catch((err) => {
            console.error('failed: ', err);
            next();
        })
    });
}



function timestampWriter(targetPath) {
    return new Promise( (resolve, reject) => {
        fs.writeFile(targetPath, String(Date.now()), function(err) {
            if(err) reject(err);
            resolve("Success!");
        }); 
    })
}

