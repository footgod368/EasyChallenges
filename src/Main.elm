module Main exposing (main)

{-| Main entry of the game.


# Main

@docs main

-}

import Browser
import MainFunction.MainInit as MainInit
import MainFunction.MainModel as MainModel
import MainFunction.MainSubscriptions as MainSubscriptions
import MainFunction.MainType as MainType
import MainFunction.MainUpdate as MainUpdate
import MainFunction.MainView as MainView


{-| main function. What else can I say
-}
main : Program () MainModel.Model MainType.Msg
main =
    Browser.element
        { init = MainInit.init
        , update = MainUpdate.update
        , view = MainView.view
        , subscriptions = MainSubscriptions.subscriptions
        }
