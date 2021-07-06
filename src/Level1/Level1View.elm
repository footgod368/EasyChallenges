module Level1View exposing (view)

{-| Level1 view


# view

@docs view

-}

import Brick
import Html exposing (Html, div)
import Html.Attributes as HtmlAttr
import Level1Type
import MainType
import Svg
import Svg.Attributes as SvgAttr
import Player

{-| `view` of level1.
-}
view : Level1Type.Model -> Html MainType.Msg
view model =
    div
        [ HtmlAttr.style "width" "100%"
        , HtmlAttr.style "height" "100%"
        , HtmlAttr.style "left" "50"
        , HtmlAttr.style "top" "50"
        ]
        [ Svg.svg
            [ SvgAttr.width (String.fromFloat ((Tuple.first model.size) * 0.9) )
            , SvgAttr.height (String.fromFloat ((Tuple.second model.size) * 0.9) )
            ]
            ( Player.view model
            ++ Brick.view model
            )
        , Html.audio
            [ HtmlAttr.width 0
            , HtmlAttr.height 0
            ,
            if List.member 37 model.keyPressed
                || List.member 39 model.keyPressed
                || List.member 65 model.keyPressed
                || List.member 68 model.keyPressed then
                HtmlAttr.src "assets/lah.ogg"
            else
                if List.member 38 model.keyPressed
                    || List.member 87 model.keyPressed then
                        HtmlAttr.src "assets/tech.ogg"

                else
                    HtmlAttr.src "assets/latex.ogg"
            , HtmlAttr.autoplay True
            , HtmlAttr.loop True
            ]
            []
        ]
