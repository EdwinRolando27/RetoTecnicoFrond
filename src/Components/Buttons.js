import React, {Fragment} from "react"
import {Button} from "reactstrap"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faFileAlt, faFileExcel, faPaperPlane, faClipboard} from "@fortawesome/free-solid-svg-icons"

const Buttons = ({buttons}) =>
    <Fragment>
        {
            buttons.map(({color, onClick, display, icon, text}, index) =>
                <Button key={index} className="btn-icon btn-pill mr-1" color={color} onClick={onClick}
                        style={{display: `${display}`}}>
                    <FontAwesomeIcon icon={icon}/> {text}
                </Button>
            )
        }
    </Fragment>

export default Buttons