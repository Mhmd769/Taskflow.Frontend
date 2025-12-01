import Swal from "sweetalert2";

export const confirmDelete = () => {
  return Swal.fire({
    title: "Are you sure?",
    text: "This action cannot be undone!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  });
};

export const successAlert = (message: string) => {
  return Swal.fire({
    icon: "success",
    title: "Success!",
    text: message,
    timer: 1500,
    showConfirmButton: false,
  });
};

export const errorAlert = (message: string) => {
  return Swal.fire({
    icon: "error",
    title: "Oops!",
    text: message,
  });
};
