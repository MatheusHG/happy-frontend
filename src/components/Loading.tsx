import React from 'react';
import Modal from 'react-responsive-modal';
import Lottie from 'react-lottie';

import animation from './loading.json';

const Loading = ({open}: {open: boolean}) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  return (
    <Modal open={open} center onClose={() => undefined} showCloseIcon={false}>
      <Lottie
        options={defaultOptions}
        height={250}
        width={250}
      />
    </Modal>
  );
};

export default Loading;