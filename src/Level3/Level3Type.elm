module Level3Type exposing (Model)

{-| stores level3 Model


# Model

@docs Model

-}

import Array exposing (Array)
import Boundary
import Brick
import EndPoint
import Event
import GlobalBasics
import Needle
import NoticeBoard
import Player
import SavePoint


{-| `Model` that used in level3
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
    , keyPressed : List Int
    }
