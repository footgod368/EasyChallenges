module MainView exposing (..)

import Html exposing (Html, div)
import Level1View
import MainType
import MainModel


view : MainModel.Model -> Html MainType.Msg
view model =
    case model.scene of
        MainType.Level1 ->
            Level1View.view model.level1Model