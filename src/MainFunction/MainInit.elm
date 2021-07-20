module MainFunction.MainInit exposing (init)

{-| The init of MainModel.


# init

@docs init

-}

import Browser.Dom exposing (Viewport, getViewport)
import Level0.Level0Init as Level0Init
import Level1.Level1Init as Level1Init
import Level2.Level2Init as Level2Init
import Level3.Level3Init as Level3Init
import Level4.Level4Init as Level4Init
import Level6.Level6Init as Level6Init
import Level5.Level5Init as Level5Init
import MainFunction.MainModel as MainModel
import MainFunction.MainType as MainType
import Menu.MenuInit as MenuInit
import Task


{-| The `init` of MainModel.
-}
init : () -> ( MainModel.Model, Cmd MainType.Msg )
init a =
    let
        mainModel =
            { mainScene = MainType.Menu
            , level0Model = Level0Init.init () |> Tuple.first
            , level1Model = Level1Init.init () |> Tuple.first
            , level2Model = Level2Init.init () |> Tuple.first
            , level3Model = Level3Init.init () |> Tuple.first
            , level4Model = Level4Init.init () |> Tuple.first
            , level6Model = Level6Init.init () |> Tuple.first
            , level5Model = Level5Init.init () |> Tuple.first
            , menuModel = MenuInit.init () |> Tuple.first
            }
    in
    ( mainModel, Task.perform MainType.GetViewport getViewport )
