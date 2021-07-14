module MainView exposing (..)

import Html exposing (Html, div)
import Level1View
import Level2View
import MainModel
import MainType


view : MainModel.Model -> Html MainType.Msg
view model =
    case model.scene of
        MainType.Level1 ->
            Level1View.view model.level1Model
        MainType.Level2 ->
            Level2View.view model.level2Model