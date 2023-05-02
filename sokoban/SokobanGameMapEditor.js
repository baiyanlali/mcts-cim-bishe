import SokobanGame from "./SokobanGame.js";
import Sokoban, {SokobanTile} from "./sokoban.js"

export const sketch_sokoban_editor = (s) =>{

    s.preload = () =>{
        s.box = s.loadImage('image/sokoban/Box.png')
        s.destination = s.loadImage('image/sokoban/Destination.png')
        s.player = s.loadImage('image/sokoban/Player.png')
        s.wall = s.loadImage('image/sokoban/Wall.png')
        s.boxEnd = s.loadImage('image/sokoban/BoxEnd.png')
    }

    s.hasSetup = false
    s.onSetup = null
    s.onSetupParams = null

    s.setup = () => {
        s.canvas = s.createCanvas(200, 200)
        s.clear()
        s.hasSetup = true

        if(s.onSetup !== null){
            s.onSetup(s.onSetupParams[0], s.onSetupParams[1])
        }

        s.tileNum = 5
        s.board = Array.from({length: s.tileNum}, ()=>new Array(s.tileNum).fill(0))
        s.board[0][0] = SokobanTile.Player
    }

    s.mousePressed = () => {

        if (!(s.mouseX > 0 && s.mouseY > 0 && s.mouseX < s.width && s.mouseY < s.height && s.tree)) return;

        s.tileSize = (s.width - 20)/tileNum;
        
        let tile_x = Math.floor(s.mouseX / s.tileNum)
        let tile_y = Math.floor(s.mouseX / s.tileNum)
        
        s.board[tile_x][tile_y] += s.board[tile_x][tile_y]
        if(s.board[tile_x][tile_y] === SokobanTile.UNKNOWN) s.board[tile_x][tile_y] = SokobanTile.Empty
        
    }

    s.changeSize = (row, column)=>{

        s.board = Array.from({length: row}, ()=>new Array(column).fill(0))
        s.board[0][0] = SokobanTile.Player


    }

    s.getBoard =()=> s.board

    s.draw = ()=>{
    }

    s.drawBoard = (board, end) => {

        if(s.hasSetup === false){
            s.onSetup = s.drawBoard
            s.onSetupParams = [board, end]
            return
        }

        // s.noSmooth()

        let tileNum = Math.max(board.length, board[0].length)
        s.tileSize = (s.width - 20)/tileNum;
        s.clear()
        for (let i = 0; i < tileNum; i++) {
            for (let j = 0; j < tileNum; j++) {
                let tile = board[i][j];

                let object_on_current_tile = null

                switch (tile) {
                    case SokobanTile.Player:
                        object_on_current_tile = s.player
                        break
                    case SokobanTile.Wall:
                        object_on_current_tile = s.wall
                        break
                    case SokobanTile.Box:
                        if( s.hasEndPositions([i, j], end))
                            object_on_current_tile = s.boxEnd
                        else
                            object_on_current_tile = s.box

                        break
                    case SokobanTile.End:
                        object_on_current_tile = s.destination
                        break
                }


                if(object_on_current_tile!== null)
                    s.image(object_on_current_tile, j * s.tileSize, i * s.tileSize, s.tileSize, s.tileSize)
            }
        }
    }

    s.hasEndPositions = (pos, end)=>{
        for (let i = 0; i < end.length; i++) {
            let end_position = end[i]
            if (end_position[0] === pos[0] && end_position[1] === pos[1]) return true
        }
        return false
    }


}

export default class SokobanMapEditor{

}