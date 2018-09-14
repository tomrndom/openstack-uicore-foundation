import React from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import SortableTableHeading from './SortableTableHeading';
import SortableTableCell from './SortableTableCell';
import SortableActionsTableCell from './SortableActionsTableCell';
import SortableTableRow from './SortableTableRow';
import T from 'i18n-react/dist/i18n-react';
import './table-sortable.css';

const defaults = {
    colWidth: ''
}

const createRow = (row, columns, actions) => {

    var action_buttons = '';
	var cells = columns.map((col,i) => {
		return (
		<SortableTableCell key={i}>
            {row[col.columnKey]}
		</SortableTableCell>
		);
	});

    if (actions) {
        cells.push(<SortableActionsTableCell key='actions' id={row['id']} actions={actions}/>);
    }

    return cells;
};


class SortableTable extends React.Component {

    constructor(props) {
        super(props);
        this.moveRow = this.moveRow.bind(this);
        this.dropRow = this.dropRow.bind(this);

        this.state = {
            rows: props.data
        };
    }

    componentWillReceiveProps(nextProps) {
        // You don't have to do this check first, but it can help prevent an unneeded render
        if (nextProps.data.length !== this.state.rows.length) {
            this.setState({ rows: nextProps.data });
        }
    }

    moveRow(dragIndex, hoverIndex) {
        const { rows } = this.state;
        const dragRow = rows[dragIndex];

        this.setState(update(this.state, {
            rows: {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, dragRow],
                ],
            },
        }));
    }

    dropRow(id, index) {
        let {orderField} = this.props;
        let newOrder = index + 1;
        let rows = [...this.state.rows];

        for(var i in rows) {
            rows[i][orderField] = parseInt(i) + 1;
        }

        this.setState(update(this.state, {rows: {$set: rows}}));

        this.props.dropCallback(rows, id, newOrder);
    }

    render() {
        let {options, columns, orderField} = this.props;

        let rows = this.state.rows.sort(
            (a, b) => (a[orderField] > b[orderField] ? 1 : (a[orderField] < b[orderField] ? -1 : 0))
        );

        return (
            <div className="sortable-table-box">
                <i>{T.translate("general.drag_and_drop")}</i>
                <table className={"table table-striped table-hover " + options.className}>
                    <thead>
                    <tr>
                        {columns.map((col,i) => {
                            let colWidth = (col.width) ? col.width : defaults.colWidth;
                            return (
                                <SortableTableHeading width={colWidth} key={i} >
                                    {col.value}
                                </SortableTableHeading>
                            );
                        })}
                        {options.actions &&
                        <SortableTableHeading key='actions' >
                            Actions
                        </SortableTableHeading>
                        }
                    </tr>
                    </thead>
                    <tbody>
                    {columns.length > 0 && rows.map((row,i) => {
                        if(Array.isArray(row) && row.length !== columns.length) {
                            console.warn(`Data at row ${i} is ${row.length}. It should be ${columns.length}.`);
                            return <tr />
                        }
                        return (
                            <SortableTableRow even={i%2 === 0} key={row.id} index={i} id={row.id} moveCard={this.moveRow} dropCard={this.dropRow}>
                                {createRow(row, columns, options.actions)}
                            </SortableTableRow>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        );
    }
};

SortableTable.propTypes = {
    data: PropTypes.array.isRequired,
    options: PropTypes.shape({
        className: PropTypes.string,
        actions: PropTypes.object
    }).isRequired,
    columns: PropTypes.shape({
        columnKey: PropTypes.string.isRequired,
        value: PropTypes.any.isRequired
    }).isRequired,
    orderField: PropTypes.string.isRequired,
    dropCallback: PropTypes.func.isRequired
}

export default DragDropContext(HTML5Backend)(SortableTable);
