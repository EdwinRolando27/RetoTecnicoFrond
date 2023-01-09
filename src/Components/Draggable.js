import React, {useEffect, useState} from "react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faChromecast} from "@fortawesome/free-brands-svg-icons"
import Draggable from "react-draggable"

const MyDraggable = ({mesa, getPedido}) => {
    const [setting, setSetting] = useState({
        id: mesa.id,
        pedido_id: mesa.pedido_id,
        activeDrags: 0,
        name: mesa.descripcion,
        deltaPosition: {x: mesa.x, y: mesa.y},
        controlledPosition: {x: mesa.x, y: mesa.y},
        defaultPosition: {x: mesa.x, y: mesa.y}
    })

    useEffect(() => {
        setSetting(prevState => ({...prevState, pedido_id: mesa.pedido_id}))
    }, [mesa])

    const handleDrag = (e, ui) => {
        const {x, y} = setting.deltaPosition
        setSetting(prevState => ({
            ...prevState,
            deltaPosition: {
                x: x + ui.deltaX,
                y: y + ui.deltaY,
            }
        }))
    }
    const onStart = () => setSetting(prevState => ({...prevState, activeDrags: ++prevState.activeDrags}))
    const onStop = () => setSetting(prevState => ({...prevState, activeDrags: --prevState.activeDrags}))
    const dragHandlers = {onStart: () => false, onStop}

    return (
        <Draggable bounds="parent" defaultPosition={setting.defaultPosition} onDrag={handleDrag}  {...dragHandlers}>
            <div className="text-center" style={{width: '5rem'}}
                 onClick={() => getPedido(setting.pedido_id, setting.id)}
                 onTouchStart={() => getPedido(setting.pedido_id, setting.id)}>
                <FontAwesomeIcon icon={faChromecast} size={"5x"}
                                 className={`text-${setting.pedido_id ? 'danger' : 'success'}`}/>
                <br/>
                <strong>{setting.name}</strong>
                {/*<br/>*/}
                {/*x: {setting.deltaPosition.x},*/}
                {/*y: {setting.deltaPosition.y}*/}
            </div>
        </Draggable>
    )
}

export default MyDraggable