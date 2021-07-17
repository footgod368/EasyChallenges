module Level1Type exposing (Model)

{-| stores level1 Model


# Model

@docs Model

-}

import Array exposing (Array)
import Boundary
import Brick
import EndPoint
import Event
import GameControl
import GlobalBasics
import MainType
import Monster
import Needle
import NoticeBoard
import Player
import SavePoint


{-| `Model` that used in level1
-}
type alias Model =
    { windowBoundary : GlobalBasics.Pos
    , levelBoundary : GlobalBasics.Pos
    , actEvent : Array Event.ActEvent
    , event : Array Event.Event
    , boundary : Boundary.Boundary
    , player : Player.Player
    , bricks : Array Brick.Brick
    , savePoints : Array SavePoint.SavePoint
    , endPoint : EndPoint.EndPoint
    , noticeBoards : Array NoticeBoard.NoticeBoard
    , needles : Array Needle.Needle
    , monsters : Array Monster.Monster
    , gameControl : GameControl.GameControl
    , mainScene : MainType.MainScene
    , keyPressed : List Int
    }
