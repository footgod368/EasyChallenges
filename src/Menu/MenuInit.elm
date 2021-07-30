module Menu.MenuInit exposing (init)

{-| Init for the Menu


# Init

@docs init

-}

import Array
import Browser.Dom exposing (getViewport)
import MainFunction.MainConstant as MainConstant
import MainFunction.MainType as MainType
import Menu.MenuType as MenuType
import Task


{-| Init for the Menu, nothing special
-}
init : () -> ( MenuType.Model, Cmd MainType.Msg )
init _ =
    ( { mainStatus = MainType.Menu
      , menuStatus = MenuType.MainMenu
      , keyPressed = []
      , buttonState =
            Array.fromList (List.map (\_ -> MainConstant.buttonNormalColor) (List.range 0 100))
      , windowBoundary = ( 1000.0, 800.0 )
      }
    , Task.perform MainType.GetViewport getViewport
    )
