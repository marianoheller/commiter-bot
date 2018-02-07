const rimraf = require('rimraf');
const git = require('simple-git/promise');
const fs = require('fs');

const USER = process.env.GIT_USER;
const PASS = process.env.GIT_PASSWORD;
const REPO = process.env.GIT_REPO;

const remote = `https://${USER}:${PASS}@${REPO}`;
 

module.exports= function __commiter(req, res, next) {    

    const repoLocalPath = '.git_dump'
    const targetFile = 'README.md';
    
    rimraf(repoLocalPath, () => { 
        git().silent(true)
        .clone(remote, repoLocalPath)
        .then(() => timestampWriter(`${repoLocalPath}/${targetFile}`) )
        .then( () => git(repoLocalPath).add(targetFile) )
        .then( () => git(repoLocalPath).commit( String(Date.now()) ) )
        .then( () => git(repoLocalPath).push('origin', 'master') )
        .then( () => {
            console.log("FINISHED");
            next();
        } )
        .catch((err) => {
            console.error('failed: ', err);
            next();
        });
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

