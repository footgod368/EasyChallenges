module Menu.MenuType exposing (MenuStatus(..), Model)

{-| The Model definition for Menu


# Menu

@docs MenuStatus, Model

-}

import Array exposing (Array)
import GlobalFunction.GlobalBasics as GlobalBasics
import MainFunction.MainType as MainType


{-| The status of the menu, currently no usage.
-}
type MenuStatus
    = MainMenu


{-| The Model used in Menu, variables' usage can be seen from names. All the things are coverd in level1Type doc.
-}
type alias Model =
    { mainStatus : MainType.MainScene
    , menuStatus : MenuStatus
    , keyPressed : List Int
    , buttonState : Array String
    , windowBoundary : GlobalBasics.Pos
    }
