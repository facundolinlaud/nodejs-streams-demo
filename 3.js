'use strict';

const fs = require('fs');
const stream = require('stream');
const { promisify } = require('util');
const pipeline = promisify(stream.pipeline);

const readStream = fs.createReadStream(__filename);
const writeStream = fs.createWriteStream(`${__filename}-output`);

const writeMyselfToFile = () => {
    try {
        const capitalizeStream = new CapitalizeStream();

        pipeline(
            readStream,
            capitalizeStream,
            writeStream
        );      
    } catch ({ message }) {
        console.log(message);
    }
};

class CapitalizeStream extends stream.Transform {
    _transform(chunk, _encoding, done) {
        const stringifiedChunk = chunk.toString();
        this.push(stringifiedChunk.toUpperCase());
        done();
    };
};

writeMyselfToFile();

// Read Stream (file in disk) --> Transform Stream (capitalizer) ---> Write Stream (file 3.js-output in disk)