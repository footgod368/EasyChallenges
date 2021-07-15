module MenuView exposing (view)

{-| functions that names are their meanings
-}

import Array
import Html exposing (Html, div)
import Html.Attributes as HtmlAttr
import Maybe exposing (withDefault)
import MainType
import MenuType exposing (MenuStatus(..), Model)
import Svg exposing (Svg)
import Svg.Attributes as SvgAttr
import Svg.Events as SvgEvent


view : Model -> Html MainType.Msg
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
            (drawBackground model)
            --    ++ drawBall model
            --    ++ drawButtons model
            --    ++ drawCrown model
            --)
        ]


drawBackground : Model -> List (Svg MainType.Msg)
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
        , SvgAttr.fill "#FFE6E8"
        ]
        [ Svg.text "Intergalactic Betrayal" ]
    ]


drawButtons : Model -> List (Svg MainType.Msg)
drawButtons model =
    [ --start button
      Svg.rect
        [ SvgAttr.x "420"
        , SvgAttr.y "450"
        , SvgAttr.width "250"
        , SvgAttr.height "80"
        , SvgAttr.fill (withDefault "White" (Array.get startGameButtonId model.buttonState))
        ]
        []
    , Svg.text_
        [ SvgAttr.x "545"
        , SvgAttr.y "495"
        , SvgAttr.fontSize "30"
        , SvgAttr.textAnchor "middle"
        , SvgAttr.fill "#e85239"
        ]
        [ Svg.text "start adventure" ]
    , Svg.rect
        [ SvgAttr.x "420"
        , SvgAttr.y "450"
        , SvgAttr.width "250"
        , SvgAttr.height "80"
        , SvgAttr.fill "#00000000"
        , SvgEvent.onMouseOver (OnMouseOver startGameButtonId)
        , SvgEvent.onMouseOut (OnMouseOut startGameButtonId)
        , SvgEvent.onMouseDown (OnMouseDown startGameButtonId)
        , SvgEvent.onMouseUp (OnMouseUp startGameButtonId)
        ]
        []
    ]


drawBall : Model -> List (Svg MainType.Msg)
drawBall model =
    [ Svg.circle
        [ SvgAttr.cx
            (model.ball.pos
                |> Tuple.first
                |> String.fromFloat
            )
        , SvgAttr.cy
            (model.ball.pos
                |> Tuple.second
                |> String.fromFloat
            )
        , SvgAttr.r
            (ballRadius
                |> String.fromFloat
            )
        , SvgAttr.fill "#FFE6E8"
        ]
        []
    ]


drawCrown : Model -> List (Svg MainType.Msg)
drawCrown model =
    case model.winner of
        0 ->
            []

        2 ->
            [ Svg.image
                [ SvgAttr.x "920"
                , SvgAttr.y "210"
                , SvgAttr.width "100"
                , SvgAttr.height "100"
                , SvgAttr.xlinkHref "assets/crown.svg"
                ]
                []
            ]

        1 ->
            [ Svg.image
                [ SvgAttr.x "1073"
                , SvgAttr.y "210"
                , SvgAttr.width "100"
                , SvgAttr.height "100"
                , SvgAttr.xlinkHref "assets/crown.svg"
                ]
                []
            ]

        3 ->
            [ Svg.image
                [ SvgAttr.x "920"
                , SvgAttr.y "210"
                , SvgAttr.width "100"
                , SvgAttr.height "100"
                , SvgAttr.xlinkHref "assets/crown.svg"
                ]
                []
            , Svg.image
                [ SvgAttr.x "1073"
                , SvgAttr.y "210"
                , SvgAttr.width "100"
                , SvgAttr.height "100"
                , SvgAttr.xlinkHref "assets/crown.svg"
                ]
                []
            ]

        _ ->
            []
