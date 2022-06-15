import MazeGame from "./components/MazeGame";
import "./style/style.scss";

const App = () => {
  return (
    <div className="App">
      <div className="header">
        미로 게임
        <div className="help">
          <div className="tooltip">
            미로의 탈출구 좌표는 "우측하단" 입니다. <br />
            하트를 먹으면 점수를 얻습니다.
            <br />
            제한시간 초 이내에 들어가지 못하면 점수를 얻지 못합니다.
          </div>
          <i className="fa-solid fa-circle-question"></i>
        </div>
      </div>
      <MazeGame />
    </div>
  );
};

export default App;
