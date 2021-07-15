module MainInit exposing (init)

{-| The init of MainModel.


# init

@docs init

-}

import Browser.Dom exposing (Viewport, getViewport)
import Level1Init
import Level2Init
import Level3Init
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

        ( level3Model, level3Cmd ) =
            Level3Init.init()

        mainModel =
            MainModel.Model MainType.Level3 level1Model level2Model level3Model

        mainCmd =
            Cmd.batch
                [ level1Cmd
                , level2Cmd
                , level3Cmd
                ]
    in
    ( mainModel, mainCmd )
