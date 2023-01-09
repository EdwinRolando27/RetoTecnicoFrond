import React, {Fragment} from 'react'

const SysErrEx = () => {
    return (
        <Fragment>
            <div className="no-results">
                <div className="sa-icon sa-success animate">
                    <span className="sa-line sa-tip animateSuccessTip"/>
                    <span className="sa-line sa-long animateSuccessLong"/>

                    <div className="sa-placeholder"/>
                    <div className="sa-fix"/>
                </div>
                <div className="results-subtitle">All caught up!</div>
                <div className="results-title">There are no system errors!</div>
            </div>
        </Fragment>
    )
}

export default SysErrEx