module MainInit exposing (init)

{-| The init of MainModel.


# init

@docs init

-}

import Browser.Dom exposing (Viewport, getViewport)
import Level1Init
import MainModel
import MainType
import Task


{-| The `init` of MainModel.
-}
init : () -> ( MainModel.Model, Cmd MainType.Msg )
init a =
    ( MainModel.Model
        MainType.Level1
        Level1Init.init
    , Task.perform MainType.GetViewport getViewport
    )
