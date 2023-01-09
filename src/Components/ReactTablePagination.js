import React, {Fragment, useEffect, useRef, useState, forwardRef} from 'react'
import {
    usePagination, useSortBy, useTable, useFilters, useGlobalFilter, useAsyncDebounce, useExpanded, useRowSelect
} from 'react-table'
import {Table, Input, Row, Col, Button} from "reactstrap"
import Select from 'react-select'
import {
    faAngleDoubleLeft, faAngleDoubleRight, faAngleLeft, faAngleRight
} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"

import {customSelectStyles, PAGINATION} from "../utils/constantes"
import FilterTable from "./FilterTable"

const IndeterminateCheckbox = forwardRef(
    ({indeterminate, ...rest}, ref) => {
        const defaultRef = useRef()
        const resolvedRef = ref || defaultRef

        useEffect(() => {
            resolvedRef.current.indeterminate = indeterminate
        }, [resolvedRef, indeterminate])

        return (
            <input type="checkbox" ref={resolvedRef} {...rest} />
        )
    }
)

const ReactTablePagination = ({
                                  columns, data, pageCount, pageOptions, dataAll, setData,
                                  getHeaderProps = () => ({}), getColumnProps = () => ({}), getRowProps = () => ({}),
                                  getCellProps = () => ({}), renderRowSubComponent, globalSearch = true,
                                  autoResetExpanded = true, responsive = false,
                                  autoResetPage = false, setShowData = () => ({}), rowSelect = false,
                                  setSelectedRows, showExpander = true
                              }) => {
    // Use the state and functions returned from useTable to build your UI
    let {
        getTableProps, getTableBodyProps, headerGroups, footerGroups, prepareRow, page, setPageSize, visibleColumns,
        selectedFlatRows, state: {pageSize}
    } = useTable({
            columns, data, autoResetExpanded, autoResetPage,
            initialState: {
                hiddenColumns: showExpander ? [] : ['expander']
            }
        },
        useFilters, useGlobalFilter, useSortBy, useExpanded, usePagination, useRowSelect,
        hooks => {
            if (rowSelect)
                hooks.visibleColumns.push(columns => [
                    // Let's make a column for selection
                    {
                        id: 'selection',
                        // The header can use the table's getToggleAllRowsSelectedProps method
                        // to render a checkbox
                        Header: ({getToggleAllPageRowsSelectedProps}) => (
                            <div className="mt-1">
                                <IndeterminateCheckbox {...getToggleAllPageRowsSelectedProps()} />
                            </div>
                        ),
                        // The cell can use the individual row's getToggleRowSelectedProps method
                        // to the render a checkbox
                        Cell: ({row}) => (
                            <div>
                                <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
                            </div>
                        ),
                    },
                    ...columns,
                ])
        }
    )
    const [canPreviousPage, setCanPreviousPage] = useState(true)
    const [canNextPage, setCanNextPage] = useState(true)
    const [pageIndex, setPageIndex] = useState(0)

    useEffect(() => {
        setShowData({pageIndex, pageSize})
    }, [pageIndex, pageSize, pageCount])

    const nextPage = () => setPageIndex(pageIndex + 1)
    const previousPage = () => setPageIndex(pageIndex - 1)
    const gotoPage = number => setPageIndex(number < pageOptions.length ? number : pageOptions.length - 1)

    useEffect(() => setPageIndex(0), [pageCount])

    useEffect(() => {
        setCanNextPage(pageIndex === pageCount - 1 || pageCount === 0)
        setCanPreviousPage(pageIndex === 0)
    }, [pageIndex, pageCount])

    useEffect(() => {
        if (rowSelect) setSelectedRows(selectedFlatRows.map(({original}) => original))
    }, [selectedFlatRows])

    return (
        <Fragment>
            <Row className={"p-0"} style={{paddingBottom: '5px'}}>
                {
                    globalSearch ? <FilterTable data={dataAll} {...{setData, md: 6}}/> : <></>
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
                    }
                )}
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
            <Row style={{maxWidth: 1000, margin: "0 auto", textAlign: "center"}}>
                <Col md={3}>
                    <Button color="primary" className="p-1 mr-1" disabled={canPreviousPage} onClick={() => gotoPage(0)}
                    >
                        <FontAwesomeIcon icon={faAngleDoubleLeft}/>
                    </Button>
                    <Button color="primary" className="p-1" disabled={canPreviousPage} onClick={previousPage}>
                        <FontAwesomeIcon icon={faAngleLeft}/>
                    </Button>
                </Col>
                <Col md={2} style={{marginTop: 7, padding: 0}}>
                    Página{' '}
                    <strong>{pageIndex ? pageIndex + 1 : 1}</strong> de <strong>{pageOptions.length}</strong>
                </Col>
                <Col md={2}>
                    <Input bsSize='sm' type="number" min={1} style={{width: 60}} max={pageCount}
                           value={pageIndex ? pageIndex + 1 > pageCount ? pageCount : pageIndex + 1 : 1}
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
                    <Button color="primary" className="p-1 mr-1" disabled={canNextPage} onClick={() => nextPage()}>
                        <FontAwesomeIcon icon={faAngleRight}/>
                    </Button>
                    <Button color="primary" className="p-1" disabled={canNextPage}
                            onClick={() => gotoPage(pageCount - 1)}
                    >
                        <FontAwesomeIcon icon={faAngleDoubleRight}/>
                    </Button>
                </Col>
            </Row>
        </Fragment>
    )
}

export default ReactTablePagination