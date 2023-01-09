import React, {Fragment, useState} from 'react'
import AsyncSelect from 'react-select/async'

import {customSelectStyles} from "../utils/constantes"

export default function useAsyncSelect({initialState, optionsState, initialMessage, isClearable, modelo}) {
    const [value, setValue] = useState(initialState ? initialState : '')
    const [options, setOptions] = useState(optionsState ? optionsState : [])
    const [invalid, setInvalid] = useState(false)
    const [message, setMesssage] = useState(initialMessage ? initialMessage : '')

    const promiseOptions = inputValue => new Promise(resolve => {
        setTimeout(() => {
            let {client, Model, respuesta, table, getByParam} = modelo
            getByParam = getByParam ? getByParam : 'getByParam'
            const query = table ? {table, param: inputValue} : inputValue
            resolve(Model
                [getByParam](client, query, 'value, label, code, name')
                .then(response => {
                    const data = response.data[respuesta]
                    setOptions(data)
                    return data
                })
                .catch(({message}) => console.log(message)))
        }, 100)
    })

    const selectElement = (
        <Fragment>
            <AsyncSelect
                placeholder="Seleccionar..."
                value={options.filter(element => element.label === value)}
                getOptionLabel={({label}) => label}
                getOptionValue={({label}) => label}
                isClearable={isClearable ? isClearable : false}
                loadOptions={promiseOptions}
                onChange={e => setValue(e ? e.label : '')}
                noOptionsMessage={() => 'Escriba para buscar...'}

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