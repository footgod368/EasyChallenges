module MainView exposing (..)

import Html exposing (Html, div)
import Level0View
import Level1View
import Level2View
import Level3View
import MainModel
import MainType
import MenuView


view : MainModel.Model -> Html MainType.Msg
view model =
    case model.mainScene of
        MainType.Menu ->
            MenuView.view model.menuModel

        MainType.Level0 ->
            Level0View.view model.level0Model

        MainType.Level1 ->
            Level1View.view model.level1Model

        MainType.Level2 ->
            Level2View.view model.level2Model

        MainType.Level3 ->
            Level3View.view model.level3Model
