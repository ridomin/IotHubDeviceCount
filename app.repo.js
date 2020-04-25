'use strict'

let fs = require('fs')

function escapeRegExp(string) {
    return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace)
}


const getModelByIdAsync =  (modelId) => {
    const fileName = 'models/sample1/' +  replaceAll(modelId, ':', '_').replace(';','__') + '.json'
    return new Promise((resolve, reject) => {
        if (fs.existsSync(fileName)) {
            fs.readFile(fileName, 'utf-8',  (err, d) => { 
                if (err) reject(err)
                resolve(d)
            })
        } else {
            resolve(false)
        }
    })
}

module.exports = {getModelByIdAsync}