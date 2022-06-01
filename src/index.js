import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
  return (
    <button
      className={props.className}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  inWinnerLine(i) {
    return this.props.winningLine ? this.props.winningLine.includes(i) : false;
  }

  renderSquare(i) {
    const won = this.inWinnerLine(i) ? 'won' : 'lost';
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        className={'square ' + won}
      />
    );
  }

  render() {
    const looper = [0, 1, 2];
    let counter = 0;
    return (
      <div>
        {looper.map((i) => {
          return (
            <div className="board-row" key={i}>
              {looper.map(() => {
                counter++;
                return this.renderSquare(counter - 1);
              })}
            </div>
          );
        })}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        colRow: '',
      }],
      stepNumber: 0,
      xIsNext: true,
      sortFlag: true,
      winner: null,
      winningLine: null,
    };
  }

  calculateWinner(squares) {

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
        this.setState({
          winner: squares[a],
          winningLine: lines[i],
        });
        return squares[a];
      }
    }
    this.setState({
      winner: null,
      winningLine: null,
    });

    return null;
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (this.calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';

    this.setState({
      history: history.concat([{
        squares: squares,
        colRow: this.calculateColRow(i),
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });

    if (this.calculateWinner(squares)) {
      return;
    }
  }

  jumpTo(step) {
    const history = this.state.history.slice(0, step);
    console.log(step)
    const current = history[history.length - 1];
    let squares;
    if (step === 0) {
      squares = Array(9).fill(null);
    } else {
      squares = current.squares.slice();
    }
    this.calculateWinner(squares);
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  handleSort() {
    this.setState({
      sortFlag: !this.state.sortFlag,
    });
  }

  calculateColRow(i) {
    const col = i % 3;
    const row = Math.floor(i / 3);
    return `(col: ${col + 1}, row: ${row + 1})`;
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + ' ' + step.colRow :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>
            {move === this.state.stepNumber ? <b>{desc}</b> : desc}
          </button>
        </li>
      );
    });

    const sortedMoves = this.state.sortFlag ? moves : moves.reverse();

    let status;
    if (this.state.winner) {
      status = 'Winner: ' + this.state.winner;
    } else if (this.state.stepNumber === 9) {
      status = 'Draw';
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick ={(i) => this.handleClick(i)}
            winningLine={this.state.winningLine}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.handleSort()}>
            {this.state.sortFlag ? 'Sort moves from latest to first' : 'Sort moves from first to latest'}
          </button>
          <ol>{sortedMoves}</ol>
        </div>
      </div>
    );
  }
}



// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
