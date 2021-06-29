module MainSubscriptions exposing (subscriptions)

{-| The main subscriptions. Since most of our game just needs tick, keyDown, keyUp, and MouseEvents, I declare it
like this.


# subscriptions

@docs subscriptions, keyDown, keyUp

-}

import Browser.Events exposing (onAnimationFrameDelta, onKeyDown, onKeyUp)
import Html.Events exposing (keyCode)
import Json.Decode as Decode
import MainType
import MainModel
import Time


{-| `subscriptions` handles tick, key press, key up and key down.
-}
subscriptions : MainModel.Model -> Sub MainType.Msg
subscriptions model =
    Sub.batch
        [ Time.every 8 MainType.Tick
        , onKeyDown (Decode.map keyDown keyCode)
        , onKeyUp (Decode.map keyUp keyCode)
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
