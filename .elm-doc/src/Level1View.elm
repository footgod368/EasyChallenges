module Level1.Level1View exposing (view)

{-| Level1 view


# view

@docs view

-}

import Modules.Boundary as Boundary
import Modules.Brick as Brick
import Modules.EndPoint as EndPoint
import Modules.GameControl as GameControl
import Html exposing (Html, div)
import Html.Attributes as HtmlAttr
import Level1.Level1Type as Level1Type
import MainFunction.MainType as MainType
import Modules.Monster as Monster
import Needle
import Modules.NoticeBoard as NoticeBoard
import Modules.Player as Player
import SavePoint
import Svg
import Svg.Attributes as SvgAttr


{-| `view` of level1.
-}
view : Level1Type.Model -> Html MainType.Msg
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
                ++ Monster.view model
                ++ Player.view model
                ++ GameControl.view model
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
