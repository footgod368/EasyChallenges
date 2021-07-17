module MainUpdate exposing (update)

{-| Main update.


# update

@docs update

-}

import Browser.Dom exposing (getViewport)
import Level0Init
import Level0Update
import Level1Init
import Level1Update
import Level2Init
import Level2Update
import Level3Init
import Level3Update
import MainModel
import MainType
import MenuUpdate
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
            ( { model | level1Model = newLevel1Model }, cmd )

        MainType.Level2 ->
            let
                ( newLevel2Model, cmd ) =
                    Level2Update.update msg model.level2Model
            in
            ( { model | level2Model = newLevel2Model }, cmd )

        MainType.Level3 ->
            let
                ( newLevel3Model, cmd ) =
                    Level3Update.update msg model.level3Model
            in
            ( { model | level3Model = newLevel3Model }, cmd )
