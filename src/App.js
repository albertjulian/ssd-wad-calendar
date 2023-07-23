import React, { useState, useEffect } from 'react';
import './App.css';
import { Dialog, DialogTitle, DialogActions, DialogContent, Button, TextField, MenuItem, FormControl, InputLabel, Select, FormHelperText } from '@material-ui/core';
import { time, month, day } from './constant';

const App = () => {
  let dateNow = 1;
  
  const calendar = localStorage.getItem('calendar');
  const monthWith30Days = [3, 5, 7, 10];
  const monthWith31Days = [0, 2, 4, 6, 7, 9, 11];

  const thisYear = new Date().getFullYear();
  const thisMonth = new Date().getMonth();
  const pageName = `${month[thisMonth]} ${thisYear}`;

  const [openDialog, setOpenDialog] = useState(false);
  const [title, setTitle] = useState('');
  const [email, setEmail] = useState('');
  const [timeNow, setTimeNow] = useState('8');
  const [modalTitle, setModalTitle] = useState('Add');
  const [arrayEvent, setArrayEvent] = useState(0);

  useEffect(() => {
    const calendarObject = calendar && JSON.parse(calendar);

    if (!calendarObject || calendarObject.month !== thisMonth) {

      const newCalendar = {
        month: thisMonth,
        days: [],
      };
      let days = 0;

      if (monthWith30Days.includes(thisMonth)) {
        days = 30;
      } else if (monthWith31Days.includes(thisMonth)) {
        days = 31;
      } else {
        if ((thisYear % 100 === 0 && thisYear % 400 === 0) || (thisYear % 100 !== 0 && thisYear % 4 === 0)) {
          days = 29;
        } else {
          days = 28;
        }
      }

      for (let i = 0; i < days; i += 1) {
        const obj = {
          events: [],
        };
        newCalendar.days.push(obj);
      }

      localStorage.setItem('calendar', JSON.stringify(newCalendar))
    }
  }, []);

  const handleClose = () => {
    setEmail('');
    setTimeNow('8');
    setTitle('');
    setModalTitle('Add');
    setArrayEvent(null);
    setOpenDialog(false);
  }

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  const validEmail = (paramEmail) => {
    const pattern = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;

    return pattern.test(paramEmail) ? true : false;
  }

  const isTimeNotAvailable = (paramTime) => {
    const notAvailable = calendar && !!openDialog && JSON.parse(calendar).days[openDialog - 1].events.find((row, index) => row.time === paramTime && index !== arrayEvent - 1);
    console.log(arrayEvent);
    return !!notAvailable;
  }

  
  return (
    <div className="App">
      <header className="App-header">
        {pageName}
      </header>

      <div className="calendar-body">
        {
          day.map((row, indexRow) => (
            <div className="row">
              {
                day.map((col, indexCol) => {
                  if (indexRow === 0) {
                    return <div key={col} className='kotak-title'>{col}</div>
                  }

                  if (new Date(`${thisMonth+1}-${dateNow}-${thisYear}`).getDay() === indexCol) {
                    dateNow += 1;
                    return (
                      <div
                        id={dateNow - 1}
                        key={`${col}-${indexCol}`}
                        className={`kotak ${dateNow - 1 === new Date().getDate() && 'bg-blue'}`}
                        onClick={(e) => {
                          if (
                            calendar &&
                            JSON.parse(calendar).days[parseInt(e.target.id, 10) - 1] &&
                            (JSON.parse(calendar).days[parseInt(e.target.id, 10) - 1].events.length < 3 || !JSON.parse(calendar).days[parseInt(e.target.id, 10) - 1].events.length)
                          ) {
                            setOpenDialog(e.target.id);
                          }
                        }}
                      >
                        {dateNow - 1}
                        {
                          calendar && JSON.parse(calendar).days[dateNow - 2].events.map((event, indexEvent) => (
                            <div
                              id={dateNow - 1}
                              key={`event-${dateNow - 1}-${indexEvent}`}
                              style={{
                                backgroundColor: event.color,
                                color: 'white',
                                overFlowX: 'auto',
                                maxWidth: '190px',
                                fontSize: '12px',
                                marginBottom: '6px',
                                padding: '5px',
                              }}
                              onClick={(e) => {
                                e.preventDefault();
                                setTitle(event.title);
                                setTimeNow(event.time);
                                setEmail(event.email);
                                setModalTitle('Edit');
                                setArrayEvent(indexEvent + 1);
                                setOpenDialog(event.id);
                              }}
                            >
                              <div>{event.title}</div>
                              <div>{event.email}</div>
                              <div>{time.find((row) => row.value === event.time).label}</div>
                            </div>
                          ))
                        }
                        <div></div>
                      </div>
                    );
                  }

                  return <div className="kotak" />
                })
              }
            </div>
          ))
        }
      </div>

      <Dialog fullWidth maxWidth="sm" open={!!openDialog} onClose={handleClose}>
        <DialogTitle>{`${modalTitle} Event`}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            id="name"
            label="Title"
            type="text"
            fullWidth
            variant="standard"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <TextField
            margin="dense"
            id="guest"
            label="Guest"
            type="email"
            fullWidth
            variant="standard"
            style={{
              marginBottom: '15px',
            }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!(email && !validEmail(email))}
            helperText={email && !validEmail(email) && 'Email tidak Valid'}
          />

          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-standard-label" style={ {color: isTimeNotAvailable(timeNow) ? 'red' : 'grey'}}>Time</InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={timeNow}
              onChange={(e) => setTimeNow(e.target.value)}
              label="Time"
              error={isTimeNotAvailable(timeNow)}
              
            >
              {time.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {isTimeNotAvailable(timeNow) && <FormHelperText style={{ color: 'red' }}>You have another schedule in that time</FormHelperText>}
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          {
            !!arrayEvent ?
            <Button
              onClick={() => { 
                const newCalendarStorage = JSON.parse(calendar); 
                  newCalendarStorage.days[openDialog - 1].events = newCalendarStorage.days[openDialog - 1].events.filter((row, index) => index !== arrayEvent - 1);
                localStorage.setItem('calendar', JSON.stringify(newCalendarStorage));
                handleClose();  
              }}
            >
              Remove
            </Button> : <></>
          }
          <Button
            onClick={() => {
              const newCalendarStorage = JSON.parse(calendar);
              let newColor = getRandomColor();

              let flagColor = true;

              while (flagColor) {
                // eslint-disable-next-line no-loop-func
                flagColor = newCalendarStorage.days[openDialog - 1].events.find((row) => row.color === newColor);

                if (flagColor) {
                  newColor = getRandomColor();
                } else {
                  flagColor = false;
                }
              }

              newCalendarStorage.days[openDialog - 1].events.push({
                id: openDialog,
                title: title,
                time: timeNow,
                email: email,
                color: newColor,
              });

              newCalendarStorage.days[openDialog - 1].events.sort((a, b) => a.time - b.time);
              localStorage.setItem('calendar', JSON.stringify(newCalendarStorage));
              handleClose();
            }}
            disabled={!title.trim().length || isTimeNotAvailable(timeNow) || !validEmail(email) || !email}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default App;
