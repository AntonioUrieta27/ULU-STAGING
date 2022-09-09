import Swal from "sweetalert2";

export const confirmModal = ({ confirmButtonText, cancelButtonText }) => {
  return Swal.fire({
    title: "Are you sure?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
  });
};
