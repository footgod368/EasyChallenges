module MainInit exposing (init)

{-| The init of MainModel.


# init

@docs init

-}

import Browser.Dom exposing (Viewport, getViewport)
import Level0Init
import Level1Init
import Level2Init
import Level3Init
import MainModel
import MainType
import MenuInit
import Task


{-| The `init` of MainModel.
-}
init : () -> ( MainModel.Model, Cmd MainType.Msg )
init a =
    let
        mainModel =
            { scene = MainType.Menu
            , level0Model = Level0Init.init () |> Tuple.first
            , level1Model = Level1Init.init () |> Tuple.first
            , level2Model = Level2Init.init () |> Tuple.first
            , level3Model = Level3Init.init () |> Tuple.first
            , menuModel = MenuInit.init () |> Tuple.first
            }
    in
    ( mainModel, Cmd.none )
