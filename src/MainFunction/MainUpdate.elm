module MainFunction.MainUpdate exposing (update)

{-| Main update.


# update

@docs update

-}

import Browser.Dom exposing (getViewport)
import Level0.Level0Init as Level0Init
import Level0.Level0Update as Level0Update
import Level1.Level1Init as Level1Init
import Level1.Level1Update as Level1Update
import Level2.Level2Init as Level2Init
import Level2.Level2Update as Level2Update
import Level3.Level3Init as Level3Init
import Level3.Level3Update as Level3Update
import Level4.Level4Init as Level4Init
import Level4.Level4Update as Level4Update
import Level6.Level6Init as Level6Init
import Level6.Level6Update as Level6Update
import MainFunction.MainModel as MainModel
import MainFunction.MainType as MainType
import Menu.MenuUpdate as MenuUpdate
import Task


changeToLevel : MainType.MainScene -> ( MainModel.Model, Cmd MainType.Msg ) -> ( MainModel.Model, Cmd MainType.Msg )
changeToLevel newScene ( model, cmd ) =
    let
        newModel =
            { model | mainScene = newScene }
    in
    case newScene of
        MainType.Level0 ->
            ( { newModel | level0Model = Level0Init.init () |> Tuple.first }, cmd )

        MainType.Level1 ->
            ( { newModel | level1Model = Level1Init.init () |> Tuple.first }, cmd )

        MainType.Level2 ->
            ( { newModel | level2Model = Level2Init.init () |> Tuple.first }, cmd )

        MainType.Level3 ->
            ( { newModel | level3Model = Level3Init.init () |> Tuple.first }, cmd )

        MainType.Level4 ->
            ( { newModel | level4Model = Level4Init.init () |> Tuple.first }, cmd )

        MainType.Level6 ->
            ( { newModel | level6Model = Level6Init.init () |> Tuple.first }, cmd )
        _ ->
            ( newModel, cmd )


{-| `update` of main game
-}
update : MainType.Msg -> MainModel.Model -> ( MainModel.Model, Cmd MainType.Msg )
update msg model =
    case model.mainScene of
        MainType.Menu ->
            let
                ( newMenuModel, cmd ) =
                    MenuUpdate.update msg ( model.menuModel, Cmd.none )
            in
            if newMenuModel.mainStatus /= MainType.Menu then
                changeToLevel newMenuModel.mainStatus ( model, Task.perform MainType.GetViewport getViewport )

            else
                ( { model | menuModel = newMenuModel }, cmd )

        MainType.Level0 ->
            let
                ( newLevel0Model, cmd ) =
                    Level0Update.update msg model.level0Model
            in
            ( { model | level0Model = newLevel0Model, mainScene = newLevel0Model.mainScene }, cmd )

        MainType.Level1 ->
            let
                ( newLevel1Model, cmd ) =
                    Level1Update.update msg model.level1Model
            in
            ( { model | level1Model = newLevel1Model, mainScene = newLevel1Model.mainScene }, cmd )

        MainType.Level2 ->
            let
                ( newLevel2Model, cmd ) =
                    Level2Update.update msg model.level2Model
            in
            ( { model | level2Model = newLevel2Model, mainScene = newLevel2Model.mainScene }, cmd )

        MainType.Level3 ->
            let
                ( newLevel3Model, cmd ) =
                    Level3Update.update msg model.level3Model
            in
            ( { model | level3Model = newLevel3Model, mainScene = newLevel3Model.mainScene }, cmd )

        MainType.Level4 ->
            let
                ( newLevel4Model, cmd ) =
                    Level4Update.update msg model.level4Model
            in
            ( { model | level4Model = newLevel4Model, mainScene = newLevel4Model.mainScene }, cmd )

        MainType.Level6 ->
            let
                ( newLevel6Model, cmd ) =
                    Level6Update.update msg model.level6Model
            in
            ( { model | level6Model = newLevel6Model, mainScene = newLevel6Model.mainScene }, cmd )