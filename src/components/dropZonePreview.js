import {
  Card, Grid, makeStyles, Paper,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const useStyles = makeStyles((theme) => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#F2F3F3',
    padding: theme.spacing(2),
    border: '1px solid #cccccc'
  },
  thumbsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16
  },
  thumb: {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    width: 100,
    height: 100,
    padding: 4,
    boxSizing: 'border-box'
  },
  thumbInner: {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden'
  },
  imageContainer: {
    alignContent: 'center',
    display: 'flex',
    backgroundColor: '#FFFFFF'
  },
  img: {
    display: 'block',
    width: 'auto',
    height: '100%',
    margin: 'auto'
  }
}));

function DropZone() {
  const classes = useStyles();
  const [files, setFiles] = useState([]);
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/jpeg, image/jpg, image/png',
    maxFiles: 4,
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles.map((file) => Object.assign(file, {
        preview: URL.createObjectURL(file)
      })));
    }
  });

  const thumbs = files.map((file) => (
    <Grid
      className={classes.thumb}
      key={file.name}
    >
      <Card className="imageContainer">
        <img
          className={classes.img}
          src={file.preview}
          alt="Imagen"
        />
      </Card>
    </Grid>
  ));

  useEffect(() => () => {
    // Make sure to revoke the data uris to avoid memory leaks
    files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  return (
    <Paper className={classes.paper} elevation={2}>
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <p>Presiona click para seleccionar las fotografías o Arrastra y suelta aquí</p>
        <em>(formatos permitidos *.jpeg *.jpg and *.png)</em>
      </div>
      <aside className={classes.thumbsContainer}>
        {thumbs}
      </aside>
    </Paper>
  );
}

export default DropZone;
