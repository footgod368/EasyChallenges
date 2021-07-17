module MenuType exposing (MenuStatus(..), Model)

import Array exposing (Array)
import GlobalBasics
import MainType


type MenuStatus
    = MainMenu


type alias Model =
    { mainStatus : MainType.MainScene
    , menuStatus : MenuStatus
    , keyPressed : List Int
    , buttonState : Array String
    , windowBoundary : GlobalBasics.Pos
    }
