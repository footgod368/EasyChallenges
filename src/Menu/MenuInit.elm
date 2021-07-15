module MenuInit exposing (init)

import Array
import MainConstant
import MainType
import MenuType


init : () -> ( MenuType.Model, Cmd MainType.Msg )
init a =
    ( { mainStatus = MainType.Menu
      , menuStatus = MenuType.MainMenu
      , keyPressed = []
      , buttonState =
            Array.fromList (List.map (\i -> MainConstant.buttonNormalColor) (List.range 0 10))
      }
    , Cmd.none
    )
