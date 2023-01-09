import React, {Fragment, useState} from 'react'
import {Button, FormFeedback, Input, InputGroupAddon, InputGroup} from 'reactstrap'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faSearch} from "@fortawesome/free-solid-svg-icons"

export default function useInputGroup({
                                          typeState, placeholder, initialState, maxLength, readOnly, min, max, disabled,
                                          onClick, faIcon, initialMessage
                                      }) {
    const [value, setValue] = useState(initialState ? initialState : '')
    const [invalid, setInvalid] = useState(false)
    const [message, setMesssage] = useState(initialMessage ? initialMessage : '')

    const inputValue = (
        <Fragment>
            <InputGroup>
                <Input
                    value={value}
                    onChange={({target}) => setValue(target.value)}
                    type={typeState ? typeState : 'text'}
                    invalid={invalid}
                    placeholder={placeholder ? placeholder : ''}
                    maxLength={maxLength ? maxLength : 255}
                    bsSize="sm"
                    min={min}
                    max={max}
                    disabled={disabled ? disabled : false}
                    readOnly={readOnly ? readOnly : false}
                    onKeyUp={({keyCode}) => {
                        if (keyCode === 13) onClick()
                    }}
                />
                <InputGroupAddon addonType="append" style={{height: '31px'}}>
                    <Button className="btn btn-secondary" onClick={() => onClick()}>
                        <FontAwesomeIcon icon={faIcon ? faIcon : faSearch}/>
                    </Button>
                </InputGroupAddon>
                <FormFeedback>{message}</FormFeedback>
            </InputGroup>
        </Fragment>
    )

    return [value, inputValue, setValue, setInvalid, setMesssage, invalid]
}