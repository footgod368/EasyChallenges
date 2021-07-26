module Level6.Level6View exposing (view)

{-| Level6 view


# view

@docs view

-}

import Html exposing (Html, div)
import Html.Attributes as HtmlAttr
import Level6.Level6Type as Level6Type
import MainFunction.MainType as MainType
import Modules.Boundary as Boundary
import Modules.Brick as Brick
import Modules.EndPoint as EndPoint
import Modules.GameControl as GameControl
import Modules.GoldenDog as GoldenDog
import Modules.Needle as Needle
import Modules.NoticeBoard as NoticeBoard
import Modules.Player as Player
import Modules.SavePoint as SavePoint
import Modules.Sound as Sound
import Svg
import Svg.Attributes as SvgAttr


{-| `view` of level6.
-}
view : Level6Type.Model -> Html MainType.Msg
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
            ( Sound.view model
                ++ SavePoint.view model
                ++ Brick.view model
                ++ EndPoint.view model
                ++ Boundary.view model
                ++ NoticeBoard.view model
                ++ Needle.view model
                ++ Player.view model
                ++ GameControl.view model
                ++ GoldenDog.view model
            )
        ]
