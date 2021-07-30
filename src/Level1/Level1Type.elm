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
import Modules.Sound as Sound


{-| `Model` that used in level1. Nothing special. windowBoundary stores the size of the current window, levelBoundary
stores the size of the levels. These two sizes work together to make window in the game changes correctly. actEvent is
the events that are activated in the game, which is part of the event module. The following a lot are the modules of the
level individually. mainScene stores that current game status (which level is in), changing it will cause to the whole
game status change. keyPressed stores the keys that player presses.
-}
type alias Model =
    { windowBoundary : GlobalBasics.Pos
    , levelBoundary : GlobalBasics.Pos
    , actEvent : Array Event.ActEvent
    , event : Array Event.Event
    , boundary : Boundary.Boundary
    , playerAtLastSavePoint : Player.Player
    , player : Player.Player
    , bricks : Array Brick.Brick
    , savePoints : Array SavePoint.SavePoint
    , endPoint : EndPoint.EndPoint
    , noticeBoards : Array NoticeBoard.NoticeBoard
    , needles : Array Needle.Needle
    , monsters : Array Monster.Monster
    , gameControl : GameControl.GameControl
    , sound : Sound.Sound
    , mainScene : MainType.MainScene
    , keyPressed : List Int
    }
