import React, {Fragment, useState} from 'react'
import Select from 'react-select'

import {customSelectStyles} from '../utils/constantes'

export default function useSelect({
                                      initialState, optionsState, isClearable, initialMessage, isDisabled, onBlur,
                                      backgroundColor = ''
                                  }) {
    const [value, setValue] = useState(initialState ? initialState : '')
    const [options, setOptions] = useState(optionsState ? optionsState : [])
    const [invalid, setInvalid] = useState(false)
    const [message, setMesssage] = useState(initialMessage ? initialMessage : '')
    const [disabled, setDisabled] = useState(isDisabled ? isDisabled : false)

    const selectElement = (
        <Fragment>
            <Select
                placeholder='Seleccionar...'
                options={options}
                isOptionDisabled={option => option.disabled}
                value={options.filter(element => element.value === value)}
                isClearable={isClearable ? isClearable : false}
                isDisabled={disabled ? disabled : false}
                getOptionLabel={({label}) => label}
                getOptionValue={({value}) => value}
                onChange={e => setValue(e ? e.value : '')}
                noOptionsMessage={() => 'Sin opciones...'}
                onBlur={onBlur ? onBlur : () => {}}
                styles={invalid ? {
                    ...customSelectStyles,
                    container: base => ({...base, backgroundColor: '#dc3545', padding: 1, borderRadius: 5})
                } : {
                    ...customSelectStyles,
                    container: base => ({...base, backgroundColor, padding: 2, borderRadius: 5})
                }}/>
            {invalid === true ? <small className="text-danger">{message}</small> : <></>}
        </Fragment>
    )
    return [value, selectElement, setValue, setInvalid, setOptions, setMesssage, invalid, setDisabled]
}