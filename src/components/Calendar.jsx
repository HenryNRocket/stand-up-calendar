import React from "react";
import Participants from "./Participants";
import * as dateFns from "date-fns";

class Calendar extends React.Component {
  state = {
    currentMonth: new Date(),
    selectedDate: new Date(),
    assignedDate: {},
    participants: [],
  };

  renderHeader() {
    const dateFormat = "MMMM yyyy";  
    return (
      <div className="header row flex-middle">
        <div className="col col-center">
          <span>{dateFns.format(this.state.currentMonth, dateFormat)}</span>
        </div>
      </div>
    );
  }

  renderDays() {
    const dateFormat = "eeee";
    const days = [];

    let startDate = dateFns.startOfWeek(this.state.currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="col col-center" key={i}>
          {dateFns.format(dateFns.addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    return <div className="days row">{days}</div>;
  }

  renderCells() {
    const { currentMonth, selectedDate } = this.state;
    const monthStart = dateFns.startOfMonth(currentMonth);
    const monthEnd = dateFns.endOfMonth(monthStart);
    const startDate = dateFns.startOfWeek(monthStart);
    const endDate = dateFns.endOfWeek(monthEnd);

    const dateFormat = "d";
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = "";
    let assignedDates = this.state.assignedDate
    

    if(Object.keys(assignedDates).length === 0){
      const queryParams = new URLSearchParams(window.location.search)

      for(const [key,value] of queryParams){
        const dates = value.split(',')
        for(const day of dates){
          assignedDates[day] = key
        }
      }
    }
    
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = dateFns.format(day, dateFormat);
        days.push(
          <div
            className={`col cell ${
              !dateFns.isSameMonth(day, monthStart)
                ? "disabled"
                : dateFns.isSameDay(day, selectedDate) ? "selected" : ""
            }`}
            key={day}
            // onClick={() => this.onDateClick(dateFns.parse(cloneDay))}
          >
            <span className="number">{formattedDate}</span>
            <span className="bg">{formattedDate}</span>
            <span className="name"> {assignedDates[formattedDate]} </span>
          </div>
        );
        day = dateFns.addDays(day, 1);
      }
      rows.push(
        <div className="row" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="body">{rows}</div>;
  }

  randomizeStandUp = participantsData => {
    // console.log(participantsData)

    let assignedDate = {}
    let temp = [...participantsData]
    const { currentMonth } = this.state;
    const monthStart = dateFns.startOfMonth(currentMonth);
    const monthEnd = dateFns.endOfMonth(monthStart);
    const startDate = dateFns.startOfWeek(monthStart);
    const endDate = dateFns.endOfWeek(monthEnd);
    let day = startDate;


    while(day <= endDate){

      if(
        dateFns.getDay(day) !== 0 &&
        dateFns.getDay(day) !== 6
      ){
        const dayOfMonth = dateFns.getDate(day)
        if(temp.length === 0){
          temp = [...participantsData]
        }
        // get random index value
        const randomIndex = Math.floor(Math.random() * temp.length);
        const name = temp[randomIndex]
        temp.splice(randomIndex,1)
        assignedDate[dayOfMonth] = name
      }
      day = dateFns.addDays(day, 1);
    }
  
    this.setState({
      assignedDate: assignedDate
    })
  }

  onDateClick = day => {
    this.setState({
      selectedDate: day
    });
  };

  participantsToCalendar = participantsData => {
    // console.log(participantsData)
    this.randomizeStandUp(participantsData)
  }

  generateShareLink = () => {
    const assignedDate = this.state.assignedDate
    let obj = {}
    const nameQuery = []
   
    for (const [key, value] of Object.entries(assignedDate)) {
      if(obj[value]){
        obj[value].push(key)
      }
      else{
        obj[value] = [key]
      }
    }

    for (const [key, value] of Object.entries(obj)) {
      nameQuery.push(`${key}=${value.join(',')}`)
    }
    
    return nameQuery.join('&')
  }

  render() {
    return (
      <div>
        <div className="calendar">
          {this.renderHeader()}
          {this.renderDays()}
          {this.renderCells()}
        </div>
        <Participants 
          participantsToCalendar={this.participantsToCalendar}
          generateShareLink={this.generateShareLink}
        />
      </div>
    );
  }
}

export default Calendar;