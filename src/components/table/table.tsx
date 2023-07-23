import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

interface TableHeadsPropTypes {
  headCells: HeadCellPropTypes[];
  classes: any;
}

interface HeadCellPropTypes {
  id: number,
  label: string,
}

const EnhancedTableHead = (props: TableHeadsPropTypes) => {
  const { classes, headCells } = props;

  return (
    <TableHead className={classes.tableHead}>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            style={{
              fontWeight: 'bold',
              fontSize: 20,
            }}
            key={headCell.id}
            align="center"
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paper: {
    minWidth: '50%',
    marginBottom: theme.spacing(2),
    borderRadius: '10px',
  },
  tableHead: {
    backgroundColor: 'grey',
    borderRadius: '10px',
  },
}));

const EnhancedTable = (props: any) => {
  const {
    data,
    page,
    headCells,
    onChangePage,
    totalRows,
  } = props;
  const classes = useStyles();
  const rowsPerPage = 5;

  return (
    <div className={classes.root}>
      <Paper className={classes.paper} variant="elevation" elevation={4} square={false}>
        <TableContainer>
          <Table
            aria-labelledby="tableTitle"
            size='medium'
            aria-label="enhanced table"
          >
            <EnhancedTableHead classes={classes} headCells={headCells} />
            <TableBody>
              {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row: any, index: number) => {
                const labelId = `enhanced-table-${index}`;
                return (
                  <TableRow
                    key={row.name}
                  >
                    {
                      headCells && headCells.map((dataPerRow: any) => {
                        return (
                          <TableCell key={row[dataPerRow.id]} component="th" id={labelId} align="center">
                            {row[dataPerRow.id]}
                          </TableCell>
                        )
                      })
                    }
                  </TableRow>
                );
              })}
              {
                totalRows === 0 &&
                <TableRow>
                  <TableCell component="th" id="no-data" align="center">
                    No Data
                  </TableCell>
                </TableRow>
              }
            </TableBody>
          </Table>
        </TableContainer>
        {
          totalRows !== 0 &&
          <TablePagination
            component="div"
            count={totalRows}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={onChangePage}
            rowsPerPageOptions={[]}
          />
        }
      </Paper>
    </div>
  );
}

export default EnhancedTable;