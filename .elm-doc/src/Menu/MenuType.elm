module Menu.MenuType exposing (MenuStatus(..), Model)

import Array exposing (Array)
import GlobalFunction.GlobalBasics as GlobalBasics
import MainFunction.MainType as MainType


type MenuStatus
    = MainMenu


type alias Model =
    { mainStatus : MainType.MainScene
    , menuStatus : MenuStatus
    , keyPressed : List Int
    , buttonState : Array String
    , windowBoundary : GlobalBasics.Pos
    }
