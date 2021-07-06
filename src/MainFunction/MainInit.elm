module MainInit exposing (init)

{-| The init of MainModel.


# init

@docs init

-}

import Level1Init
import MainType
import MainModel
import Task
import Browser.Dom exposing (Viewport)
import Browser.Dom exposing (getViewport)

{-| The `init` of MainModel.
-}
init : () -> ( MainModel.Model, Cmd MainType.Msg )
init a =
    ( MainModel.Model
        MainType.Level1
        Level1Init.init
    , Task.perform MainType.GetViewport getViewport
    )
