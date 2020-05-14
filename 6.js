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
    constructor(){
        super({ objectMode: true });                // now that the transform stream will write this stream in object mode, we need to
                                                    // toggle object mode here
    }

    _write(chunk, _encoding, done){
        const stringifiedChunk = JSON.stringify(chunk);     // because chunk is now an object
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
    constructor(){
        super({
            writableObjectMode: false,      // we are still being written in bytes
            readableObjectMode: true        // but instead of being read in bytes, we are read in objects.
                                            // (readable high water marks are now counted on number of objects instead of bytes)
        })
    }

    _transform(chunk, _encoding, done) {
        const stringifiedChunk = chunk.toString();
        const object = {                                            // we create the object to be written
            [stringifiedChunk]: stringifiedChunk.toUpperCase()      // now if we read "abc", we will write {"abc": "ABC"}
        };

        console.log(`[transform stream] read ${stringifiedChunk}, writing ${JSON.stringify(object)}`);

        this.push(object);
        done();
    };
};

writeMyselfToFile();

// Read Stream (file in disk) --> Transform Stream (capitalizer) ---> Write Stream (our custom stdout)