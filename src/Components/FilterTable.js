import React, {useState} from 'react'
import {Col, Input} from 'reactstrap'

const FilterTable = ({data, setData, md}) => {
    const [filter, setFilter] = useState('')

    const onKeyUpSearch = ({value}) => {
        const keys = Object.keys(data[0] ? data[0] : {})

        setData(
            data.filter(element => {
                let includes = false,
                    concat = ''
                for (let key of keys) {
                    const text = element[key] ? element[key] : ''
                    concat = text !== '' ? `${concat} ${text.toString()}` : concat
                    if (typeof text === 'object') {
                        const keys2 = Object.keys(text)
                        let concat2 = ''
                        for (let key2 of keys2) {
                            const text2 = text[key2] ? text[key2] : ''
                            concat2 = text2 !== '' ? `${concat2} ${text2.toString()}` : concat2
                            includes = text2
                                .toString()
                                .toLowerCase()
                                .includes(value.toLowerCase())
                            includes = !includes
                                ? concat2
                                    .toString()
                                    .toLowerCase()
                                    .includes(value.toLowerCase())
                                : includes
                            if (includes) break
                        }
                    } else {
                        includes = text
                            .toString()
                            .toLowerCase()
                            .includes(value.toLowerCase())
                        includes = !includes
                            ? concat
                                .toString()
                                .toLowerCase()
                                .includes(value.toLowerCase())
                            : includes
                    }
                    if (includes) break
                }
                return includes
            })
        )
    }

    return (
        <Col md={md ? md : 6} className="btn-actions-pane-right">
            <Input
                type="text" bsSize="sm" value={filter}
                onChange={({target}) => setFilter(target.value)}
                onKeyUp={({target}) => onKeyUpSearch(target)}
                placeholder={`${data.length} registros...`}
            />
        </Col>
    )
}

export default FilterTable