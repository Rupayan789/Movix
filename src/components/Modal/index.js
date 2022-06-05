import React, { useEffect, useRef } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import styles from "./index.module.css";

const Modal = ({ modalStyle, children, show, onClose, backdropStyle }) => {
  const modalRef = useRef(null);


  useEffect(() => {
    if (show) {
      modalRef.current.classList.add(styles.visible);
    } else {
      modalRef.current.classList.remove(styles.visible);
    }
  }, [show]);

  return (
    <React.Fragment>
      <div
        ref={modalRef}
        style={backdropStyle}
        className={`${styles.modalwrap}`}
        onClick={onClose}
      >
        <button onClick={onClose} className={styles.closebtn}>
          <AiOutlineCloseCircle size={25} color="red" />
        </button>
        <div

          className={`${styles.modal}  bg-stone-900`}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </React.Fragment>
  );
};

export default Modal;
