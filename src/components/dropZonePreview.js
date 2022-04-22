// React
import React, { useEffect, useState } from 'react';
// Prop types
import PropTypes from 'prop-types';
// Material Ui and Icons
import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardMedia,
  Grid,
  IconButton,
  makeStyles,
  Paper,
} from '@material-ui/core';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import DeleteIcon from '@material-ui/icons/Delete';
// Dropzone
import { useDropzone } from 'react-dropzone';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#F2F3F3',
    padding: theme.spacing(2),
    border: '1px solid #cccccc'
  },
  dropZoneCustom: {
    width: '100%',
    height: '100%',
    border: '2px dashed #cccc',
    borderRadius: '3px'
  },
  thumbsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  thumb: {
    display: 'grid',
    marginBottom: 8,
    marginRight: 8,
    width: 180,
    height: 200,
    padding: 4,
    boxSizing: 'border-box'
  },
  thumbInner: {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden'
  },
  imageCard: {
    maxWidth: '224px',
    alignContent: 'center',
    display: 'block',
    backgroundColor: '#FFFFFF'
  },
  boxIcons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    textAlign: 'center'
  },
  icon: {
    padding: theme.spacing(4),
    margin: theme.spacing(1),
    display: 'flex',
  },
  actionsCard: {
    width: '100%',
    height: '15%',
    padding: theme.spacing(1),
    justifyContent: 'flex-end'
  },
  img: {
    display: 'flex',
    width: 'auto',
    height: '100%',
    margin: 'auto'
  },
  textCenter: {
    textAlign: 'center',
    fontSize: '2vh',
    fontStyle: 'italic',
  },
  button: {
    display: 'block',
    color: '#F2F3F3',
    justifyContent: 'right'
  },
}));

function DropZone({ parentCallback, filesToPreview = [], maxFiles = 4 }) {
  const classes = useStyles();
  const [files, setFiles] = useState([]);
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/jpeg, image/jpg, image/png',
    onDrop: (acceptedFiles) => {
      const filesToAdd = maxFiles - files.length;
      if (filesToAdd > 0 && filesToAdd <= maxFiles) {
        const allowedFiles = acceptedFiles.slice(0, filesToAdd);
        const newFiles = allowedFiles.map((file) => Object.assign(file, {
          preview: URL.createObjectURL(file)
        }));
        setFiles([...files, ...newFiles]);
      }
    }
  });

  const deleteImage = (imageToDelete) => {
    const newFile = files.filter((img) => (img.name !== imageToDelete.name));

    setFiles(newFile);
  };

  useEffect(() => {
    if (files.length > 0) {
      parentCallback(files);
    }
  }, [files]);

  useEffect(() => {
    if (filesToPreview && filesToPreview.length > 0) {
      const filesToAdd = filesToPreview.map((url) => {
        const data = {
          preview: url,
          name: url
        };
        return data;
      });

      setFiles([...files, ...filesToAdd]);
    }
  }, [filesToPreview]);

  useEffect(() => {
    setFiles([]);

    return () => {
      // revoke the data uris to avoid memory leaks when the component was unmounted
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, []);

  return (
    <Paper className={classes.paper} elevation={2}>
      <aside className={classes.thumbsContainer}>
        {
          files.map((file) => (
            <Grid
              className={classes.thumb}
              key={file.name}
            >
              <Card className={classes.imageCard}>
                <CardMedia
                  className={classes.img}
                  image={file.preview}
                  title={file.name}
                >
                  <CardActions
                    className={classes.actionsCard}
                  >
                    <IconButton
                      aria-label="delete"
                      size="small"
                      className={classes.button}
                      onClick={() => deleteImage(file)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </CardMedia>
              </Card>
            </Grid>
          ))
        }
      </aside>
      {
      (files.length < maxFiles)
      && (
        <div
          className={classes.dropZoneCustom}
          {...getRootProps({ className: clsx('dropzone', classes.dropZoneCustom) })}
        >
          <input
            {...getInputProps()}
          />
          <Box className={classes.textCenter}>
            <Box className={classes.boxIcons}>
              <Avatar
                size="large"
                className={classes.icon}
              >
                <AddPhotoAlternateIcon />
              </Avatar>
            </Box>
            <br />
            {`Máximo ${maxFiles}  fotografías en formatos: PNG, JPG o JPEG`}
          </Box>
        </div>
      )
      }
    </Paper>
  );
}

DropZone.propTypes = {
  parentCallback: PropTypes.func,
  filesToPreview: PropTypes.array,
  maxFiles: PropTypes.number
};

export default DropZone;
