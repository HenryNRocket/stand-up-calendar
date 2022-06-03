import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../src/index.css';
import { faPlus, faCircleMinus } from '@fortawesome/free-solid-svg-icons';
class Participants extends React.Component {

    state = {
        name: '',
        participants: this.setInitialState(),
        shareLink: 'Share Link!'
    }
    
    handleAddButtonClick() {
        let participants = this.state.participants
        participants.push(this.state.name)
        this.setState({
            name: '',
            participants: participants
        })

        document.getElementById('inputName').value=''
	};

    updateName(event){
        this.setState({
            name:event.target.value
        })
 
    }

    deleteName(index){
        const participants = this.state.participants
        participants.splice(index,1)
        this.setState({
            participants: participants
        })
    
    }

    setInitialState(){
        const queryParams = new URLSearchParams(window.location.search)
        const participants = []
        for(const [key,value] of queryParams){
            participants.push(key)
        }

        return participants
    }

    renderNameList(){
        const names = []
        const participants = this.state.participants

  
        for(let i = 0; i < participants.length; ++i){
            names.push(
           
                <div className='item-container' key={i}>
                <div className='item-name'>
                    {
                        <>
                            <span >{participants[i]}</span>
                        </>
                    }
                </div>
                <div className="options">
                    <button className="delete-button" onClick={this.deleteName.bind(this,i)}>
                        <FontAwesomeIcon icon={faCircleMinus} />
                    </button>
                </div>
            </div>
            )
        }
        return names
    }

    generateCalendar = () => {
       
        this.props.participantsToCalendar(this.state.participants)
    }

    generateLink = () => {
        this.setState({
            shareLink: 'Copied To Clipboard!'
        })
        const link = this.props.generateShareLink()
        navigator.clipboard.writeText(link)

        setTimeout(()=>{
            this.setState({
                shareLink: 'Share Link!'
            })
        },1500)
    }

    render() {
        return (
            <div>
                <div className="participants">
                    <div className='add-item-box'>
                    <input 
                        type="text"
                        id="inputName"
                        onChange={this.updateName.bind(this)} 
                        className='add-item-input' placeholder='Add a name..' />
                        <FontAwesomeIcon icon={faPlus} onClick={ this.handleAddButtonClick.bind(this) } />
                    </div>
                    <div className='item-list'>

                        {this.renderNameList()}
                    </div>
                </div>
                <div className="button-options">
                    <div className="generate-div">
                        <button className="generate-button" onClick={this.generateCalendar}>
                            <span>Generate Calendar</span>
                        </button>
                    </div>
                    <div className="generate-div">
                        <button className="generate-button" onClick={this.generateLink}>
                            <span>{this.state.shareLink}</span>
                        </button>
                    </div>
                </div>
            </div>

        )
    }
}

export default Participants