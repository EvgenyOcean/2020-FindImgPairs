import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import bananas from './imgs/1.png';
import beer from './imgs/2.png';
import comp from './imgs/3.png'; 
import car from './imgs/4.png'; 
import fb from './imgs/5.png'; 
import cash from './imgs/6.png'; 

function isGameOver(imgs){
    let total = [];
    for (let obj of imgs){
        total.push(...Object.values(obj));
    }
    total = total.filter(val => typeof(val) === 'boolean'); 
    let result = total.includes(true) ? 'going' : 'finished'; 
    return result
}

function creatingTable(imgs){
    let imgKeys = [];
    for (let obj of imgs){
        imgKeys.push(Object.keys(obj)[0]); 
    }
    let nowKey = 0; 
    let rows = []; 
    for (let i=0; i<3; i++){
        let tds = []; 
        for (let j=0; j<4; j++){
            tds.push(
                <td key={nowKey} id={imgKeys[nowKey]}>
                    <img key={imgKeys[nowKey]} id={imgKeys[nowKey]} src={imgs[nowKey].src} alt="" onDragStart={(e)=>e.preventDefault()} hidden={imgs[nowKey][imgKeys[nowKey]]}/>
                </td>)
                nowKey++;
        }
        rows.push(<tr key={i}>{tds}</tr>)
    }

    return rows;
}

function ShowInfo(props){
    let title =
        (props.status === "beforeStart" &&
            "Press start when you're ready!") ||
        (props.status === "going" && "Game in on!") ||
        (props.status === "finished" && "Congratulations!");
    let button =
        (props.status === "beforeStart" && "START") ||
        (props.status === "going" && "RESTART") ||
        (props.status === "finished" && "START AGAIN");
    
    console.log(props.status)
    console.log(button);
    console.log(title);
    return (
        <div className='stats'>
            <h1>{title}</h1>
            <button onClick={props.startHandler}>{button}</button>
        </div>
    )
}

class RenderImgs extends React.Component{
    render(){
        let imgs = this.props.imgs;
        return (
            <table onClick={this.props.hideHandler}>
                <tbody>
                    {creatingTable(imgs)}
                </tbody>
            </table>
        )
    }
}

class ImgShower extends React.Component{ 
    constructor(props){
        super(props); 
        this.state = {
            gameStatus: "beforeStart",
            firstImg: null,
            imgsVisibility: [
                [
                    { 1: false, src: bananas },
                    { 11: false, src: bananas },
                    { 2: false, src: beer },
                    { 22: false, src: beer },
                    { 3: false, src: comp },
                    { 33: false, src: comp },
                    { 4: false, src: car },
                    { 44: false, src: car },
                    { 5: false, src: fb },
                    { 55: false, src: fb },
                    { 6: false, src: cash },
                    { 66: false, src: cash }
                ]
            ],
            guessedImgs: 0
        };
        this.hideHandler = this.hideHandler.bind(this); 
        this.startHandler = this.startHandler.bind(this); 
    }

    hideHandler(e){
        if (this.state.gameStatus === 'finished' || this.state.gameStatus === 'beforeStart') return; 
        let guessed = this.state.guessedImgs; 
        let img = e.target; 
        let newTurn = guessed + 1; 
        
        let imgs = this.state.imgsVisibility[guessed].map(obj=> Object.assign({}, obj));
        let newHistory = this.state.imgsVisibility.concat([imgs]);

        // IS GAME OVER ? 

        if (this.state.firstImg === null){
            let theImg = imgs.find(obj=> img.id in obj); 
            theImg[img.id] = !theImg[img.id];
            img = img.firstElementChild;
            this.setState({
                firstImg: img,
                imgsVisibility: newHistory,
                guessedImgs: newTurn,
            })

        }else{
            let theImg = imgs.find(obj=> img.id in obj); 
            if (e.target.id[0] === this.state.firstImg.id[0]){
                theImg[img.id] = !theImg[img.id];
                let result = isGameOver(imgs);
                this.setState({
                    gameStatus: result,
                    firstImg: null,
                    imgsVisibility: newHistory,
                    guessedImgs: newTurn, 
                })
            }else{
                newHistory.length = newTurn - 1;
                this.setState({
                    firstImg: null,
                    imgsVisibility: newHistory,
                    guessedImgs: newTurn - 2,
                })
            }

        }

    }

    async startHandler(e){
        //inital start or restart
        if (this.state.gameStatus === 'going' || this.state.gameStatus === 'finished'){
            this.setState({
                gameStatus: "beforeStart",
                firstImg: null,
                imgsVisibility: [
                    [
                        { 1: false, src: bananas },
                        { 11: false, src: bananas },
                        { 2: false, src: beer },
                        { 22: false, src: beer },
                        { 3: false, src: comp },
                        { 33: false, src: comp },
                        { 4: false, src: car },
                        { 44: false, src: car },
                        { 5: false, src: fb },
                        { 55: false, src: fb },
                        { 6: false, src: cash },
                        { 66: false, src: cash }
                    ]
                ],
                guessedImgs: 0
            });
        }

        await new Promise(resolve => setTimeout(resolve, 0)); 

        //shuffles the imgs
        let imgs = this.state.imgsVisibility[0]; 
        for (let i = imgs.length - 1; i > 0; i--){
            let j = Math.floor(Math.random() * (i + 1));
            let temp = imgs[j]; 
            imgs[j] = imgs[i]; 
            imgs[i] = temp;
        }

        this.setState({imgsVisibility: [imgs]}); 

        //hides the imgs in 1s
        setTimeout(()=> {
            for (let imgObj of imgs){
                imgObj[Object.keys(imgObj)[0]] = !imgObj[Object.keys(imgObj)[0]]
            }
            this.setState({imgsVisibility: [imgs], gameStatus: 'going',});
        }, 5000);
    }

    render(){
        let guessed = this.state.guessedImgs; 
        return(
            <div className='main'>
                <ShowInfo startHandler={this.startHandler} status={this.state.gameStatus}/>
                <RenderImgs hideHandler={this.hideHandler} imgs={this.state.imgsVisibility[guessed]}/>
            </div>
        )
    }
}

ReactDOM.render(<ImgShower />, document.getElementById('root'));
