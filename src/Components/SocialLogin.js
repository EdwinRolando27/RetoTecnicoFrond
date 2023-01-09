import React from 'react'
import SocialLogin from 'react-social-login'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Button} from "reactstrap"

const SocialButton = props => {
    return (
        <Button className="btn-wide mb-2 mr-2 btn-icon btn text-white" size="sm" style={{backgroundColor: props.color}}
                onClick={props.triggerLogin} {...props}>
            <FontAwesomeIcon icon={props.icon}/> {props.children}
        </Button>
    )
}

export default SocialLogin(SocialButton)