import {
    usePagination, useSortBy, useTable, useFilters, useGlobalFilter, useAsyncDebounce, useExpanded
} from 'react-table'
import {faAngleDoubleLeft, faAngleDoubleRight, faAngleLeft, faAngleRight} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Table, Input, Row, Col, Button} from "reactstrap"
import React, {Fragment, useState, useEffect} from 'react'

const ReactTable = ({
                        columns, data, getHeaderProps = () => ({}), getColumnProps = () => ({}),
                        getRowProps = () => ({}), getCellProps = () => ({}), renderRowSubComponent, setPaginate,
                        globalSearch = true, pagination = true, total, setSize
                    }) => {

    const {
            getTableProps, getTableBodyProps, headerGroups, footerGroups, prepareRow, page,
            nextPage, previousPage, setPageSize, visibleColumns,
            state: {pageSize, globalFilter}, preGlobalFilteredRows, setGlobalFilter
        } = useTable({columns, data, initialState: {}},
            useFilters, useGlobalFilter, useSortBy, useExpanded, usePagination
        ),

        GlobalFilter = ({preGlobalFilteredRows, globalFilter, setGlobalFilter}) => {
            const [value, setValue] = useState(globalFilter || ''),
                onChange = useAsyncDebounce(value => setGlobalFilter(value || undefined), 200)

            return (
                <Col md={12} className='btn-actions-pane-right mb-2 mt-2 pr-0'>
                    <Input
                        bsSize='sm'
                        value={value || ''}
                        onChange={({target}) => {
                            setValue(target.value)
                            onChange(target.value)
                        }}
                        placeholder={`${total} trabajadores...`}
                    />
                </Col>
            )
        },
        [pagesTable, usePagesTable] = useState(1);
    const [canPreviousPage, setCanPreviousPage] = useState(true)
    const [canNextPage, setCanNextPage] = useState(true)
    const [pageIndex, setPageIndex] = useState(0)
    const [pageCount, setPageCount] = useState(0)
    const [pageOptions, setPageOptions] = useState([])
    useEffect(() => {
        setCanNextPage(pageIndex === pageCount || pageCount === 0)
        setCanPreviousPage(pageIndex === 1)
    }, [pageIndex, pageCount])
    useEffect(() => {
        setPageIndex(pagesTable)
    }, [pagesTable])
    useEffect(() => {
        const lenght = Math.trunc(Number(total) / Number(pageSize)) + ((Number(total) % Number(pageSize)) > 0 ? 1 : 0)
        let pageOptions = [],
            pageCount = 0
        for (let i = 0; i < lenght; i++) {
            pageOptions = [...pageOptions, i]
        }
        pageCount = pageOptions.length
        setPageCount(pageCount)
        setPageOptions(pageOptions)
    }, [total, pageSize])
    useEffect(() => {
        setPaginate(pagesTable)
    }, [pagesTable])
    useEffect(() => {
        setSize(pageSize)
    }, [pageSize])
    const gotoPage = (number) => {
        usePagesTable(number < pageOptions.length ? number : pageOptions.length)
    }

    return (
        <Fragment>
            <Row>
                <Col md={8} style={{textAlign: '-webkit-right', alignSelf: 'center', paddingRight: '0px'}}>
                    <strong style={{fontSize: '15px'}}>Buscar : </strong>
                </Col>
                <Col md={4} style={{paddingLeft: '0px'}}>
                    {
                        globalSearch ?
                            <GlobalFilter {...{preGlobalFilteredRows, globalFilter, setGlobalFilter}} /> : <></>
                    }
                </Col>
            </Row>
            <Table striped bordered hover size='sm' responsive {...getTableProps()} >
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
                                    {column.isSorted ? column.isSortedDesc ? '🔽' : '⬆️' : ''}
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
                            <Fragment key={row.original.id}>
                                <tr {...rowProps} style={{fontSize: '0.7rem'}}>
                                    {row.cells.map(cell => (<td {...cell.getCellProps([
                                        {
                                            className: cell.column.className,
                                            style: {
                                                ...cell.column.style,
                                                padding: '0 .1rem 0 .1rem'
                                            }
                                        },
                                        getColumnProps(cell.column), getCellProps(cell)])}>{cell.render('Cell')}</td>))}
                                </tr>

                                {row.isExpanded ? (
                                    <tr>
                                        <td/>
                                        <td colSpan={visibleColumns.length - 1}>
                                            {renderRowSubComponent({row, rowProps, visibleColumns})}
                                        </td>
                                    </tr>
                                ) : null}
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
            {
                pagination ? <Row style={{maxWidth: 1000, margin: "0 auto", textAlign: "center"}}>
                    <Col md={5}>
                        <Button color="primary" className="p-1 mr-1" disabled={canPreviousPage}
                                onClick={() => gotoPage(1)}
                        >
                            <FontAwesomeIcon icon={faAngleDoubleLeft}/>
                        </Button>
                        <Button color="primary" disabled={canPreviousPage} className="p-1 mr-1"
                                onClick={() => usePagesTable(pagesTable - 1)}>
                            <FontAwesomeIcon icon={faAngleLeft}/>
                        </Button>
                    </Col>
                    <Col md={2} style={{marginTop: 7}}>
                        Página{" "}
                        <strong>{pageIndex ? pageIndex : 1}</strong> de <strong>{pageOptions.length}</strong>
                    </Col>
                    {/*<Col md={2}>*/}
                    {/*    <Select options={PAGINATION} value={PAGINATION.filter(element => element.value === pageSize)}*/}
                    {/*            getOptionLabel={({label}) => label} getOptionValue={({value}) => value}*/}
                    {/*            onChange={({value}) => setPageSize(Number(value))} styles={{*/}
                    {/*        ...customSelectStyles, container: base => ({...base, padding: 1, borderRadius: 3})*/}
                    {/*    }}*/}
                    {/*    />*/}
                    {/*</Col>*/}
                    <Col md={5}>
                        <Button color="primary" disabled={canNextPage} className="p-1 mr-1"
                                onClick={() => usePagesTable(pagesTable + 1)}>
                            <FontAwesomeIcon icon={faAngleRight}/>
                        </Button>
                        <Button color="primary" className="p-1" disabled={canNextPage}
                                onClick={() => gotoPage(pageCount)}
                        >
                            <FontAwesomeIcon icon={faAngleDoubleRight}/>
                        </Button>
                    </Col>
                </Row> : <></>
            }
        </Fragment>
    )
}

export default ReactTable