import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card, CardActions, CardContent, TextField, ButtonGroup, Collapse, Tooltip } from '@mui/material';
import { TransitionGroup } from 'react-transition-group';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import BadgeIcon from '@mui/icons-material/Badge';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const theme = createTheme({
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
            color: "black",
            backgroundColor: "white",            
            fontFamily: 'Poppins',
            borderRadius: '5px',
            border: 'solid #353535 5px',            
        }
      }
    }
  }
});

function App() {
  const [elements, setElements] = useState([]);
  const [postElements, setPostElements] = useState({
    id: '',
    nombre: '',
    color: ''
  });

  useEffect(() => {
    getInfo();
  }, []);
  
  const getInfo = () => {
    axios.get(process.env.REACT_APP_MONGO).then(data => {
      setElements(data.data);
    });
  }

  const postInfo = () => {
    postElements.nombre === "" || postElements.color === "" ?
    window.alert("Campos vacios") :
    axios.post(process.env.REACT_APP_MONGO + "/insert", postElements).then(data => {
      getInfo();
      postElements.id = "";
      postElements.nombre = "";
      postElements.color = "";
    }).catch(error => {
      console.log(error.response);
    })
  }

  const putInfo = () => {
    postElements.nombre === "" || postElements.color === "" ?
    window.alert("Campos vacios") :
    axios.put(process.env.REACT_APP_MONGO + "/edit", {
      id: postElements.id,
      nombre: postElements.nombre,
      color: postElements.color
    }).then(data => {
      getInfo();
      postElements.id = "";
      postElements.nombre = "";
      postElements.color = "";
    }).catch(error => {
      console.log(error);
    });
  }

  const deleteInfo = (id) => {
    axios.delete(process.env.REACT_APP_MONGO + `/delete/${id}`).then(data => {
      getInfo();
      postElements.id = "";
      postElements.nombre = "";
      postElements.color = "";
    }).catch(error => {
      console.log(error);
    });
  }

  return (
    <div className='body'>    
      <div className='center margin'>
        <Card className='card-post'>
          <CardContent>
            <h3 className='title'>Agregar tarea</h3>
            <TextField className='mb' variant="standard" label="Nombre" value={postElements.nombre} type="text" onChange={(e) => { setPostElements({ ...postElements, nombre: e.target.value })}}/>
            <TextField variant="standard" label="Color" value={postElements.color} type="text" onChange={(e) => { setPostElements({ ...postElements, color: e.target.value })}}/>
          </CardContent>
          <CardActions className='buttonCenter'>
            <ButtonGroup variant="contained">
              <Button className='add' onClick={() => postInfo()}><LibraryAddIcon/></Button>
              <Button className={postElements.id === "" ? 'disabled' : 'edit'} disabled={postElements.id === "" ? true : false} onClick={() => putInfo()}><EditIcon/></Button>
            </ButtonGroup>
          </CardActions>
        </Card>
      </div>        
      <div className='card-conteiner-top'>
        <TransitionGroup className='card-conteiner'>
          {
            elements && elements.map((data, index) => (
              <Collapse key={index}>
                <Card className='card'>
                  <CardContent>
                    <h4 className='title'>Tarea: {index + 1}</h4>
                    <ThemeProvider theme={theme}>
                      <Tooltip title={data.nombre} placement="top">
                        <Button className='name'><BadgeIcon/></Button>
                      </Tooltip>
                    </ThemeProvider>
                  </CardContent>
                  <CardActions className='buttonCenter'>
                    <ButtonGroup variant="contained">
                      <Button className='delete' onClick={(e) => deleteInfo(data._id)}><DeleteForeverIcon /></Button>
                      <Button className='select' onClick={(e) => { setPostElements({ ...postElements, id: data._id, nombre: data.nombre, color: data.color }) }}><CheckBoxIcon /></Button>
                    </ButtonGroup>
                  </CardActions>
                </Card>
              </Collapse>
            ))
          }
        </TransitionGroup>
      </div>      
    </div>
  )        
}

export default App;
