module MenuView exposing (view)

{-| functions that names are their meanings
-}

import Array
import Html exposing (Html, div)
import Html.Attributes as HtmlAttr
import MainConstant
import Maybe exposing (withDefault)
import MainType
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
            ,HtmlAttr.src "assets/rimworldMove.mp3"
            , HtmlAttr.preload "auto"
            , HtmlAttr.autoplay True
            , HtmlAttr.loop True
            ]
            []
        , Svg.svg
            [ SvgAttr.width "1200"
            , SvgAttr.height "850"
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
        [ Svg.text "Intergalactic Betrayal" ]
    ]


drawButtons : MenuType.Model -> List (Svg MainType.Msg)
drawButtons model =
    [ --start button
      Svg.rect
        [ SvgAttr.x "420"
        , SvgAttr.y "450"
        , SvgAttr.width "250"
        , SvgAttr.height "80"
        , SvgAttr.fill (withDefault "White" (Array.get MainConstant.menuButtonLevel0 model.buttonState))
        ]
        []
    , Svg.text_
        [ SvgAttr.x "545"
        , SvgAttr.y "495"
        , SvgAttr.fontSize "30"
        , SvgAttr.textAnchor "middle"
        , SvgAttr.fill "#e85239"
        ]
        [ Svg.text "Level 0" ]
    , Svg.rect
        [ SvgAttr.x "420"
        , SvgAttr.y "450"
        , SvgAttr.width "250"
        , SvgAttr.height "80"
        , SvgAttr.fill "#00000000"
        , SvgEvent.onMouseOver (MainType.OnMouseOver MainConstant.menuButtonLevel0)
        , SvgEvent.onMouseOut (MainType.OnMouseOut MainConstant.menuButtonLevel0)
        , SvgEvent.onMouseDown (MainType.OnMouseDown MainConstant.menuButtonLevel0)
        , SvgEvent.onMouseUp (MainType.OnMouseUp MainConstant.menuButtonLevel0)
        ]
        []
    , Svg.rect
        [ SvgAttr.x "420"
        , SvgAttr.y "550"
        , SvgAttr.width "250"
        , SvgAttr.height "80"
        , SvgAttr.fill (withDefault "White" (Array.get MainConstant.menuButtonLevel1 model.buttonState))
        ]
        []
    , Svg.text_
        [ SvgAttr.x "545"
        , SvgAttr.y "595"
        , SvgAttr.fontSize "30"
        , SvgAttr.textAnchor "middle"
        , SvgAttr.fill "#e85239"
        ]
        [ Svg.text "Level 1" ]
    , Svg.rect
        [ SvgAttr.x "420"
        , SvgAttr.y "550"
        , SvgAttr.width "250"
        , SvgAttr.height "80"
        , SvgAttr.fill "#00000000"
        , SvgEvent.onMouseOver (MainType.OnMouseOver MainConstant.menuButtonLevel1)
        , SvgEvent.onMouseOut (MainType.OnMouseOut MainConstant.menuButtonLevel1)
        , SvgEvent.onMouseDown (MainType.OnMouseDown MainConstant.menuButtonLevel1)
        , SvgEvent.onMouseUp (MainType.OnMouseUp MainConstant.menuButtonLevel1)
        ]
        []
    ]