module Main exposing (main)

{-| Main entry of the game.


# main

#docs main

-}

import Browser
import MainFunction.MainInit as MainInit
import MainFunction.MainSubscriptions as MainSubscriptions
import MainFunction.MainUpdate as MainUpdate
import MainFunction.MainView as MainView


{-| main function. What else can I say
-}
main =
    Browser.element
        { init = MainInit.init
        , update = MainUpdate.update
        , view = MainView.view
        , subscriptions = MainSubscriptions.subscriptions
        }
