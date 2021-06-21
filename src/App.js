import React from "react";

import LengthControl from "./components/lengthControl.component";

import "./styles/styles.scss";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timer: 1500,
      breakLength: 5,
      sessionLength: 25,
      isTimerOn: false,
      timerType: "Session",
      intervalID: "",
      timerColor: { color: "#FFF" }
    };
  }

  //Increment and Decrement buttons functions:
  setBreakLength = (e) => {
    this.lengthControl(
      "breakLength",
      e.currentTarget.value,
      this.state.breakLength,
      "Session"
    );
  };

  setSessionLength = (e) => {
    this.lengthControl(
      "sessionLength",
      e.currentTarget.value,
      this.state.sessionLength,
      "Break"
    );
  };

  lengthControl(stateToChange, sign, currentLength, timerType) {
    if (this.state.isTimerOn) {
      return;
    }
    if (this.state.timerType === timerType) {
      if (sign === "-" && currentLength !== 1) {
        this.setState({ [stateToChange]: currentLength - 1 });
      } else if (sign === "+" && currentLength !== 60) {
        this.setState({ [stateToChange]: currentLength + 1 });
      }
    } else if (sign === "-" && currentLength !== 1) {
      this.setState({
        [stateToChange]: currentLength - 1,
        timer: currentLength * 60 - 60
      });
    } else if (sign === "+" && currentLength !== 60) {
      this.setState({
        [stateToChange]: currentLength + 1,
        timer: currentLength * 60 + 60
      });
    }
  }

  controlTimer = () => {
    if (!this.state.isTimerOn) {
      this.startCountDown();
      this.setState({ isTimerOn: true });
    } else {
      this.setState({ isTimerOn: false });
      if (this.state.intervalID) {
        this.state.intervalID.cancel();
      }
    }
  };

  accurateInterval = (func, time) => {
    var cancel, nextAt, timeout, wrapper;
    nextAt = new Date().getTime() + time;
    timeout = null;
    wrapper = function () {
      nextAt += time;
      timeout = setTimeout(wrapper, nextAt - new Date().getTime());
      return func();
    };
    cancel = function () {
      return clearTimeout(timeout);
    };
    timeout = setTimeout(wrapper, nextAt - new Date().getTime());
    return {
      cancel: cancel
    };
  };

  startCountDown = () => {
    this.setState({
      intervalID: this.accurateInterval(() => {
        this.decrementTimer();
        this.phaseControl();
      }, 1000)
    });
  };

  decrementTimer = () => {
    this.setState({ timer: this.state.timer - 1 });
  };

  phaseControl = () => {
    let timer = this.state.timer;
    this.changeTimerColor(timer);
    this.playAlarmSound(timer);
    if (timer < 0) {
      if (this.state.intervalID) {
        this.state.intervalID.cancel();
      }
      if (this.state.timerType === "Session") {
        this.startCountDown();
        this.switchTimer(this.state.breakLength * 60, "Break");
      } else {
        this.startCountDown();
        this.switchTimer(this.state.sessionLength * 60, "Session");
      }
    }
  };

  changeTimerColor = (timer) => {
    if (timer < 61) {
      this.setState({ timerColor: { color: "#a50d0d" } });
    } else {
      this.setState({ timerColor: { color: "#FFF" } });
    }
  };

  playAlarmSound = (timer) => {
    if (timer === 0) {
      document.getElementById("audio").currentTime = 0;
      document.getElementById("audio").play();
    }
  };

  switchTimer = (num, str) => {
    this.setState({
      timer: num,
      timerType: str,
      alarmColor: { color: "#FFF" }
    });
  };

  formatTime = () => {
    let minutes = Math.floor(this.state.timer / 60);
    let seconds = this.state.timer - minutes * 60;

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return minutes + ":" + seconds;
  };

  reset = () => {
    this.setState({
      timer: 1500,
      breakLength: 5,
      sessionLength: 25,
      isTimerOn: false,
      timerType: "Session",
      intervalID: "",
      timerColor: { color: "#FFF" }
    });
    if (this.state.intervalID) {
      this.state.intervalID.cancel();
    }
  };

  render() {
    return (
      <div className="App">
        <h1 className="aap-title">Pomodoro Clock</h1>

        <LengthControl
          title="Break Length"
          titleID="break-label"
          incID="break-increment"
          lengthID="break-length"
          length={this.state.breakLength}
          decID="break-decrement"
          onClick={this.setBreakLength}
        />

        <LengthControl
          title="Session Length"
          titleID="session-label"
          incID="session-increment"
          lengthID="session-length"
          length={this.state.sessionLength}
          decID="session-decrement"
          onClick={this.setSessionLength}
        />

        <div className="timer" style={this.state.timerColor}>
          <h2 id="timer-label">{this.state.timerType}</h2>
          <div id="time-left">{this.formatTime()}</div>
        </div>

        <div className="timer-control-btns">
          <button id="start-stop-btn" onClick={this.controlTimer}>
            {this.state.isTimerOn ? (
              <i className="fa fa-pause" />
            ) : (
              <i className="fa fa-play" />
            )}
          </button>

          <button id="reset-btn" onClick={this.reset}>
            <i className="fa fa-sync-alt" />

          </button>
        </div>

        <audio
          id="audio"
          preload="auto"
          src="https://assets.mixkit.co/sfx/download/mixkit-system-beep-buzzer-fail-2964.wav"
        />
      </div>
    );
  }
}

export default App;
