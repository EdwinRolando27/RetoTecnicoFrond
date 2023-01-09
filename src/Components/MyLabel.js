import React from 'react'
import {Label} from 'reactstrap'

const MyLabel = ({name, requerid, color}) => {
    requerid = requerid ? requerid : false

    return (
        <Label className={`m-0 ${color ? color : ''}`}>
            <strong>{name}</strong>
            {requerid ? <span className="text-danger">*</span> : <></>}
        </Label>
    )
}

export default MyLabel
