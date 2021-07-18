module Menu.MenuInit exposing (init)

import Array
import Browser.Dom exposing (getViewport)
import MainFunction.MainConstant as MainConstant
import MainFunction.MainType as MainType
import Menu.MenuType as MenuType
import Task


init : () -> ( MenuType.Model, Cmd MainType.Msg )
init a =
    ( { mainStatus = MainType.Menu
      , menuStatus = MenuType.MainMenu
      , keyPressed = []
      , buttonState =
            Array.fromList (List.map (\i -> MainConstant.buttonNormalColor) (List.range 0 10))
      , windowBoundary = ( 1000.0, 800.0 )
      }
    , Task.perform MainType.GetViewport getViewport
    )
