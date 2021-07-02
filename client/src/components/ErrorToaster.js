import React from "react";
import { Toast } from "react-bootstrap";

export default function ErrorToaster({ message, onClose }) {
  return (
    <Toast
      onClose={onClose}
      style={{ position: "absolute", top: 80, right: 10 }}
    >
      <Toast.Header>Something went wrong</Toast.Header>
      <Toast.Body>{message}</Toast.Body>
    </Toast>
  );
}
