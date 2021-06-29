module Main exposing (main)

{-| Main entry of the game.


# main

#docs main

-}

import Browser
import MainInit
import MainSubscriptions
import MainUpdate
import MainView


{-| main function. What else can I say
-}
main =
    Browser.element
        { init = MainInit.init
        , update = MainUpdate.update
        , view = MainView.view
        , subscriptions = MainSubscriptions.subscriptions
        }
