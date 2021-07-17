module MenuView exposing (view)

{-| functions that names are their meanings
-}

import Array
import GlobalBasics
import Html exposing (Html, div)
import Html.Attributes as HtmlAttr
import MainConstant
import MainType
import Maybe exposing (withDefault)
import MenuType
import Svg exposing (Svg)
import Svg.Attributes as SvgAttr
import Svg.Events as SvgEvent


view : MenuType.Model -> Html MainType.Msg
view model =
    div
        [ HtmlAttr.style "width" "100%"
        , HtmlAttr.style "height" "100%"
        , HtmlAttr.style "left" "50"
        , HtmlAttr.style "top" "50"
        , HtmlAttr.style "background-image" "url(assets/menuBackground.jpg)"
        , HtmlAttr.style "background-size" "100% 100%"
        , HtmlAttr.style "background-position" "0px 0px"
        ]
        [ Html.audio
            [ HtmlAttr.id "player"

            --, HtmlAttr.controls True
            , HtmlAttr.src "assets/rimworldMove.mp3"
            , HtmlAttr.preload "auto"
            , HtmlAttr.autoplay True
            , HtmlAttr.loop True
            ]
            []
        , Svg.svg
            [ SvgAttr.width (String.fromFloat (Tuple.first model.windowBoundary))
            , SvgAttr.height (String.fromFloat (Tuple.first model.windowBoundary))
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
    [ Svg.image
        [ SvgAttr.x "25"
        , SvgAttr.y "25"
        , SvgAttr.width "100"
        , SvgAttr.height "100"
        , SvgAttr.xlinkHref "assets/silverDogLogo.svg"
        ]
        []
    , Svg.text_
        [ SvgAttr.x "300"
        , SvgAttr.y "150"
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
    List.concat
        [ drawLevelButton model MainConstant.menuButtonLevel0 ( 300.0, 300.0 )
        , drawLevelButton model MainConstant.menuButtonLevel1 ( 300.0, 400.0 )
        , drawLevelButton model MainConstant.menuButtonLevel2 ( 300.0, 500.0 )
        , drawLevelButton model MainConstant.menuButtonLevel3 ( 300.0, 600.0 )
        ]
