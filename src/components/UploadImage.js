import {
  Avatar,
  Card, Grid, makeStyles, Paper,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { SET_STORE_DATA } from 'src/store/action_types';
import AddAPhotoRoundedIcon from '@material-ui/icons/AddAPhotoRounded';
import FiberNewRoundedIcon from '@material-ui/icons/FiberNewRounded';

const useStyles = makeStyles(() => ({
  thumbsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 0,
    borderRadius: '150px !important'
  },
  thumb: {
    display: 'inline-flex',
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 0,
    width: 100,
    height: 100,
    padding: 4,
    borderRadius: '150px !important',
    boxSizing: 'border-box'
  },
  thumbInner: {
    display: 'flex',
    minWidth: 0,
    borderRadius: '150px !important',
    overflow: 'hidden',
  },
  imageContainer: {
    alignContent: 'center',
    display: 'flex',
    backgroundColor: '#FFFFFF',
    borderRadius: '150px !important'
  },
  img: {
    display: 'block',
    width: 'auto',
    height: '100%',
    margin: 'auto'
  },
  divAbsolute: {
    position: 'relative',
    display: 'none'
  },
  divRelative: {
    position: 'relative',
    width: 100,
    height: 100
  }
}));

function UploadImage(props) {
  const classes = useStyles();
  const [files, setFiles] = useState([]);
  const { dispatch } = (props);
  let urlImage = '';
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/jpeg, image/jpg, image/png',
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles.map((file) => {
        urlImage = Object.assign(file, {
          preview: URL.createObjectURL(file)
        });

        return urlImage;
      }));

      setTimeout(() => {
        dispatch({
          type: SET_STORE_DATA,
          payload: { urlImageLogo: urlImage.preview }
        });
      }, 500);
    }
  });

  const thumbs = files.map((file) => (
    <Grid
      className={classes.thumb}
      key={file.preview}
    >
      <Card className={classes.imageContainer}>
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
    <Paper elevation={0}>
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        {(files.length === 0)
        && (
          <Avatar className={classes.divRelative}>
            <AddAPhotoRoundedIcon />
          </Avatar>
        )}
        <aside className={classes.thumbsContainer}>
          {thumbs}
          {(files.length > 0)
          && (
            <FiberNewRoundedIcon />
          )}
        </aside>
      </div>
    </Paper>
  );
}

export default UploadImage;
