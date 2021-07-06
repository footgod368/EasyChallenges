module Level1Type exposing (Model)

{-| stores level1 Model

# Model

@docs Model

-}

import Array exposing (Array)
import Event
import Player
import Brick
import Browser.Dom exposing (Viewport)

{-| `Model` that used in level1
-}
type alias Model =
    { size : (Float, Float)
    , actEvent : Array Event.ActEvent
    , event : Array Event.Event
    , player : Player.Player
    , bricks : Array Brick.Brick
    , keyPressed : List Int
    }
