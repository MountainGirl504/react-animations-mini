import React, { Component } from 'react';
import Card from './Card';
import './App.css';
import {TransitionMotion, spring} from 'react-motion';   //react animation and requires install 'react-motion'


export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            todos: [{
                key: 't1',      // unique identifyer
                data: {
                    todo: 'Learn react-motion',
                    completed: false
                }
            }]
        }
        this.addTodo = this.addTodo.bind(this);
        this.removeTodo = this.removeTodo.bind(this);
        this.toggle = this.toggle.bind(this);
        this.getDefaultStyles = this.getDefaultStyles.bind(this);
        this.getStyles = this.getStyles.bind(this);
    }

    addTodo(e) {
        e.preventDefault();
        let newTodo = {
            key: `t${new Date()}`,
            data: {
                todo: this.inputRef.value,
                completed: false
            }
        }
        this.setState({
            todos: [...this.state.todos, newTodo]
        })
        this.inputRef.value = '';
    }

    removeTodo( id ) {
        let todos = this.state.todos.filter( todo => todo.key  !== id );
        this.setState({
            todos: todos
        })
    }

    toggle( id ) {
        let todos = this.state.todos.map( todo => {
            if (todo.key === id) {
                todo.data.completed = !todo.data.completed;
            }
            return todo;
        });
        this.setState({
            todos: todos
        })
    }

    getDefaultStyles(){                     //starting point if the animation is 0
        return this.state.todos.map(todo =>{
            return Object.assign({}, todo, {style:{height:0, opacity:0}})
        })
    }
    getStyles(){                            //ending point of the animation is 65 and 1
        return this.state.todos.map( todo => {
            return Object.assign({}, todo, {style: {height:spring(65), opacity: spring(1)}})
        })                                  //use spring to slow down the transition
    }
    willEnter(){        //any future todo items, this is going to be their default style
        return{
            height:0,
            opacity:0
        }
    }
    willLeave(){            //transition TO these values when we remove items, from 65 to 0
        return{
            height:spring(0),
            opacity:spring(0)
        }
    }
    render() {

        return(
            <div className='app'>
                <h1>to-dos</h1>
                <div className='todos-wrap'>
                    <div className='right-arrow'>></div> 
                    <div className='input-container'>
                        <form onSubmit={ this.addTodo }>
                            <input 
                                ref={ input => this.inputRef = input}
                                placeholder='add new to-do...'
                                className='todo-inp'
                                /> 
                        </form>   
                    </div>
                    <TransitionMotion       //wrap the component that need to be animated
                    defaultStyles={this.getDefaultStyles()} //starting point for the animation
                    styles={this.getStyles()}               //ending point of the animation
                    willEnter={this.willEnter}              //to apply animation to the new todos added
                    willLeave={this.willLeave}>            
                        {(styles) => {              //wrap JSX in Arrow function
                            return(
                                <div>
                                { styles.map( (todo) => {
                                    return <Card 
                                                key={todo.key}
                                                toggle={ this.toggle }
                                                removeTodo={ this.removeTodo } 
                                                todo={ todo } /> 
                                }) }
                            </div>  
                            )
                        }}
                    </TransitionMotion>
                </div> 
            </div> 
        )
    }
}
