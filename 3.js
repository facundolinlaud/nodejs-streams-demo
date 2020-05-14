'use strict';

const fs = require('fs');
const stream = require('stream');
const { promisify } = require('util');
const pipeline = promisify(stream.pipeline);

const readStream = fs.createReadStream(__filename);
const writeStream = fs.createWriteStream(`${__filename}-output`);

const writeMyselfToFile = async () => {
    try {
        const capitalizeStream = new CapitalizeStream();

        await pipeline(
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