module Level1.Level1Type exposing (Model)

{-| stores level1 Model


# Model

@docs Model

-}

import Array exposing (Array)
import GlobalFunction.GlobalBasics as GlobalBasics
import MainFunction.MainType as MainType
import Modules.Boundary as Boundary
import Modules.Brick as Brick
import Modules.EndPoint as EndPoint
import Modules.Event as Event
import Modules.GameControl as GameControl
import Modules.Monster as Monster
import Modules.Needle as Needle
import Modules.NoticeBoard as NoticeBoard
import Modules.Player as Player
import Modules.SavePoint as SavePoint


{-| `Model` that used in level1
-}
type alias Model =
    { windowBoundary : GlobalBasics.Pos
    , levelBoundary : GlobalBasics.Pos
    , actEvent : Array Event.ActEvent
    , event : Array Event.Event
    , boundary : Boundary.Boundary
    , playerAtLastSavePoint: Player.Player
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
