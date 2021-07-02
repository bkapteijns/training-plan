import React from "react";
import { Toast } from "react-bootstrap";

export default function ErrorToaster({ message, onClose, move }) {
  return (
    <Toast
      onClose={onClose}
      style={{
        position: "absolute",
        top: 80,
        right: move ? 180 : 10,
        zIndex: 1000
      }}
    >
      <Toast.Header>Something went wrong</Toast.Header>
      <Toast.Body>{message}</Toast.Body>
    </Toast>
  );
}
