module MainView exposing (..)

import Html exposing (Html, div)
import Html.Attributes as HtmlAttr
import Level1Type
import Level1View
import MainType
import MainModel
import Svg exposing (Svg)
import Svg.Attributes as SvgAttr


view : MainModel.Model -> Html MainType.Msg
view model =
    case model.scene of
        MainType.Level1 ->
            Level1View.view model.level1Model