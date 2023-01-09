import React, {Fragment, useState} from 'react'
import AsyncCreatableSelect from 'react-select/async-creatable'

import {customSelectStyles} from "../utils/constantes"

export default function useAsyncCreatableSelect({
                                                    initialState, optionsState, initialMessage, isClearable, modelo,
                                                    handleCreate
                                                }) {
    const [value, setValue] = useState(initialState ? initialState : '')
    const [options, setOptions] = useState(optionsState ? optionsState : [])
    const [invalid, setInvalid] = useState(false)
    const [message, setMesssage] = useState(initialMessage ? initialMessage : '')

    let timer
    const promiseOptions = inputValue => new Promise(resolve => {
        clearTimeout(timer)
        const {client, Model, respuesta} = modelo
        timer = setTimeout(() => resolve(Model
            .getByParam(client, inputValue, 'value, label, code, name')
            .then(response => {
                const data = response.data[respuesta]
                setOptions(data)
                return data
            })
            .catch(({message}) => console.log(message))
        ), 500)
    })

    const selectElement = (
        <Fragment>
            <AsyncCreatableSelect
                placeholder="Seleccionar..."
                value={options.filter(element => element.value === value)}
                getOptionLabel={({label}) => label}
                getOptionValue={({value}) => value}
                isClearable={isClearable ? isClearable : false}
                loadOptions={promiseOptions}
                onChange={e => setValue(e ? e.value : '')}
                onCreateOption={handleCreate}
                noOptionsMessage={() => 'Escriba para buscar...'}
                formatCreateLabel={inputValue => `Crear "${inputValue}"`}
                styles={invalid ? {
                    ...customSelectStyles,
                    container: base => ({...base, backgroundColor: '#dc3545', padding: 1, borderRadius: 3})
                } : customSelectStyles}
            />
            {invalid === true ? <small className="text-danger">{message}</small> : <></>}
        </Fragment>
    )

    return [value, selectElement, setValue, setInvalid, setOptions, setMesssage, invalid]
}
