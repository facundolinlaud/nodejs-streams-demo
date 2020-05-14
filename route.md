# Node Streams

## Bucket

- Streams vs promises: por qué no se llevan bien (streams fallan inmediatamente, promises solo al ser evaluadas)
- Diferentes maneras de implementar una stream
  - Instanciando Stream
  - Extendiendo Stream
  - Next steps: funciones generadoras
    - `Readable.from`
- Object mode vs non-object mode
- Errores comunes:
  - No acumular datos (memory spikes)
- Buffers?
  - Encode
- Read vs Write vs Transform (duplex)
- Testing streams
  - `stream-mock` library
- EventEmitter (comentario)
- ~~Push vs poll~~
- Backpressuring
  - `write()` vs `_write()`
  - `pause()` and `drain()` events
  - Minimizar calls al gc
  - default `highWaterMark` (`16` for object mode and `16kb` for non-object mode)
  - Practicas:
    - Never `.push()` if you are not asked.
    - Never call `.write()` after it returns false but wait for 'drain' instead.
    - Streams changes between different Node.js versions, and the library you use. Be careful and test things.



```javascript
const testTransformStream = (transform) => {
  const reader = new ObjectReadableMock([chunk1, chunk2, ...]);
  const writer = new ObjectWritableMock();

  await pipeline(reader, transform, writer);

  return writer.data;
}
```



## Casos

1. **Readable** File –> **Writable** File
   1. `pipeline`
   2. `on.('error')`
   3. `try catch`
2. Throw
3. Custom **Transformable**: capitalizar letras
   1. No acumular datos (memory spikes)
4. Custom **Readable**: letras de una string
   1. `_read(bytes)`
   2. `push(): boolean` **// backpressuring**
      1. Retorna un boolean indicando si el consumidor puede seguir consumiendo (highWaterMark)
      2. Si retorna `true`, seguir pusheando
      3. Si retorna `false`, hacer back off (se retoma cuando la write stream invoca `drain`)
      4. **Cada stream tiene un buffer**
   3. `read(bytes)` standalone
   4. `pause()` y `resume()` que funcionan sobre `_read()`
5. Custom **Writable**: console log
   1. `_write()` vs `write()`
   2. `drain()` que se propaga al source
   3. `write()` standalone
6. Custom **Transformable**: objetizar el coso que llega
   1. Object mode vs non-object mode
   2. Cómo especificar un custom `highWaterMark` (object mode vs non-object mode)
7. Extras
   1. Testing: `stream-mock` que te permite stubbear y mockear streams
   2. Promises y event emitter
   3. Funciones generadoras como streams (adri)



**3.4**

```js
const readable = getReadableStreamSomehow();
readable.on('data', (chunk) => {
  console.log(`Received ${chunk.length} bytes of data.`);
  readable.pause();
  console.log('There will be no additional data for 1 second.');
  setTimeout(() => {
    console.log('Now data will start flowing again.');
    readable.resume();
  }, 1000);
});
```

