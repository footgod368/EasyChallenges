module Level1Type exposing (Model)

{-| stores level1 Model


# Model

@docs Model

-}

import Array exposing (Array)
import Boundary
import Brick
import Event
import GlobalBasics
import Player


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
    , keyPressed : List Int
    }
