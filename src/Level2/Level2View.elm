module Level2View exposing (view)

{-| Level2 view


# view

@docs view

-}

import Boundary
import Brick
import EndPoint
import Html exposing (Html, div)
import Html.Attributes as HtmlAttr
import Level2Type
import MainType
import Needle
import NoticeBoard
import Player
import SavePoint
import Svg
import Svg.Attributes as SvgAttr


{-| `view` of level2.
-}
view : Level2Type.Model -> Html MainType.Msg
view model =
    div
        [ HtmlAttr.style "position" "relative"
        , HtmlAttr.style "width" "95%"
        , HtmlAttr.style "height" "95%"
        , HtmlAttr.style "left" "5px"
        , HtmlAttr.style "top" "5px"
        ]
        [ Svg.svg
            [ SvgAttr.width (String.fromFloat (Tuple.first model.windowBoundary))
            , SvgAttr.height (String.fromFloat (Tuple.second model.windowBoundary))
            ]
            (SavePoint.view model
                ++ Brick.view model
                ++ EndPoint.view model
                ++ Boundary.view model
                ++ NoticeBoard.view model
                ++ Needle.view model
                ++ Player.view model
            )
        , Html.audio
            [ HtmlAttr.width 0
            , HtmlAttr.height 0
            , if
                List.member 37 model.keyPressed
                    || List.member 39 model.keyPressed
                    || List.member 65 model.keyPressed
                    || List.member 68 model.keyPressed
              then
                HtmlAttr.src "assets/lah.ogg"

              else if
                List.member 38 model.keyPressed
                    || List.member 87 model.keyPressed
              then
                HtmlAttr.src "assets/tech.ogg"

              else
                HtmlAttr.src "assets/latex.ogg"
            , HtmlAttr.autoplay True
            , HtmlAttr.loop True
            ]
            []
        ]