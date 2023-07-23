import React, { FunctionComponent, useState } from 'react';
import './App.css';
import TableComponent from './components/table';
import { Button } from '@material-ui/core';

const App: FunctionComponent = () => {
  const [pageName, setPageName] = useState('Fruit List');
  const [favorite, setFavorite] = useState(false);

  const handleDetail = (pageNameParam?: string) => {
    setPageName(pageNameParam || '');

    if (pageNameParam?.includes('Fruit List')) {
      setFavorite(pageNameParam?.includes('My') ? true : false);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        {pageName}
      </header>

      <>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleDetail(favorite ? 'Fruit List' : 'My Favorite Fruit List')}
          style={{ marginBottom: 20 }}
        >
          {favorite ? 'Show All Fruit List' : 'Show My Favorite Fruit List'}
        </Button>
        <TableComponent favorite={favorite} />
      </>
    </div>
  );
}

export default App;
