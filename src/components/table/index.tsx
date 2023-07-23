import { IconButton, Tooltip } from '@material-ui/core';
import StarOutlineIcon from '@material-ui/icons/StarOutline';
import StarIcon from '@material-ui/icons/Star';
import React, { useEffect, useState } from 'react';
import getUserData from '../../services/user';
import EnhancedTable from './table';

interface PropTypes {
  favorite?: boolean;
}

const TableComponent: React.FC<PropTypes> = (
  props: PropTypes,
) => {
  const {
    favorite,
  } = props;
  const [data, setData] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(0);
  const [trigger, setTrigger] = useState(false);

  const headCells = [
    {
      id: 'id',
      label: 'ID',
    },
    {
      id: 'name',
      label: 'Name',
    },
    {
      id: 'action',
      label: 'Action',
    }
  ];


  const handleChangePage = (e: any, newPage: number) => {
    setPage(newPage);
  }

  const handleFavorite = (fruit: string) => {
    const dataStorage: any = localStorage.getItem('fruit');
    const dataObjectStorage = dataStorage && JSON.parse(dataStorage);
    const newData = dataObjectStorage || [];

    if (dataObjectStorage) {
      const found = dataObjectStorage.find((row: any) => row === fruit);

      if (!found) {
        newData.push(fruit);
      }
    } else {
      newData.push(fruit);
    }

    localStorage.setItem('fruit', JSON.stringify(newData));
    setTrigger(!trigger);
  }

  const handleRemoveFavorite = (fruit: string) => {
    const dataStorage: any = localStorage.getItem('fruit');
    const dataObjectStorage = dataStorage && JSON.parse(dataStorage);
    const newData = [];

    if (dataObjectStorage) {
      const found = dataObjectStorage.find((row: any) => row === fruit);

      if (!found) {
        newData.push(fruit);
      }
    }

    localStorage.setItem('fruit', JSON.stringify(newData));
    setTrigger(!trigger);
  }

  const getUserDataFunction = async () => {
    try {
      const dataStorage: any = localStorage.getItem('fruit');
      const dataObjectStorage = dataStorage && JSON.parse(dataStorage);

      await getUserData().then((response: any) => {
        const newData: any = [];

        response && response.map((row: any, index: number) => {
          const found = dataObjectStorage && dataObjectStorage.find((fruitStorage: any) => fruitStorage === row);

          if (!found) {
            newData.push({
              id: index + 1,
              name: row,
              action: (
                <Tooltip title={`Add ${row} to My Favorite Fruit`}>
                  <IconButton
                    onClick={() => handleFavorite(row)}
                    aria-label={`Add ${row} to My Favorite Fruit`}
                  >
                    <StarOutlineIcon />
                  </IconButton>
                </Tooltip>
              ),
            });
          }

          return true;
        });

        setTotalRows(newData.length);
        setData(newData.sort((a: any, b: any) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0)));
      });

    } catch (err: unknown) {
      throw err;
    }
  }

  const getDataLocalStorage = async () => {
    const dataStorage: any = localStorage.getItem('fruit');

    if (dataStorage) {
      const objectStorage = JSON.parse(dataStorage);

      const newData: any = [];

      objectStorage && objectStorage.map((row: string, index: number) => {
        newData.push({
          id: index + 1,
          name: row,
          action: (
            <Tooltip title={`Remove ${row} from My Favorite Fruit`}>
              <IconButton
                onClick={() => handleRemoveFavorite(row)}
                aria-label={`remove ${row} from My Favorite Fruit`}
              >
                <StarIcon />
              </IconButton>
            </Tooltip>
          ),
        });
        return true;
      });

      setData(newData.sort((a: any, b: any) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)));
      setTotalRows(newData.length);
    }
  }

  useEffect(() => {
    const ac = new AbortController();

    setPage(0);

    if (favorite) {
      getDataLocalStorage()
    } else {
      getUserDataFunction();
    }

    return () => ac.abort();
  }, [favorite]);

  useEffect(() => {
    const ac = new AbortController();

    if (favorite) {
      getDataLocalStorage()
    } else {
      getUserDataFunction();
    }

    return () => ac.abort();
  }, [trigger]);

  return (
    <EnhancedTable
      headCells={headCells}
      data={data}
      onChangePage={handleChangePage}
      page={page}
      totalRows={totalRows}
    />
  );
}

export default React.memo(TableComponent);
