module MainUpdate exposing (update)

{-| Main update.


# update

@docs update

-}

import Level0Update
import Level1Update
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
