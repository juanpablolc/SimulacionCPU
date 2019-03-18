import React, { Component } from 'react';

import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';

import CPU from './components/cpu/cpu';

const theme = createMuiTheme({
  overrides: {
    MuiTableCell: {
      root: {
        padding: '0 10px'
      }
    },
    MuiTableRow: {
      root: {
        height: 0
      }
    }
  },
  typography: {
    useNextVariants: true
  }
});

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <CPU />
      </MuiThemeProvider>
    );
  }
}

export default App;
