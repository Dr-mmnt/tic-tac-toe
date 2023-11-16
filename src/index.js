import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'

function Square (props){
  return(
    <button className='square' onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component{

renderSquare(i){
  return ( 
  <Square 
   value ={this.props.squares[i]}
   onClick = {(  ) =>{
    this.props.onClick(i)
    this.props.stepIndex(i)}
   } 
 />
 );
}

  render(){   
      return(
      <div>
        {Array.from({length:3},(_,rowIdx)=>( 
          <div className='board-row'> 
            {Array.from({length:3},(_,clmnIdx)=>(            
              this.renderSquare(rowIdx+(clmnIdx)*3)                
          ))}
          </div>
        ))}        
      </div>
     );
  }
}

class Game extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),        
      }],
      stepDisplay: Array(9).fill(null),
      xIsNext: true,
      isAscending: true,
      stepNumber: 0,
      row: 0,
      column: 0,
    }};

   stepIndex(i){
      this.setState({row:Math.floor(i/3+1)})

      if (i+1<=3){
        this.setState({column:i+1})
      }
      else if(i>=3 && i<6){
        this.setState({column:i+1-3})
      }
      else if (i>=6){
        this.setState({column:i+1-6})
      }
      }

    handleClick(i){
      const history = this.state.history.slice(0,this.state.stepNumber+1);
      const stepDisplay = this.state.stepDisplay.slice(0,this.state.stepNumber+1);
      const current = history[history.length-1];
      const squares = current.squares.slice();
      

      if(calculateWinner(squares) || squares[i]) {
        this.setState({selectedButton: stepDisplay.indexOf(i)+1});
        return;
      }
      squares[i] = this.state.xIsNext?'X':'O';
      stepDisplay[history.length-1]=(i);
      this.setState({
        history: history.concat([{
          squares: squares,
        }]),
        stepNumber: history.length,
        xIsNext:!this.state.xIsNext,
        stepDisplay:stepDisplay,
        selectedButton:null,      
    });  
    }

    jumpTo(step){
      this.setState({
        stepNumber: step,
        xIsNext: (step%2 ===0),
      });
    }

    

  render(){
    const history = this.state.history.slice(0,this.state.stepNumber+1);
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const isAscending = this.state.isAscending;
    
    const moves = history.map((_,move1) => {
      const move = isAscending ? move1 : history.length-move1-1;
      const desc = move ? 
        'Перейти к ходу №' + move:
        'К началу игры';
        return(       
            
            <li key = {move}>
              <button
              className={move===this.state.selectedButton?'selected':' '} 
              onClick={() => {this.jumpTo(move)}}>{desc}</button>
            </li>
        );
    });

    let status;
    if (winner) {
      status = 'Выйграл ' + winner; 
    } else {
      status = 'Следуюший ход ' + (this.state.xIsNext?'X':'O');
    }
    
    
    return(
      
      <div className='game'>
        <div className='game-board'>
          <Board
          squares={current.squares}
          onClick={(i)=> this.handleClick(i)} 
          stepIndex={(i) => this.stepIndex(i)}
          />
        </div>
        <div className='game-info'>
          <div>{status}</div>
          
          {<p>Строка: {this.state.row} <br/>
            Столбец: {this.state.column}</p> }
            <button onClick={()=> this.setState({isAscending: isAscending? false:true}) }>Перевернуть</button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

const root = ReactDOM.createRoot(document.getElementById('root')); 
root.render(<Game />);