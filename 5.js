'use strict';


const stream = require('stream');
const { promisify } = require('util');
const pipeline = promisify(stream.pipeline);




const writeMyselfToFile = () => {
    try {
        const alphabetStream = new AlphabetStream();
        const capitalizeStream = new CapitalizeStream();
        const customStdoutStream = new CustomStdoutStream();

        pipeline(
            alphabetStream,
            capitalizeStream,
            customStdoutStream
        );      
    } catch ({ message }) {
        console.log(message);
    }
};

class CustomStdoutStream extends stream.Writable {
    _write(chunk, _encoding, done){
        const stringifiedChunk = chunk.toString();
        console.log(`[write stream] ${stringifiedChunk}`);
        done();
    };
};

class AlphabetStream extends stream.Readable {
    constructor() {
        super({ highWaterMark: 1 });                // we add a highWaterMark of 1, that is, we will flush our buffer every pushed char
                                                    // (we perform no buffering whatsoever)
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
            console.log(`[read stream] pushing  ${character}`);
            
            this.i += 1;
        } while(isConsumerStillHungry);

        console.log(`[read stream] pausing`);
    };
};

class CapitalizeStream extends stream.Transform {
    _transform(chunk, _encoding, done) {
        const stringifiedChunk = chunk.toString();
        console.log(`[transform stream] read ${stringifiedChunk}`);

        this.push(stringifiedChunk.toUpperCase());
        done();
    };
};

writeMyselfToFile();

// Read Stream (file in disk) --> Transform Stream (capitalizer) ---> Write Stream (our custom stdout)