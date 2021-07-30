module MainFunction.MainSubscriptions exposing (subscriptions)

{-| The main subscriptions. Since most of our game just needs tick, keyDown, keyUp, and MouseEvents, I declare it
like this.


# subscriptions

@docs subscriptions

-}

import Browser.Events exposing (onKeyDown, onKeyUp, onResize)
import Html.Events exposing (keyCode)
import Json.Decode as Decode
import MainFunction.MainModel as MainModel
import MainFunction.MainType as MainType
import Time


{-| `subscriptions` handles tick, key press, key up, key down and onResize, which works for all scenes in the game.
-}
subscriptions : MainModel.Model -> Sub MainType.Msg
subscriptions _ =
    Sub.batch
        [ Time.every 8 MainType.Tick
        , onKeyDown (Decode.map keyDown keyCode)
        , onKeyUp (Decode.map keyUp keyCode)
        , onResize MainType.Resize
        ]


{-| `keyDown` handles keyDown event in Json. Used in `subscriptions`. Not exposed.
-}
keyDown : Int -> MainType.Msg
keyDown keyCode =
    MainType.KeyDown keyCode


{-| `keyUp` handles keyUp event in Json. Used in `subscriptions`. Not exposed.
-}
keyUp : Int -> MainType.Msg
keyUp keyCode =
    MainType.KeyUp keyCode
