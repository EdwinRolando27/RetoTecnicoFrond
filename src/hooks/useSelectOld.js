import React, {Fragment, useState} from 'react'
import Select from 'react-select'

import {customSelectStyles} from '../utils/constantes'

export default function useSelect({
                                      initialState, optionsState, isClearable, isDisabled, message, invalid
                                  }) {
    const [value, setValue] = useState(initialState ? initialState : '')
    const [options, setOptions] = useState(optionsState ? optionsState : [])
    const [disabled, setDisabled] = useState(isDisabled ? isDisabled : false)
    const selectValue  = (
        <Fragment>
            <Select
                placeholder={"Seleccionar..."}
                options={options}
                isOptionDisabled={option => option.disabled}
                value={options.filter(element => element.value === value)}
                isClearable={isClearable ? isClearable : false}
                isDisabled={disabled ? disabled : false}
                getOptionLabel={({label}) => label}
                getOptionValue={({value}) => value}
                onChange={e => setValue(e ? e.value : '')}
                noOptionsMessage={() => 'Sin opciones...'}
                styles={invalid ? {
                    ...customSelectStyles,
                    container: base => ({...base, backgroundColor: '#dc3545', padding: 1, borderRadius: 3})
                } : customSelectStyles}            />
            {invalid === true ? <small className="text-danger">{message}</small> : <></>}
        </Fragment>
    )

    return [value, selectValue, setValue, setOptions, setDisabled]
}