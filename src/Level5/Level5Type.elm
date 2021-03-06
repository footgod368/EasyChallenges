module Level5.Level5Type exposing (Model)

{-| stores level5 Model


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
import Modules.Needle as Needle
import Modules.NoticeBoard as NoticeBoard
import Modules.Player as Player
import Modules.SavePoint as SavePoint
import Modules.Sound as Sound


{-| `Model` that used in level5. See in level1Type, highly repetition.
-}
type alias Model =
    { windowBoundary : GlobalBasics.Pos
    , levelBoundary : GlobalBasics.Pos
    , actEvent : Array Event.ActEvent
    , event : Array Event.Event
    , boundary : Boundary.Boundary
    , playerAtLastSavePoint : Player.Player -- store the state of player at last savePoint
    , player : Player.Player
    , bricks : Array Brick.Brick
    , savePoints : Array SavePoint.SavePoint
    , endPoint : EndPoint.EndPoint
    , noticeBoards : Array NoticeBoard.NoticeBoard
    , needles : Array Needle.Needle
    , gameControl : GameControl.GameControl
    , sound : Sound.Sound
    , mainScene : MainType.MainScene
    , keyPressed : List Int
    , number : List Int -- record the id's of events that have been activated
    }
