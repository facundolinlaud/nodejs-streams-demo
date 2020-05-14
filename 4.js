'use strict';

const fs = require('fs');
const stream = require('stream');
const { promisify } = require('util');
const pipeline = promisify(stream.pipeline);


const writeStream = fs.createWriteStream(`${__filename}-output`);

const writeMyselfToFile = async () => {
    try {
        const alphabetStream = new AlphabetStream();
        const capitalizeStream = new CapitalizeStream();

        await pipeline(
            alphabetStream,
            capitalizeStream,
            writeStream
        );      
    } catch ({ message }) {
        console.log(message);
    }
};

class AlphabetStream extends stream.Readable {
    constructor() {
        super();
        this.alphabet = 'abcdefghijklmnñopqrstuvwxyz';
        this.i = 0;
    }

    _read(_sizeInBytes) {
        let isConsumerStillHungry;

        do {
            if (this.i >= this.alphabet.length) {   // if we are out of characters
                this.push(null);                    // we push null to signal we are done.
                return;                             // and exit
            }

            const character = this.alphabet.charAt(this.i);
            isConsumerStillHungry = this.push(character);
            console.log(`[     read] pushing  ${character}`);
            
            this.i += 1;
        } while(isConsumerStillHungry);

        console.log(`[     read] pausing`);
    };
};

class CapitalizeStream extends stream.Transform {
    _transform(chunk, _encoding, done) {
        const stringifiedChunk = chunk.toString();
        console.log(`[transform] received ${stringifiedChunk}`);

        this.push(stringifiedChunk.toUpperCase());
        done();
    };
};

writeMyselfToFile();