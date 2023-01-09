import React, {Fragment, useState} from 'react'
import Select from 'react-select'
import {customSelectStyles} from "../utils/constantes";

export default function useSelectMulti({initialState, optionsState, isClearable, invalidate, initialMessage, sdisabled}) {
    const [value, setValue] = useState(initialState ? initialState : [])
    const [options, setOptions]   = useState(optionsState ? optionsState : [])
    const [invalid, setInvalid]   = useState(false)
    const [disabled, setDisabled] = useState(sdisabled ? sdisabled : false)
    const [message, setMesssage]  = useState(initialMessage ? initialMessage : '')

    const selectValue = (
        <Fragment>
            <Select
                placeholder="Seleccionar..."
                options={options}
                isDisabled={disabled ? disabled: false}
                isClearable={isClearable ? isClearable : false}
                isMulti
                closeMenuOnSelect={false}
                value={value ? options.filter(element => value.includes(element.value)) : []}
                getOptionLabel={({label}) => label}
                getOptionValue={({value}) => value}
                onChange={e => setValue(e ? e.map(({value}) => value) : [])}
                styles={invalid ? {
                    ...customSelectStyles,
                    container: base => ({...base, backgroundColor: '#dc3545', padding: 1, borderRadius: 3})
                } : customSelectStyles}
            />
            {invalid === true ? <small className="text-danger">{message}</small> : <></>}
        </Fragment>
    )

    return [value, selectValue, setValue, setOptions, setInvalid, setMesssage, invalid, setDisabled]
}
