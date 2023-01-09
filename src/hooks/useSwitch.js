import React, {useState} from 'react'
import Switch from "react-switch"

const styleSwitch = {
    display: "flex", justifyContent: "center", alignItems: "center", height: "100%", color: "#FFF", paddingRight: 2,
    fontSize: 12
}

export default function useSwitch({initialState}) {
    const [value, setValue] = useState(initialState ? initialState : false)

    const inputValue = (
        <Switch onChange={() => setValue(!(value || false))} checked={value || false} onColor="#0d4a83" onHandleColor="#FFF" height={24}
                width={60} checkedIcon={<span style={styleSwitch}>SI</span>}
                uncheckedIcon={<span style={styleSwitch}>NO</span>}/>
    )

    return [value, inputValue, setValue]
}
