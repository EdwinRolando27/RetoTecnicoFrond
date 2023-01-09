import React from 'react'
import { UncontrolledTooltip } from 'reactstrap'

const Tooltip = ({ id, name, placement = 'left' }) => (
  <UncontrolledTooltip placement={placement} target={id}>
    {name}
  </UncontrolledTooltip>
)

export default Tooltip
