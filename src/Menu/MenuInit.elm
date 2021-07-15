module MenuInit exposing (init)

import Array

init : Model
init =
    Model
        Menu
        MainMenu
        []
        (Array.fromList (List.map (\e -> buttonNormalColor) (List.range 0 buttonNum)))
        (Ball (degrees -135) ( 460, 500 ) Circle)
        0
