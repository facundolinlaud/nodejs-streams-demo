'use strict';

const fs = require('fs');
const stream = require('stream');
const { promisify } = require('util');
const pipeline = promisify(stream.pipeline);

const readStream = fs.createReadStream('NONEXISTENT-FILE.TXT'); // <----- This file does not exist!!!
const writeStream = fs.createWriteStream(`${__filename}-output`);

const writeMyselfToFile = () => {
    try {
        pipeline(
            readStream, 
            writeStream
        );      
    } catch ({ message }) {
        console.log(message);
    }
};

writeMyselfToFile();

// Read Stream (file in disk) --> Write Stream (file 2.js-output in disk)