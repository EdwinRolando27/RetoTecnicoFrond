import React, {Fragment, useState} from 'react'
import {
    usePagination, useSortBy, useTable, useFilters, useGlobalFilter, useAsyncDebounce, useExpanded
} from 'react-table'
import {Table, Input, Row, Col, Button} from "reactstrap"
import Select from 'react-select'
import {faAngleDoubleLeft, faAngleDoubleRight, faAngleLeft, faAngleRight} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"

import {customSelectStyles, PAGINATION} from "../utils/constantes"

const GlobalFilter = ({preGlobalFilteredRows, globalFilter, setGlobalFilter}) => {
    const [value, setValue] = useState(globalFilter || '')
    const onChange = useAsyncDebounce(value => setGlobalFilter(value || undefined), 200)

    return (
        <Col md={6} className='btn-actions-pane-right mb-2 mt-2'>
            <Input bsSize='sm' value={value || ''} onChange={({target}) => {
                setValue(target.value)
                onChange(target.value)
            }} placeholder={`${preGlobalFilteredRows.length} registros...`}/>
        </Col>
    )
}

const ReactTable = ({
                        columns, data, getHeaderProps = () => ({}), getColumnProps = () => ({}),
                        getCellProps = () => ({}), renderRowSubComponent, globalSearch = true,
                        pagination = true, autoResetExpanded = true, responsive = false,
                        autoResetPage = false, renderGlobalSearchLeftComponent = <></>,
                        setData = () => {
                        }
                    }) => {
    const updateMyData = (rowIndex, columnId, value) => setData(old => old.map((row, index) => {
            if (index === rowIndex)
                return {
                    ...old[rowIndex],
                    [columnId]: value,
                }
            return row
        })
    )

    const {
        getTableProps, getTableBodyProps, headerGroups, footerGroups, prepareRow, page, canPreviousPage, canNextPage,
        pageOptions, pageCount, gotoPage, nextPage, previousPage, setPageSize, visibleColumns,
        state: {pageIndex, pageSize, globalFilter}, preGlobalFilteredRows, setGlobalFilter
    } = useTable({columns, data, initialState: {}, autoResetExpanded, autoResetPage, updateMyData},
        useFilters, useGlobalFilter, useSortBy, useExpanded, usePagination
    )

    return (
        <Fragment>
            <Row className={"p-0 ml-0"}>
                {renderGlobalSearchLeftComponent}
                {
                    globalSearch ? <GlobalFilter {...{preGlobalFilteredRows, globalFilter, setGlobalFilter}} /> : <></>
                }
            </Row>
            <Table striped bordered hover size='sm' responsive={!responsive} {...getTableProps()}>
                <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()} className="text-center" style={{
                        fontSize: '0.7rem',
                        color: "white",//'#096da9',
                        background: "#0d4a83",//'rgba(111,213,252,.3)'
                    }}>
                        {headerGroup.headers.map(column => (
                            // Add the sorting props to control sorting. For this example
                            // we can add them into the header props
                            <th {...column.getHeaderProps(column.getSortByToggleProps())}
                                style={{padding: '0', borderTop: column.Style ? 'hidden' : 'none'}}>
                                {column.render('Header')}
                                {/* Add a sort direction indicator */}
                                <span>
                                    {column.isSorted ? (column.isSortedDesc ? ' 🔻 ' : ' 🔺 ') : ''}
                                </span>
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>

                <tbody {...getTableBodyProps()}>
                {page.map((row, index) => {
                        prepareRow(row)
                        const rowProps = row.getRowProps()
                        return (
                            <Fragment key={index}>
                                <tr {...rowProps} style={{fontSize: '0.7rem'}}>
                                    {row.cells.map(cell => (<td {...cell.getCellProps([
                                        {
                                            className: cell.column.className,
                                            rowSpan: cell.column.rowSpan ? cell.column.rowSpan : 1,
                                            style: {
                                                ...cell.column.style,
                                                padding: '0 .1rem 0 .1rem',
                                            }
                                        },
                                        getColumnProps(cell.column), getCellProps(cell)])}>{cell.render('Cell')}</td>))}
                                </tr>

                                {row.isExpanded ? (<tr>
                                    <td/>
                                    <td colSpan={visibleColumns.length - 1}>
                                        {renderRowSubComponent({row, rowProps, visibleColumns})}
                                    </td>
                                </tr>) : null}
                            </Fragment>
                        )
                    })}
                </tbody>
                {
                    footerGroups.length > 1 ? (
                        <tfoot>
                        {
                            footerGroups.map((group, j) => {
                                if (j === 0) {
                                    return (
                                        <tr {...group.getFooterGroupProps()}>
                                            {group.headers.map(column => (
                                                <td {...column.getFooterProps()}
                                                    style={{padding: '0'}}>{column.Footer && column.render('Footer')}</td>
                                            ))}
                                        </tr>
                                    )
                                }
                            })
                        }
                        </tfoot>
                    ) : (<></>)
                }
            </Table>
            {
                pagination ? <Row style={{maxWidth: 1000, margin: "0 auto", textAlign: "center"}}>
                    <Col md={3}>
                        <Button color="primary" className="p-1 mr-1" onClick={() => gotoPage(0)}
                                disabled={!canPreviousPage}>
                            <FontAwesomeIcon icon={faAngleDoubleLeft}/>
                        </Button>
                        <Button color="primary" className="p-1" onClick={previousPage} disabled={!canPreviousPage}>
                            <FontAwesomeIcon icon={faAngleLeft}/>
                        </Button>
                    </Col>
                    <Col md={2} style={{marginTop: 7, padding: 0}}>
                        Página{' '}
                        <strong>{pageIndex ? pageIndex + 1 : 1}</strong> de <strong>{pageOptions.length}</strong>
                    </Col>
                    <Col md={2}>
                        <Input bsSize='sm' type="number" min={1} style={{width: 60}} max={pageOptions.length}
                               value={pageIndex ? pageIndex + 1 : 1}
                               onChange={({target}) => gotoPage(target.value ? Number(target.value) - 1 : 0)}
                        />
                    </Col>
                    <Col md={2}>
                        <Select options={PAGINATION} value={PAGINATION.filter(element => element.value === pageSize)}
                                getOptionLabel={({label}) => label} getOptionValue={({value}) => value}
                                onChange={({value}) => setPageSize(Number(value))} styles={{
                            ...customSelectStyles, container: base => ({...base, padding: 1, borderRadius: 3})
                        }}
                        />
                    </Col>
                    <Col md={3}>
                        <Button color="primary" className="p-1 mr-1" onClick={nextPage} disabled={!canNextPage}>
                            <FontAwesomeIcon icon={faAngleRight}/>
                        </Button>
                        <Button color="primary" className="p-1" onClick={() => gotoPage(pageCount - 1)}
                                disabled={!canNextPage}>
                            <FontAwesomeIcon icon={faAngleDoubleRight}/>
                        </Button>
                    </Col>
                </Row> : <></>
            }
        </Fragment>
    )
}

export default ReactTable