module Modules.GoldenDog exposing (view)

{-| The figure that says some humorous words when player is dead.


# view

@docs view

-}

import GlobalFunction.GlobalBasics as GlobalBasics
import MainFunction.MainType as MainType
import Maybe exposing (withDefault)
import Modules.GameControl as GameControl
import Modules.Player as Player
import Svg exposing (Svg)
import Svg.Attributes as SvgAttr


fallWords : List (List String)
fallWords =
    [ [ "Oh, who knew that falling into the black pit is bad?", " Everyone but not you apparently" ]
    , [ "You really didn’t see the giant hole?", "It was almost as big as the hole in your brain" ]
    , [ "Are you blind? It was right in front of you!" ]
    , [ "Timberrrrrr" ]
    , [ "This is not what he meant when he sang", "I believe I can fly" ]
    , [ "Ouch, that’s gotta hurt" ]
    , [ "Thanks for throwing out the trash for me" ]
    ]


needleWords : List (List String)
needleWords =
    [ [ "That stings huh?" ]
    , [ "Congratulations, you got killed by a plant" ]
    , [ "That’s what you get for going vegan" ]
    , [ "Oh, I thought this llama was good =( " ]
    , [ "Killed by a kitty cat, wow. Just wow" ]
    , [ "“Seriously? You died from THAT?" ]
    ]


viewGoldenDog : List (Svg MainType.Msg)
viewGoldenDog =
    [ Svg.rect
        [ SvgAttr.x (String.fromFloat 10.0)
        , SvgAttr.y (String.fromFloat 10.0)
        , SvgAttr.width "80"
        , SvgAttr.height "80"
        , SvgAttr.fill "#DDDD00"
        ]
        []
    ]


viewOneLine : ( Float, Float ) -> String -> List (Svg MainType.Msg)
viewOneLine ( x, y ) text =
    [ Svg.text_
        [ SvgAttr.x (String.fromFloat x)
        , SvgAttr.y (String.fromFloat y)
        , SvgAttr.fontSize "20"
        , SvgAttr.textAnchor "left"
        , SvgAttr.fill "#e85239"
        ]
        [ Svg.text text ]
    ]


viewOneSentence : List (List String) -> Int -> List (Svg MainType.Msg)
viewOneSentence textList n =
    let
        listN =
            List.length textList

        chosenN =
            modBy listN n

        text =
            textList
                |> List.drop chosenN
                |> List.head
                |> withDefault []
    in
    List.concat
        (List.map
            (\i ->
                viewOneLine
                    ( 100, 20 * (toFloat i + 1.5) )
                    (text
                        |> List.drop i
                        |> List.head
                        |> withDefault "Error"
                    )
            )
            (List.range 0 (List.length text - 1))
        )


{-| Drawing the golden dog figure and says words
-}
view : { model | player : Player.Player, windowBoundary : GlobalBasics.Pos, gameControl : GameControl.GameControl } -> List (Svg MainType.Msg)
view model =
    List.concat
        [ viewGoldenDog
        , let
            ( deadTimes, deadType ) =
                model.player.deadTimes

            ( windowBoundaryX, windowBoundaryY ) =
                model.windowBoundary
          in
          if deadTimes == 1 then
            []

          else
            case deadType of
                Player.FallFromHigh ->
                    viewOneSentence fallWords deadTimes

                Player.StepOnNeedle ->
                    viewOneSentence needleWords deadTimes
        ]
