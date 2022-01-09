import React from 'react';
import TextField from '@mui/material/TextField';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

const LocalFileLoader = ({ fileType, onFileLoaded }) => {
    const handleFile = (event) => {
        const reader = new FileReader();
        reader.addEventListener( 'load', () => {
            if (onFileLoaded) onFileLoaded({fileData: reader.result}); 
        });
        reader.readAsArrayBuffer(event.target.files[0]);
    };

    return(
        <div>
            <label htmlFor="upload-file">
                <TextField name='upload-file' id='upload-file' type='file' style={{ display:'none' }} onChange = {handleFile} />
                <Fab
                    color='secondary'
                    size='small'
                    component='span'
                    aria-label='add'
                    variant='extended'
                >
                    <AddIcon /> Load { fileType }
                </Fab>
            </label>
        </div>
    )
}

export default LocalFileLoader;