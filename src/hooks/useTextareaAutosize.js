import React, {Fragment, useState} from 'react'
import TextareaAutosize from "react-textarea-autosize"
import {FormFeedback} from "reactstrap"

export default function useTextareaAutosize({
                                                initialState, placeholder, minRows, maxRows, initialMessage, maxLength,
                                                initialUpperCase, style, disabled
                                            }) {
    const [value, setValue] = useState(initialState ? initialState : '')
    const [invalid, setInvalid] = useState(false)
    const [message, setMesssage] = useState(initialMessage ? initialMessage : '')
    const [upperCase, setUpperCase] = useState(initialUpperCase ? initialUpperCase : false)
    const [isDisabled, setIsDisabled] = useState(disabled ? disabled : false)
    const texTareaValue = (
        <Fragment>
            <TextareaAutosize
                className={`form-control p-0 ${invalid ? 'is-invalid' : ''}`}
                value={value}
                placeholder={placeholder}
                onChange={({target}) => setValue(upperCase ? target.value.toUpperCase() : target.value)}
                style={style ? style : {}}
                minRows={minRows}
                maxRows={maxRows}
                maxLength={maxLength ? maxLength : ''}
                disabled={isDisabled}
                // autoFocus
            />
            <FormFeedback>{message}</FormFeedback>
        </Fragment>

    )

    return [value, texTareaValue, setValue, setInvalid, setMesssage, invalid, setIsDisabled, isDisabled]
}
