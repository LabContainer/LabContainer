import React, { useState } from "react";
import {Table, TableBody, TableCell,TableContainer,TableHead,TableRow,Paper } from "@mui/material";
import SearchBar from "material-ui-search-bar";



interface students {
  name: string;
  Grade: number;
}

const originalRows: students[] = [
  { name: "Ani", Grade: 100},
  { name: "Sam", Grade: 100},
  { name: "Sowrov", Grade: 100},
  { name: "Parth", Grade: 100 },
];

export default function BasicTable() {
  const [rows, setRows] = useState<students[]>(originalRows);
  const [searched, setSearched] = useState<string>("");

  const requestSearch = (searchedVal: string) => {
    const filteredRows = originalRows.filter((row) => {
      return row.name.toLowerCase().includes(searchedVal.toLowerCase());
    });
    setRows(filteredRows);
  };

  const cancelSearch = () => {
    setSearched("");
    requestSearch(searched);
  };

  return (
    <>
      <Paper>
        <SearchBar
          value={searched}
          onChange={(searchVal) => requestSearch(searchVal)}
          onCancelSearch={() => cancelSearch()}
        />
        <TableContainer>
          <Table className="new" aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Grade</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.Grade}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <br />
    </>
  );
}
