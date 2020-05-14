'use strict';

const fs = require('fs');
const stream = require('stream');
const { promisify } = require('util');
const pipeline = promisify(stream.pipeline);

const readStream = fs.createReadStream(__filename);
const writeStream = fs.createWriteStream(`${__filename}-output`);

const writeMyselfToFile = () => {
    pipeline(
        readStream, 
        writeStream
    );
};

writeMyselfToFile();

// Read Stream (file in disk) --> Write Stream (file 2.js-output in disk)