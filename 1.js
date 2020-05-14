'use strict';

const fs = require('fs');
const stream = require('stream');
const { promisify } = require('util');
const pipeline = promisify(stream.pipeline);

const readStream = fs.createReadStream(__filename);
const writeStream = fs.createWriteStream(`${__filename}-output`);

const writeMyselfToFile = async () => {
    await pipeline(
        readStream, 
        writeStream
    );
};

writeMyselfToFile();