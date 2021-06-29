module MainUpdate exposing (update)

{-| Main update.


# update

@docs update

-}

import Level1Update
import MainType
import MainModel

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
