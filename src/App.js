import "./App.css";
import { useEffect, useId, useState } from "react";

// components
import Button from "@mui/material/Button";
import {
  ButtonGroup,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormLabel,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import styled from "@emotion/styled";

import TableCell, { tableCellClasses } from "@mui/material/TableCell";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#021526",
    color: "White",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "#FBFBFB",
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export function getFromLocalStorage(key) {
  try {
    const serializedData = localStorage.getItem(key);
    if (serializedData === null) {
      return null;
    }
    return JSON.parse(serializedData);
  } catch (error) {
    console.error("Error retrieving data from local storage:", error);
    return null;
  }
}

export function setToLocalStorage(key, data) {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
  } catch (error) {
    console.error("Error storing data to local storage:", error);
  }
}

function App() {
  // states
  const [name, setName] = useState("");
  const [age, setAge] = useState();
  const [ageError, setAgeError] = useState(false);
  const [standard, setStandard] = useState(1);
  const [hasDisabilities, setHasdisabilities] = useState(false);
  const [gender, setGender] = useState("female");

  const showAlert = (message = "") => {
    alert(message);
  };

  useEffect(() => {
    const localRows = getFromLocalStorage("rows");
    if (localRows) {
      setRows(localRows);
    }
  }, []);

  const validate = () => {
    if (age > 100 || age < 5) {
      setAgeError(true);
      showAlert("Please add appropriate age!");
      setTimeout(() => {
        setAgeError(false);
      }, 3000);
      return false;
    } else {
      return true;
    }
  };

  const setInitialValues = () => {
    setName("");
    setAge("");
    setStandard(1);
    setGender("female");
    setHasdisabilities(false);
  };

  const formSubmit = () => {
    if (validate()) {
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const data = createData(id, name, age, standard, hasDisabilities, gender);

      const rowList = [data, ...rows];
      setRows(rowList);
      setToLocalStorage("rows", rowList);
      showAlert("Student added successfully!");
      setInitialValues();
    }
  };

  /// table part
  const [rows, setRows] = useState([]);
  const [editData, setEditData] = useState(null);

  function createData(id, name, age, standard, disibility, gender) {
    return { id, name, age, standard, disibility, gender };
  }

  const setDataForEdit = (data) => {
    setEditData(data);
    setName(data?.name);
    setAge(data?.age);
    setStandard(data?.standard);
    setGender(data?.gender);
    setHasdisabilities(data?.disibility);
  };

  const updateData = () => {
    if (validate()) {
      const data = createData(
        editData?.id,
        name,
        age,
        standard,
        hasDisabilities,
        gender
      );

      const updatedList = [...rows]?.map((row) => {
        if (editData?.id == row?.id) {
          return data;
        }
        return row;
      });
      setToLocalStorage("rows", updatedList);
      setRows(updatedList);
      setInitialValues();
    }
  };

  const deleteData = (id) => {
    const updatedList = [...rows]?.filter((row) => id !== row?.id);
    setToLocalStorage("rows", updatedList);
    setRows(updatedList);
  };

  return (
    <div className="App">
      <h1 style={{ padding: "10px 10px" }}>Student Form</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log(
            "submitted",
            name,
            age,
            standard,
            hasDisabilities,
            gender
          );
          if (editData) {
            updateData();
          } else {
            formSubmit();
          }
        }}
      >
        <FormGroup style={{ width: 500, padding: "40px 10px", paddingTop: 10 }}>
          <InputLabel id="name">Students full name</InputLabel>
          <TextField
            aria-labelledby="name"
            required
            id="outlined-required"
            // label="Required"
            // defaultValue="Hello World"
            placeholder="Students full name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />

          <InputLabel error={ageError} id="age">
            Age
          </InputLabel>
          <TextField
            aria-labelledby="age"
            required
            id="outlined-required"
            error={ageError}
            // label="Required"
            placeholder="Students age"
            type="number"
            value={age}
            onChange={(event) => setAge(event.target.value)}
          />

          <InputLabel id="select">Standard</InputLabel>
          <Select
            aria-labelledby="select"
            id="demo-simple-select"
            value={standard}
            onChange={(event) => {
              setStandard(event.target.value);
            }}
          >
            <MenuItem value={1}>First</MenuItem>
            <MenuItem value={2}>Second</MenuItem>
            <MenuItem value={3}>Third</MenuItem>
            <MenuItem value={4}>Fourth</MenuItem>
            <MenuItem value={5}>Fifth</MenuItem>
            <MenuItem value={6}>Sixth</MenuItem>
          </Select>

          <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="female"
            name="radio-buttons-group"
            value={gender}
            onChange={(event) => setGender(event.target.value)}
            required
          >
            <FormControlLabel
              value="female"
              control={<Radio />}
              label="Female"
            />
            <FormControlLabel value="male" control={<Radio />} label="Male" />
            <FormControlLabel value="other" control={<Radio />} label="Other" />
          </RadioGroup>

          <FormControlLabel
            control={
              <Checkbox
                value={hasDisabilities}
                onChange={(event) => setHasdisabilities(event.target.value)}
              />
            }
            label="Has any disabilities ?"
          />
          <Button type="submit" variant="contained" size="large">
            {editData ? "Edit student data" : "Create student"}
          </Button>
        </FormGroup>
      </form>

      {rows?.length ? (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell align="right">Age</StyledTableCell>
                <StyledTableCell align="right">Standard</StyledTableCell>
                <StyledTableCell align="right">Disibility</StyledTableCell>
                <StyledTableCell align="right">Gender</StyledTableCell>
                <StyledTableCell align="right"></StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <Row
                  key={row?.id}
                  row={row}
                  editData={() => setDataForEdit(row)}
                  deleteData={() => deleteData(row?.id)}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <h2
          style={{
            textAlign: "center",
            padding: "100px 0",
            backgroundColor: "#F7F7F8",
          }}
        >
          No data found
        </h2>
      )}
    </div>
  );
}

const Row = ({ row, editData = () => {}, deleteData = () => {} }) => {
  return (
    <StyledTableRow key={row.id}>
      <StyledTableCell component="th" scope="row">
        {row.name}
      </StyledTableCell>
      <StyledTableCell align="right">{row.age}</StyledTableCell>
      <StyledTableCell align="right">{row.standard}</StyledTableCell>
      <StyledTableCell align="right">
        {row.disibility ? "Yes" : "No"}
      </StyledTableCell>
      <StyledTableCell align="right">{row.gender}</StyledTableCell>
      <StyledTableCell align="right">
        <ButtonGroup>
          <Button variant="outlined" onClick={editData}>
            Edit
          </Button>
          <Button variant="outlined" color="error" onClick={deleteData}>
            Delete
          </Button>
        </ButtonGroup>
      </StyledTableCell>
    </StyledTableRow>
  );
};

export default App;
