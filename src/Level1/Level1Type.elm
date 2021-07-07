module Level1Type exposing (Model)

{-| stores level1 Model


# Model

@docs Model

-}

import Array exposing (Array)
import Brick
import Browser.Dom exposing (Viewport)
import Event
import Player
import GlobalBasics


{-| `Model` that used in level1
-}
type alias Model =
    { windowBoundary : GlobalBasics.Pos
    , levelBoundary : GlobalBasics.Pos
    , actEvent : Array Event.ActEvent
    , event : Array Event.Event
    , player : Player.Player
    , bricks : Array Brick.Brick
    , keyPressed : List Int
    }
