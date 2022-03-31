/* eslint-disable func-names */
import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { Grid } from '@material-ui/core'

import genericAvatar from '../../../assets/generic_profile.jpg'

const styles = {
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  fileInput: {
    display: 'none',
  },
  fileBtn: {
    height: 36,
    boxShadow: 'none',
    borderRadius: 25,
    color: '#1881FF',
    border: `1px solid rgba(24, 129, 255, 0.5)`,
    display: 'flex',
    alignItems: 'center',
    padding: '0 10px',
    marginBottom: 10,
    cursor: 'pointer',
  },
}

class ImageInput extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      id: this.props.id, // I would use this.props.id for a real world implementation
      imageURI: null,
      originalImageURI: this.props.originalImageURI,
    }
  }

  buildImgTag() {
    let imgTag = null
    if (this.state.imageURI || this.state.originalImageURI) {
      let imgSrc
      if (this.state.originalImageURI) {
        imgSrc = this.state.originalImageURI
      }
      if (this.state.imageURI) {
        imgSrc = this.state.imageURI
      }
      imgTag = (
        <div className='row'>
          <div
            className='small-9 small-centered columns'
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <img
              onError={e => {
                e.target.onerror = null
                e.target.src = genericAvatar
              }}
              className='profile-pic-preview'
              style={{ width: '150px', height: '150px', borderRadius: '50%' }}
              src={imgSrc}
              alt='Avatar'
            />
          </div>
        </div>
      )
    }
    return imgTag
  }

  readURI(e) {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader()
      reader.onload = function(ev) {
        // eslint-disable-line
        this.setState({ imageURI: ev.target.result })
      }.bind(this) //eslint-disable-line
      reader.readAsDataURL(e.target.files[0])
    }
  }

  handleChange(e) {
    this.readURI(e) // maybe call this with webworker or async library?
    if (this.props.onChange !== undefined) this.props.onChange(e) // propagate to parent component
  }

  render() {
    const { classes } = this.props
    const imgTag = this.buildImgTag()
    return (
      <Grid className={classes.root}>
        <label htmlFor='file-upload' className={classes.fileBtn}>
          Upload an image
        </label>
        <input
          id='file-upload'
          type='file'
          onChange={this.handleChange.bind(this)}
          className={classes.fileInput}
        />
        {imgTag}
      </Grid>
    )
  }
}

ImageInput.propTypes = {
  originalImageURI: PropTypes.string,
  id: PropTypes.string,
  classes: PropTypes.object,
  onChange: PropTypes.func,
}

ImageInput.defaultProps = {
  originalImageURI: '',
  id: '',
  classes: {},
  onChange: () => {},
}

export default withStyles(styles)(ImageInput)
