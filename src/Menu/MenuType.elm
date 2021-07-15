module MenuType exposing (..)

import Array exposing (Array)
import MainType

type MenuStatus
    = MainMenu


type alias Model =
    { mainStatus : MainType.MainScene
    , menuStatus : MenuStatus
    , keyPressed : List Int
    , buttonState : Array String
    }
