import React from 'react';
import Swal from 'sweetalert2';

const AlertMessage = ({ message, type }) => {
    console.log("alert is calling function")

  const showAlert = () => {
    console.log("alert is calling")
    Swal.fire({
      title: type === 'success' ? 'Success!' : 'Error!',
      text: message,
      icon: type, // 'success', 'error', 'warning', 'info', 'question'
      confirmButtonText: 'OK',
    });
  };

  // Trigger the alert when the component is mounted
  React.useEffect(() => {
    showAlert();
  }, []);

  return null; // This component doesn't render anything visually
};

export default AlertMessage;
