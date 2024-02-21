import { _decorator, Button, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Ga')
export class GameView extends Component {
    @property({
        type: Label
    })
    private bestScore: Label;
    public get BestScore(): Label {
        return this.bestScore;
    }
    public set BestScore(value: Label) {
        this.bestScore = value;
    }

    @property({
        type: Label
    })
    private score: Label;
    public get Score(): Label {
        return this.score;
    }
    public set Score(value: Label) {
        this.score = value;
    }

    @property({
        type: Label
    })
    private scoreOver: Label;
    public get ScoreOver(): Label {
        return this.scoreOver;
    }
    public set ScoreOver(value: Label) {
        this.scoreOver = value;
    }


    @property({
        type: Node
    })
    private pausePandel: Node;
    public get PausePandel(): Node {
        return this.pausePandel;
    }
    public set PausePandel(value: Node) {
        this.pausePandel = value;
    }

    @property({
        type: Node
    })
    private bgblur: Node;

    public get Bgblur(): Node {
        return this.bgblur;
    }
    public set Bgblur(value: Node) {
        this.bgblur = value;
    }

    @property({
        type: Node
    })
    private gameOverPandel: Node;
    public get GameOverPandel(): Node {
        return this.gameOverPandel;
    }
    public set GameOverPandel(value: Node) {
        this.gameOverPandel = value;
    }

    @property({
        type: Button,
        tooltip: 'UnMuteBtn'
    })
    private unMuteBtn: Button;

    @property({
        type: Button,
        tooltip: 'MuteBtn'
    })
    private muteBtn: Button;
    public get UnMuteBtn(): Button {
        return this.unMuteBtn;
    }
    public set UnMuteBtn(value: Button) {
        this.unMuteBtn = value;
    }

    public get MuteBtn(): Button {
        return this.muteBtn;
    }
    public set MuteBtn(value: Button) {
        this.muteBtn = value;
    }
}

