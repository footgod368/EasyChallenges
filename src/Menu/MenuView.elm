module Menu.MenuView exposing (view)

{-| View function for the Menu


# View

@docs view

-}

import Array
import GlobalFunction.GlobalBasics as GlobalBasics
import Html exposing (Html, div)
import Html.Attributes as HtmlAttr
import MainFunction.MainConstant as MainConstant
import MainFunction.MainType as MainType
import Maybe exposing (withDefault)
import Menu.MenuType as MenuType
import Svg exposing (Svg)
import Svg.Attributes as SvgAttr
import Svg.Events as SvgEvent


{-| View the Menu page
-}
view : MenuType.Model -> Html MainType.Msg
view model =
    div
        [ HtmlAttr.style "width" "100%"
        , HtmlAttr.style "height" "100%"
        , HtmlAttr.style "left" "50"
        , HtmlAttr.style "top" "50"
        , HtmlAttr.style "background-image" "url(assets/menuBackground.png)"
        , HtmlAttr.style "background-size" "100% 100%"
        , HtmlAttr.style "background-position" "0px 0px"
        ]
        [ Html.audio
            [ HtmlAttr.id "player"

            --, HtmlAttr.controls True
            --, HtmlAttr.src "assets/rimworldMove.mp3"
            , HtmlAttr.preload "auto"
            , HtmlAttr.autoplay True
            , HtmlAttr.loop True
            ]
            []
        , Svg.svg
            [ SvgAttr.width (String.fromFloat (Tuple.first model.windowBoundary))
            , SvgAttr.height (String.fromFloat (Tuple.second model.windowBoundary))
            ]
            (drawBackground model
                --    ++ drawBall model
                ++ drawButtons model
             --    ++ drawCrown model
            )
        ]


drawBackground : MenuType.Model -> List (Svg MainType.Msg)
drawBackground model =
    ----background
    --  [ Svg.rect
    --    [ SvgAttr.x "0"
    --    , SvgAttr.y "0"
    --    , SvgAttr.width "1200"
    --    , SvgAttr.height "850"
    --    , SvgAttr.fill "#000000"
    --    ]
    --    []
    --logo
    let
        ( windowBoundaryX, windowBoundaryY ) =
            model.windowBoundary
    in
    [ Svg.image
        [ SvgAttr.x "0"
        , SvgAttr.y "0"
        , SvgAttr.width "100"
        , SvgAttr.height "100"
        , SvgAttr.xlinkHref "assets/silverDogLogo.svg"
        ]
        []
    , Svg.text_
        [ SvgAttr.x (String.fromFloat (windowBoundaryX / 2 - 200.0))
        , SvgAttr.y "100"
        , SvgAttr.fontSize "60"
        , SvgAttr.textAnchor "left"
        , SvgAttr.fill "#A0E6E8"
        ]
        [ Svg.text "Easy Challenges" ]
    ]


drawLevelButton : MenuType.Model -> Int -> GlobalBasics.Pos -> List (Svg MainType.Msg)
drawLevelButton model buttonId ( x, y ) =
    [ Svg.rect
        [ SvgAttr.x (String.fromFloat x)
        , SvgAttr.y (String.fromFloat y)
        , SvgAttr.width "250"
        , SvgAttr.height "80"
        , SvgAttr.fill (withDefault "White" (Array.get buttonId model.buttonState))
        ]
        []
    , Svg.text_
        [ SvgAttr.x (String.fromFloat (x + 125.0))
        , SvgAttr.y (String.fromFloat (y + 45.0))
        , SvgAttr.fontSize "30"
        , SvgAttr.textAnchor "middle"
        , SvgAttr.fill "#e85239"
        ]
        [ Svg.text ("Level " ++ String.fromInt buttonId) ]
    , Svg.rect
        [ SvgAttr.x (String.fromFloat x)
        , SvgAttr.y (String.fromFloat y)
        , SvgAttr.width "250"
        , SvgAttr.height "80"
        , SvgAttr.fill "#00000000"
        , SvgEvent.onMouseOver (MainType.OnMouseOver buttonId)
        , SvgEvent.onMouseOut (MainType.OnMouseOut buttonId)
        , SvgEvent.onMouseDown (MainType.OnMouseDown buttonId)
        , SvgEvent.onMouseUp (MainType.OnMouseUp buttonId)
        ]
        []
    ]


drawButtons : MenuType.Model -> List (Svg MainType.Msg)
drawButtons model =
    let
        ( windowBoundaryX, windowBoundaryY ) =
            model.windowBoundary
    in
    List.concat
        [ drawLevelButton model MainConstant.menuButtonLevel7 ( windowBoundaryX / 2 + 200.0, 500.0 )
        , drawLevelButton model MainConstant.menuButtonLevel1 ( windowBoundaryX / 2 - 400.0, 200.0 )
        , drawLevelButton model MainConstant.menuButtonLevel2 ( windowBoundaryX / 2 - 400.0, 300.0 )
        , drawLevelButton model MainConstant.menuButtonLevel3 ( windowBoundaryX / 2 - 400.0, 400.0 )
        , drawLevelButton model MainConstant.menuButtonLevel4 ( windowBoundaryX / 2 + 200.0, 200.0 )
        , drawLevelButton model MainConstant.menuButtonLevel5 ( windowBoundaryX / 2 + 200.0, 300.0 )
        , drawLevelButton model MainConstant.menuButtonLevel6 ( windowBoundaryX / 2 + 200.0, 400.0 )
        ]
