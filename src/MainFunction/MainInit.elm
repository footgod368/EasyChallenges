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
    let
        ( level1Model, level1Cmd ) =
            Level1Init.init ()

        mainModel =
            MainModel.Model MainType.Level1 level1Model

        mainCmd =
            Cmd.batch
                [ level1Cmd
                ]
    in
    ( mainModel, mainCmd )
