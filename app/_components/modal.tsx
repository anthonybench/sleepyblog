//───────────────────────────┐
//         Imports           │
//───────────────────────────┘
// react
import React from "react";
// 1st party
import { themes } from "@/app/_lib/themes";

//───────────────────────────┐
//          View             │
//───────────────────────────┘
const Modal = ({ children, onClose }: { children: any; onClose: any }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
