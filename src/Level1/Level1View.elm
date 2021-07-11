module Level1View exposing (view)

{-| Level1 view


# view

@docs view

-}

import Boundary
import Brick
import Html exposing (Html, div)
import Html.Attributes as HtmlAttr
import Level1Type
import MainType
import Player
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
            [ SvgAttr.width (String.fromFloat (Tuple.first model.windowBoundary) )
            , SvgAttr.height (String.fromFloat (Tuple.second model.windowBoundary) )
            ]
            (Player.view model
                ++ Brick.view model
                ++ Boundary.view model
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
