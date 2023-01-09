import React, {Fragment, useState} from 'react'
import {FormFeedback, Input} from 'reactstrap'
let timeout

export default function useInput({
                                     typeState, placeholder, initialState, maxLength, readOnly, min, max, disabled,
                                     invalidate, initialMessage, step, initialUpperCase, onBlur, style
                                 }) {
    const [value, setValue] = useState(initialState ? initialState : '')
    const [invalid, setInvalid] = useState(invalidate ? invalidate : false)
    const [message, setMesssage] = useState(initialMessage ? initialMessage : '')
    const [upperCase, setUpperCase] = useState(initialUpperCase ? initialUpperCase : false)
    const [isDisabled, setIsDisabled] = useState(disabled ? disabled : false)
    const [isKeyUp, setIsKeyUp] = useState(false)

    const inputValue = (
        <Fragment>
            <Input
                value={value || ''}
                onChange={({target}) => setValue(upperCase ? target.value.toUpperCase() : target.value)}
                type={typeState ? typeState : 'text'}
                invalid={invalid}
                style={style ? style : {}}
                placeholder={placeholder ? placeholder : ''}
                maxLength={maxLength ? maxLength : 255}
                bsSize="sm"
                min={min}
                max={max}
                required={true}
                step={step ? step : 1}
                disabled={isDisabled}
                readOnly={readOnly ? readOnly : false}
                onKeyUp={() => {
                    clearTimeout(timeout)
                    timeout = setTimeout(() => {
                        setIsKeyUp(true)
                        clearTimeout(timeout)
                    }, 500)
                }}
                onBlur={onBlur ? onBlur : () => {}}
            />
            <FormFeedback>{message}</FormFeedback>
        </Fragment>
    )

    return [value, inputValue, setValue, setInvalid, setMesssage, invalid, setUpperCase, isKeyUp, setIsKeyUp, setIsDisabled]
}