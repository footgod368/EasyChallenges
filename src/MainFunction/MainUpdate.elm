module MainUpdate exposing (update)

{-| Main update.


# update

@docs update

-}

import Level1Update
import Level2Update
import MainModel
import MainType


{-| `update` of main game
-}
update : MainType.Msg -> MainModel.Model -> ( MainModel.Model, Cmd MainType.Msg )
update msg model =
    case model.scene of
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
        
