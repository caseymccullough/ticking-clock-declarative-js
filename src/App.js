
import './App.css';

function App() {

  const oneSecond = () => 1000;
  const getCurrentTime = () => new Date();
  const clear = () => console.clear();
  const log = message => console.log(message);
  const htmltag = message => document.getElementById('time').innerHTML = message;

  /*  Takes in functions as arguments and returns a single function.
      ... spread operator turns functions into an array of functions
  */
  const compose = (...fns) => (arg) =>
    fns.reduce(
      (composed, f) => f(composed), 
      arg
      );

  /* These 3 functions transform data w/o changing the original */

  const abstractClockTime = date => ({
    hours: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds()
  });

  const fakeTime = () => ({
    hours: 1,
    minutes: 1,
    seconds: 1

  });

  const civilianHours = clockTime => ({
    ...clockTime, 
    hours: clockTime.hours > 12 ?
     clockTime.hours - 12 : 
     clockTime.hours
  });

  const appendAMPM = clockTime => ({
    ...clockTime,
    ampm: clockTime.hours >= 12 ? "PM" : "AM"
  });

/* Higher-order functions, they can manipulate functions and 
use them as arguments or results or both */

const display = target => time => target(time); // returns a method that sends a time to the target

// returns a function
const formatClock = format => 
time => 
  format
    .replace("hh", time.hours)
    .replace("mm", time.minutes)
    .replace("ss", time.seconds)
    .replace("tt", time.ampm);

// returns a function
const prependZero = key => clockTime => 
({
  ...clockTime, 
  [key]: (clockTime[key]) < 10 ?
   "0" + clockTime[key] :
    clockTime[key]
  
});

const convertToCivilianTime = clockTime => 
  compose (
    appendAMPM,
    civilianHours
  )(clockTime);

  const doubleDigits = civilianTime =>
    compose(
      prependZero("hours"),
      prependZero("minutes"), 
      prependZero("seconds")
    )(civilianTime);

  const startTicking = () =>

    // setInterval repeatedly executes a function, 
    //after waiting a specified number of milliseconds

    setInterval(
      compose(
        clear,
        getCurrentTime,
        abstractClockTime,
        convertToCivilianTime,
        doubleDigits,
        formatClock('hh:mm:ss tt'),
        display(htmltag),
        display(log)
      ),
      oneSecond()
    );

    startTicking(); // all emanates from here. 

  return (
    <div className="App">
      <h1>Clock App</h1>
      <h2>Current Time: </h2>
      <h1>Time is: <span id="time"></span></h1>
    <p id="demo"></p>
    </div>
  );
}

export default App;
