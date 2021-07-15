module MainUpdate exposing (update)

{-| Main update.


# update

@docs update

-}

import Level0Update
import Level0Init
import Level1Update
import Level1Init
import Level2Update
import MainModel
import MainType
import MenuUpdate



changeToLevel : MainType.MainScene -> ( MainModel.Model, Cmd MainType.Msg ) -> ( MainModel.Model, Cmd MainType.Msg )
changeToLevel newScene ( model, cmd ) =
    let
        newModel =
            { model | scene = newScene }
    in
    case newScene of
        MainType.Level0 ->
            ( { newModel | level0Model = Level0Init.init () |> Tuple.first } , cmd )

        MainType.Level1 ->
            ( { newModel | level1Model = Level1Init.init () |> Tuple.first } , cmd )

        _ ->
            ( newModel, cmd )


{-| `update` of main game
-}
update : MainType.Msg -> MainModel.Model -> ( MainModel.Model, Cmd MainType.Msg )
update msg model =
    case model.scene of
        MainType.Menu ->
            let
                ( newMenuModel, cmd ) =
                    MenuUpdate.update msg ( model.menuModel, Cmd.none )
            in
            if newMenuModel.mainStatus /= MainType.Menu then
                changeToLevel newMenuModel.mainStatus ( { model | menuModel = newMenuModel }, cmd )

            else
                ( { model | menuModel = newMenuModel }, cmd )

        MainType.Level0 ->
            let
                ( newLevel0Model, cmd ) =
                    Level0Update.update msg model.level0Model
            in
            ( { model | level0Model = newLevel0Model }, cmd )

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