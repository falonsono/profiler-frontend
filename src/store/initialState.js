const initialState = () => ({
    snackbar: {
      visible: false,
      color: 'info',
      mode: '',
      text: '',
      timeout: 6000,
      x: 'right',
      y: 'top',
    },
  });
  
  export default initialState;