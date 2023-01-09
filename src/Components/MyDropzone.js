import React from 'react'
import Dropzone from 'react-dropzone'

const MyDropzone = ({onDrop, accept, placeholder, disabled, height, maxSize = Infinity}) => (
    <Dropzone {...{onDrop, accept, multiple: false, disabled, height, maxSize}}>
        {({getRootProps, getInputProps}) => (
            <section className="dropzone-wrapper" style={{height: height ? height : 50}}>
                <div {...getRootProps()}>
                    <input {...getInputProps()}/>
                    <p className="m-0">{placeholder ? placeholder : 'Arrastre o haga clic para seleccionar el archivo'}</p>
                </div>
            </section>
        )}
    </Dropzone>
)

export default MyDropzone
