module MainInit exposing (init)

{-| The init of MainModel.


# init

@docs init

-}

import Browser.Dom exposing (Viewport, getViewport)
import Level1Init
import Level2Init
import MainModel
import MainType
import Task


{-| The `init` of MainModel.
-}
init : () -> ( MainModel.Model, Cmd MainType.Msg )
init a =

    let
        ( level1Model, level1Cmd ) =
            Level1Init.init()

        ( level2Model, level2Cmd ) =
            Level2Init.init()

        mainModel =
            MainModel.Model MainType.Level2 level1Model level2Model

        mainCmd =
            Cmd.batch
                [ level1Cmd
                , level2Cmd
                ]
    in
    ( mainModel, mainCmd )
