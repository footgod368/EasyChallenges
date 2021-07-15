module MenuInit exposing (init)

import Array
import MainType
import MenuType


init : () -> ( MenuType.Model, Cmd MainType.Msg )
init a =
    ( { mainStatus = MainType.Menu
      , menuStatus = MenuType.MainMenu
      , keyPressed = []
      , buttonState = Array.fromList []
      }
    , Cmd.none
    )
