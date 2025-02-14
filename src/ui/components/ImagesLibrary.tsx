import * as React from 'react';
import { Modal } from 'react-bootstrap';

export default function ImagesLibrary(props: {
  show: boolean,
  onHide: () => void,
  onSelectImage: (src: string) => void,
}) {
  const imagesSrcs = [
    '/images/ar.png',
    '/images/bio.jpeg',
    '/images/ch.jpeg',
    '/images/en.jpeg',
    '/images/global.jpeg',
    '/images/history.jpeg',
    '/images/is.jpeg',
    '/images/math.jpeg',
    '/images/ph.jpeg',
    '/images/social.jpeg',
    '/images/tr.jpeg',
  ]
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      size='lg'
      fullscreen={'sm-down'}
      contentClassName='modal-shadow'
    >
      <Modal.Header closeButton>
        <Modal.Title style={{flex: '1'}}>صورة المحادثة</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='images-container'>
          {imagesSrcs.map(src => 
            <img
              key={src}
              src={src}
              alt="chat-image"
              onClick={() => props.onSelectImage(src)}
            />
          )}
        </div>
      </Modal.Body>
    </Modal>
  )
}